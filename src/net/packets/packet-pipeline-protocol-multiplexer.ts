import { existsSync, readdirSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { BYTE_LENGTH, ByteBuffer, DataType, Endianness, logger, Signedness } from '@runejs/common';
import { getFiles, watchForChanges } from '../../util/files';

export interface PacketStructure<T = any> {
    opcodes: number | number[];
    size?: number;
    decoder?: (opcode: number, size: number, data: ByteBuffer) => T;
}

export const BUILDS_DIR = join('.', 'dist', 'data', 'builds');

const inboundPackets: Map<number, PacketStructure[]> = new Map();
const outboundPackets: Map<number, PacketStructure[]> = new Map();

export const loadPackets = async (buildNumber: number): Promise<void> => {
    inboundPackets.set(buildNumber, []);
    outboundPackets.set(buildNumber, []);

    const PACKET_DIRECTORY = join(BUILDS_DIR, String(buildNumber), 'packets');
    const INBOUND_DIRECTORY = join(PACKET_DIRECTORY, 'inbound');
    const OUTBOUND_DIRECTORY = join(PACKET_DIRECTORY, 'outbound');

    if (existsSync(INBOUND_DIRECTORY)) {
        for await (const path of getFiles(INBOUND_DIRECTORY, [ '.js' ], true)) {
            const location = join('..', '..', '..', 'data', 'builds', String(buildNumber), 'packets', 'inbound', path.substring(INBOUND_DIRECTORY.length).replace('.js', ''));
            const packet = require(location).default;
            inboundPackets.get(buildNumber).push(packet);
        }

        // @todo fix this - Kat 29/Oct/22
        // watchForChanges(INBOUND_DIRECTORY, /[/\\]inbound[/\\]/);
    } else {
        logger.error(`No inbound packet configuration files located for build ${buildNumber}!`);
    }

    if (existsSync(OUTBOUND_DIRECTORY)) {
        for await (const path of getFiles(OUTBOUND_DIRECTORY, ['.js'], true)) {
            const location = join('..', '..', '..', 'data', 'builds', String(buildNumber), 'packets', 'outbound', path.substring(OUTBOUND_DIRECTORY.length).replace('.js', ''));
            const packet = require(location).default;
            outboundPackets.get(buildNumber).push(packet);
        }

        // @todo fix this - Kat 29/Oct/22
        // watchForChanges(OUTBOUND_DIRECTORY, /[/\\]outbound[/\\]/);
    } else {
        logger.error(`No outbound packet configuration files located for build ${buildNumber}!`);
    }
};

export const getInboundPacket = (
    buildNumber: number,
    opcode: number,
): PacketStructure | null => {
    return null;
};

export const getOutboundPacket = (
    buildNumber: number,
    opcode: number,
): PacketStructure | null => {
    return null;
};
