import { ByteBuffer, logger } from '@runejs/common';
import { Player } from '../../world/player';
import { getMapCoord } from '../../world';
import ClickPacketHandler from './inbound-packets/click-packet';
import ButtonPacketHandler from './inbound-packets/button-packet';
import { decodePacket, packetStructures, PacketType } from './packet-pipeline-protocol-multiplexer';

export enum PacketSize {
    FIXED = 0,
    VAR_BYTE = 1,
    VAR_SHORT = 2
}

export interface InboundPacket {
    opcode: number | null;
    size: number | null;
    buffer: ByteBuffer;
}

export type InboundPacketHandler = (
    player: Player,
    data: any
) => void;

export const handleInboundPacket = (
    player: Player,
    opcode: number,
    data: ByteBuffer | null,
): boolean => {
    logger.info(`Packet ${ opcode } received with size of ${ data?.length ?? 0 }.`);

    // @todo the below is all test code until we have an auto-importer for everything in inbound-packets/impl/* - Kat 25/Oct/22

    // Junk packets
    if (opcode === 25 || opcode === 63 || opcode === 226) {
        return true;
    }

    const inboundHandlers = [ClickPacketHandler, ButtonPacketHandler];

    const packetStructure = packetStructures.find(p => p.opcode === opcode && p.type === PacketType.INBOUND);
    if (packetStructure) {
        const inboundHandler = inboundHandlers.find(h => h.name === packetStructure.name);
        if (inboundHandler) {
            const decodedData = decodePacket(packetStructure.name, PacketType.INBOUND, data);
            inboundHandler.handler(player, decodedData);
            return true;
        }
    }

    return false;
};

export const queuePacket = (
    player: Player,
    opcode: number,
    packetData: ByteBuffer,
    packetType: PacketSize = PacketSize.FIXED,
    queueType: 'packet' | 'update' = 'packet',
): void => {
    let size = packetData.length;

    if (packetType !== PacketSize.FIXED) {
        size += packetType;
    }

    const packet = new ByteBuffer(size + 1);
    packet.put((opcode + player.client.outCipher.rand()) & 0xff);

    let copyStart = 1;

    if (packetType === PacketSize.VAR_BYTE) {
        packet.put(packetData.length, 'byte');
        copyStart = 2;
    } else if (packetType === PacketSize.VAR_SHORT) {
        packet.put(packetData.length, 'short');
        copyStart = 3;
    }

    packetData.copy(packet, copyStart, 0, size);

    if (queueType === 'packet') {
        player.client.outboundPacketQueue.push(packet.toNodeBuffer());
    } else if (queueType === 'update') {
        player.client.outboundUpdateQueue.push(packet.toNodeBuffer());
    }
};

export const writePackets = (player: Player): void => {
    const buffer = Buffer.concat([
        ...player.client.outboundPacketQueue,
        ...player.client.outboundUpdateQueue,
    ]);

    if (buffer.length !== 0) {
        player.client.connection.socket.write(buffer);
    }

    player.client.outboundPacketQueue = [];
    player.client.outboundUpdateQueue = [];
};

export const sendChatboxMessage = (player: Player, message: string): void => {
    const buffer = new ByteBuffer(message.length + 1);
    buffer.putString(message, 10);
    queuePacket(player, 50, buffer, PacketSize.VAR_BYTE);
};

export const sendUpdateMapRegionPacket = (player: Player): void => {
    const buffer = new ByteBuffer(4);
    const mapCoord = getMapCoord(player.coords);
    buffer.put(mapCoord.x, 'short');
    buffer.put(mapCoord.y, 'short', 'le');

    queuePacket(player, 228, buffer);
};

export const sendSideBarWidget = (player: Player, sideBarId: number, widgetId: number): void => {
    const buffer = new ByteBuffer(3);
    buffer.put(widgetId, 'short');
    buffer.put(sideBarId, 'byte');
    queuePacket(player, 229, buffer);
};

export const sendSystemUpdate = (player: Player, time: number): void => {
    const buffer = new ByteBuffer(2);
    buffer.put(time, 'short');
    queuePacket(player, 103, buffer);
};
