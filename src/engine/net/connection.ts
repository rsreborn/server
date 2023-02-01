import { Socket } from 'net';
import { ByteBuffer, logger } from '@runejs/common';
import BigInteger from 'bigi';
import { SocketOptions } from './server';
import { Isaac } from './isaac';
import { Player, playerLogin, playerLogout, PlayerRights } from '../world/player';
import { handleInboundPacket, writePackets } from './packets';
import { handleOnDemandRequests } from './file-server';
import INBOUND_PACKET_SIZES from './packets/inbound-packet-sizes';
import { handleUpdateServerRequests } from './update-server';
import { archiveCounts, getArchives, getCache } from '../cache';
import { decodeBase37Username } from '../util/base37';

const RSA_EXPONENT = BigInteger('85749236153780929917924872511187713651124617292658988978182063731979923800090977664547424642067377984001222110909310620040899943594191124988795815431638577479242072599794149649824942794144264088097130432112910214560183536387949202712729964914726145231993678948421001368196284315651219252190430508607437712749');
const RSA_MODULUS = BigInteger('85851413706447406835286856960321868491021158946959045519533110967212579875747603892534938950597622190034801837526749417278303359405620369366942839883641648688111135276342550236485518612241524546375576253238379707601227775510104577557183947475438430283206434950768729692944226445159468674814615586984703672433');

export enum ConnectionType {
    GAME = 14,
    UPDATE = 15,
}

export enum ConnectionState {
    UPDATE = 'update',
    LOGIN = 'login_type',
    LOGGED_IN = 'logged_in',
}

export interface Connection {
    socket: Socket;
    connectionType?: ConnectionType;
    connectionState?: ConnectionState;
    serverKey?: bigint;
    clientKey1?: number;
    clientKey2?: number;
    buildNumber?: number;
    player?: Player;
    queuedFiles?: {
        indexNumber: number;
        fileNumber: number;
    }[];
}

const handleInboundPacketData = (
    player: Player,
    buffer?: ByteBuffer,
): void => {
    let packet = player.client.inboundPacket;

    if (!packet) {
        player.client.inboundPacket = packet = {
            opcode: null,
            size: null,
            buffer,
        };
    } else {
        if (!packet.buffer) {
            packet.buffer = buffer;
        } else if (buffer) {
            const readable = packet.buffer.readable;
            const newBuffer = new ByteBuffer(readable + buffer.length);
            packet.buffer.copy(newBuffer, 0, packet.buffer.readerIndex);
            buffer.copy(newBuffer, readable, 0);
            packet.buffer = newBuffer;
        }
    }

    if (packet.opcode === null) {
        packet.opcode = -1;
    }

    if (packet.size === null) {
        packet.size = -1;
    }

    const inCipher = player.client.inCipher;

    if (packet.opcode === -1) {
        if (packet.buffer.readable < 1) {
            // Waiting for more data
            return;
        }

        packet.opcode = packet.buffer.get('byte', 'u');
        packet.opcode = (packet.opcode - inCipher.rand()) & 0xff;
        packet.size = INBOUND_PACKET_SIZES[String(player.client.connection.buildNumber)]?.[String(packet.opcode)] ?? -3;
    }

    // Variable length packet
    if (packet.size === -1) {
        if (packet.buffer.readable < 1) {
            // Waiting for more data
            return;
        }

        packet.size = packet.buffer.get('byte', 'u');
    }

    let clearBuffer = false;
    if (packet.size === -3) {
        if (packet.buffer.readable < 1) {
            // Waiting for more data
            return;
        }

        packet.size = packet.buffer.readable;
        clearBuffer = true;
    }

    if (packet.buffer.readable < packet.size) {
        // Waiting for more data
        return;
    }

    // Read packet data
    let packetData = null;
    if (packet.size !== 0) {
        packetData = new ByteBuffer(packet.size);
        packet.buffer.copy(packetData, 0, packet.buffer.readerIndex,
        packet.buffer.readerIndex + packet.size);
        packet.buffer.readerIndex += packet.size;
    }

    if (!handleInboundPacket(player, packet.opcode, packetData)) {
       // logger.error(`Unhandled packet ${packet.opcode}.`);
        clearBuffer = true;
    }

    if (clearBuffer) {
        packet.buffer = null;
    }

    // Reset the pending packet in preparation for another one
    packet.opcode = null;
    packet.size = null;

    if (packet.buffer !== null && packet.buffer.readable > 0) {
        handleInboundPacketData(player);
    }
};

const dataReceived = (connection: Connection, data?: Buffer): void => {
    if (!data?.length) {
        // No data received
        return;
    }

    const buffer = new ByteBuffer(data || []);
    const { socket, connectionState, serverKey } = connection;
    let connectionType = connection.connectionType;

    const RESPONSE_OK = Buffer.from([ 0, 0, 0, 0, 0, 0, 0, 0 ]);

    if (!connectionType) {
        // Initial handshake
        connectionType = connection.connectionType = buffer.get('byte', 'u');

        if (connectionType === ConnectionType.GAME) {
            buffer.get('byte', 'u'); // byte name hash (unused by us)

            connection.serverKey = BigInt(Math.floor(Math.random() * 999999));

            if (buffer.readable >= 4) {
                // New engine
                connection.buildNumber = buffer.get('int', 'u');
                
                const response = new ByteBuffer(9);
                response.put(0); // response code - 0 for OK
                response.put(connection.serverKey, 'long');
                socket.write(response.toNodeBuffer());
            } else {
                // Old engine
                const response = new ByteBuffer(17);
                response.putBytes(RESPONSE_OK);
                response.put(0); // response code - 0 for OK
                response.put(connection.serverKey, 'long');
                socket.write(response.toNodeBuffer());
            }

            connection.connectionState = ConnectionState.LOGIN;
        } else if (connectionType === ConnectionType.UPDATE) {
            if (buffer.readable >= 4) {
                connection.buildNumber = buffer.get('int', 'u');
                logger.info(`Update Server build ${connection.buildNumber}.`);
                socket.write(Buffer.from([0]));
            } else if (buffer.readable >= 2) {
                connection.buildNumber = buffer.get('short', 'u');
                logger.info(`On-Demand build ${connection.buildNumber}.`);
                socket.write(RESPONSE_OK);
            }
            connection.connectionState = ConnectionState.UPDATE;
        } else {
            logger.error(`Invalid connection type ${connectionType} received.`);
        }
    } else {
        // Post-handshake
        if (connectionState === ConnectionState.UPDATE) {
            // Update server request
            if (connection.buildNumber < 400) {
                handleOnDemandRequests(connection, buffer);
            } else {
                handleUpdateServerRequests(connection, buffer);
            }
        } else if (connectionState === ConnectionState.LOGIN) {

            // Login type
            const loginOpcode = buffer.get('byte', 'u');
            if (loginOpcode !== 16 && loginOpcode !== 18) {
                logger.error(`Invalid login opcode ${loginOpcode} received!`);
                return;
            }

            const loginPacketSize = buffer.get('byte', 'u');
            let encryptedPacketSize = loginPacketSize - (36 + 1 + 1 + 2);

            const newEngine = !!connection.buildNumber; // @todo fix this - Kat 12/Nov/22 //buffer.readable <= 130;

            if (newEngine) {
                // New engine

                const buildNumber = buffer.get('int', 'u');
                if (connection.buildNumber !== buildNumber) {
                    logger.error(`Build number mismatch - handshake ${connection.buildNumber} vs login ${buildNumber}!`);
                    return;
                }
                // @todo ensure build is supported - Kat 11/Nov/22
            } else {
                // Old engine

                const magicNumber = buffer.get('byte', 'u');

                if (magicNumber !== 255) {
                    logger.error(`Invalid magic number ${magicNumber} received!`);
                    return;
                }

                connection.buildNumber = buffer.get('short', 'u');
                // @todo ensure build is supported - Kat 11/Nov/22
            }

            logger.info(`Login requested for build ${connection.buildNumber}.`);

            const lowMemory = buffer.get('byte', 'u') === 1;

            if (connection.buildNumber >= 460) {
                buffer.get('byte');
                while (buffer.get('byte') !== 0) {
                }
            }

            let checksumCount = !newEngine ? 9 : archiveCounts.get(connection.buildNumber);
            if (connection.buildNumber >= 460) {
                checksumCount++;
            }

            const checksums: number[] = new Array(checksumCount);
            const expectedChecksums: number[] = new Array(checksumCount);
            const archiveList = Array.from(Object.values(getArchives(connection.buildNumber)));
            let outOfDate = false;

            logger.info(`Checksum count for build ${connection.buildNumber}: ${checksumCount}`);

            // Cache checksums
            for (let i = 0; i < checksumCount; i++) {
                checksums[i] = buffer.get('int');

                if (!newEngine && i !== 0) {
                    expectedChecksums[i] = archiveList.find(archive => archive.archiveNumber === i)?.checksum ?? 0;
                    if (checksums[i] !== expectedChecksums[i]) {
                        // @todo do something with this - Kat 12/Nov/22
                        outOfDate = true;
                    }
                } else {
                    // @todo check old engine checksum 0 (hash of all checksums) - Kat 15/Nov/22
                }
            }

            // logger.info('Expected Checksums:');
            // logger.info(expectedChecksums);

            // logger.info('Received Checksums:');
            // logger.info(checksums);

            // The encrypted size includes the size byte which we don't need.
            encryptedPacketSize--;

            const reportedSize = buffer.get('byte', 'u');

            if (encryptedPacketSize !== reportedSize) {
                logger.error(`Encrypted login packet size mismatch; calculated ${encryptedPacketSize} vs reported ${reportedSize}!`);
                // return; // @todo disabled while working on new engine clients - Kat 12/Nov/22
            }

            const encryptedBytes: Buffer = Buffer.alloc(reportedSize);
            buffer.copy(encryptedBytes, 0, buffer.readerIndex);
            const decrypted = new ByteBuffer(BigInteger.fromBuffer(encryptedBytes)
                .modPow(RSA_EXPONENT, RSA_MODULUS).toBuffer());

            const blockId = decrypted.get('byte', 'u');

            if (blockId !== 10) {
                logger.error(`Invalid block id ${blockId} encountered!`);
                return;
            }

            const clientKey1 = connection.clientKey1 = decrypted.get('int');
            const clientKey2 = connection.clientKey2 = decrypted.get('int');
            const incomingServerKey = decrypted.get('long');

            if (serverKey !== incomingServerKey) {
                logger.error(`Server key mismatch; original ${serverKey} vs reported ${incomingServerKey}!`);
                return;
            }

            let uid = Math.random() * 9.9999999E7;

            if (connection.buildNumber < 460) {
                uid = decrypted.get('int');
            }

            let username: string;
            let password: string;

            if (newEngine) {
                // New engine

                const usernameLong = BigInt(decrypted.get('long'));
                username = decodeBase37Username(usernameLong);
                password = decrypted.getString();
            } else {
                // Old engine
                
                username = decrypted.getString(10);
                password = decrypted.getString(10);
            }

            const rights = PlayerRights.JMOD; // @todo - Kat 18-Oct-22

            const sessionKey: number[] = [
                Number(clientKey1),
                Number(clientKey2),
                Number(incomingServerKey >> BigInt(32)),
                Number(incomingServerKey)
            ];

            const inCipher = new Isaac(sessionKey);

            for (let i = 0; i < 4; i++) {
                sessionKey[i] += 50;
            }

            const outCipher = new Isaac(sessionKey);

            connection.player = {
                uid,
                username,
                password,
                rights,
                client: {
                    lowMemory,
                    inCipher,
                    outCipher,
                    connection,
                    outboundPacketQueue: [],
                    outboundSyncQueue: [],
                },
            };

            connection.connectionState = ConnectionState.LOGGED_IN;

            playerLogin(connection.player);

            if (newEngine) {
                // New engine
                if (connection.buildNumber >= 460) {
                    const outputBuffer = new ByteBuffer(9);
                    outputBuffer.put(2, 'byte'); // Success
                    outputBuffer.put(rights, 'byte');
                    outputBuffer.put(0, 'byte'); // ???
                    outputBuffer.put(0, 'byte'); // ???
                    outputBuffer.put(0, 'byte'); // ???
                    outputBuffer.put(0, 'byte'); // ???
                    outputBuffer.put(connection.player.worldIndex, 'short');
                    outputBuffer.put(0, 'byte'); // ???
                    socket.write(outputBuffer.toNodeBuffer());
                } else {
                    const outputBuffer = new ByteBuffer(6);
                    outputBuffer.put(2, 'byte'); // Success
                    outputBuffer.put(rights, 'byte');
                    outputBuffer.put(0, 'byte'); // ???
                    outputBuffer.put(connection.player.worldIndex, 'short');
                    outputBuffer.put(0, 'byte'); // ???
                    socket.write(outputBuffer.toNodeBuffer());
                }
            } else {
                // Old engine
                const outputBuffer = new ByteBuffer(3);
                outputBuffer.put(2); // login response code
                outputBuffer.put(rights); // player role/rights
                outputBuffer.put(0); // ??? still dunno what the fuck this is
                socket.write(outputBuffer.toNodeBuffer());
            }

            logger.info(`Player ${username} has logged in.`);

            writePackets(connection.player);
        } else if (connectionState === ConnectionState.LOGGED_IN) {
            // Packet data received
            handleInboundPacketData(connection.player, buffer);
        } else {
            //logger.error(`Unhandled connection state ${connectionState} encountered.`);
        }
    }
};

const connectionClosed = (connection: Connection, hadError: boolean): void => {
    if (connection.player) {
        playerLogout(connection.player)
    }
};

const connectionError = (connection: Connection, error: Error): void => {
    if (connection.player) {
        playerLogout(connection.player)
    }
};

export const connectionCreated = (
    socket: Socket,
    socketOptions?: SocketOptions,
): Connection => {
    const connection: Connection = { socket };

    socket.setNoDelay(socketOptions?.noDelay ?? true);
    socket.setKeepAlive(socketOptions?.keepAlive ?? true);
    socket.setTimeout(socketOptions?.timeout ?? 30000);

    socket.on('data', data => dataReceived(connection, data));
    socket.on('close', hadError => connectionClosed(connection, hadError));
    socket.on('error', error => connectionError(connection, error));

    return connection;
};
