import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { BYTE_LENGTH, ByteBuffer, DataType, Endianness, Signedness } from '@runejs/common';

export enum PacketType {
    INBOUND = 'inbound',
    OUTBOUND = 'outbound',
}

export type PacketData = [ string, string ];

export interface PacketDataField {
    name: string;
    dataType: DataType;
    signedness?: Signedness;
    endianness?: Endianness;
}

export interface PacketStructure {
    opcode: number;
    data: PacketData[];
    fields?: PacketDataField[];
    name?: string;
    size?: number;
    type?: PacketType;
}

export const packetStructures: PacketStructure[] = [];

const parsePacketData = (data: PacketData[]): {
    fields: PacketDataField[];
    size: number;
} => {
    const fields: PacketDataField[] = [];
    let size = 0;

    for (let [ fieldName, dataTypeStr ] of data) {
        dataTypeStr = dataTypeStr.toLowerCase();
        const parts = dataTypeStr.split('_');
        let dataType: DataType;
        let signedness: Signedness = undefined;
        let endianness: Endianness = undefined;
        if (parts.length === 1) {
            dataType = parts[0] as DataType;
        } else if (parts.length === 2) {
            if (parts[0] === 'u' || parts[0] === 's') {
                signedness = parts[0] as Signedness;
                dataType = parts[1] as DataType;
            } else {
                dataType = parts[0] as DataType;
                endianness = parts[1] as Endianness;
            }
        } else {
            signedness = parts[0] as Signedness;
            dataType = parts[1] as DataType;
            endianness = parts[2] as Endianness;
        }

        size += BYTE_LENGTH[dataType] ?? 0;

        fields.push({
            name: fieldName,
            dataType,
            signedness,
            endianness,
        });
    }

    return { fields, size };
};

const readPacketDir = (dir: string, packetType: PacketType): void => {
    const packetDir = join(dir, packetType);

    if (!existsSync(packetDir)) {
        throw new Error(`Packet directory ${packetDir} was not found!`);
    }

    const packetFileNameList = readdirSync(packetDir);

    for (const packetFileName of packetFileNameList) {
        if (!packetFileName.endsWith('.json')) {
            continue;
        }

        const filePath = join(packetDir, packetFileName);
        const name = packetFileName.replace('.json', '');
        const fileData = JSON.parse(readFileSync(filePath, 'utf-8'));

        const packet: PacketStructure = {
            name,
            type: packetType,
            ...fileData,
            ...parsePacketData(fileData.data),
        };

        packetStructures.push(packet);
    }
};

export const readPacketFiles = (buildNumber: number): void => {
    const packetDir = join('.', 'data', 'builds', String(buildNumber), 'packets');

    if (!existsSync(packetDir)) {
        throw new Error(`Packet directory ${packetDir} was not found!`);
    }

    readPacketDir(packetDir, PacketType.INBOUND);
    readPacketDir(packetDir, PacketType.OUTBOUND);
};

export const decodePacket = (
    name: string,
    type: PacketType,
    data: ByteBuffer | null,
): { [key: string]: any } => {
    if (!data?.length) {
        return [];
    }

    const packet = packetStructures.find(p => p.name === name && p.type === type);
    if (!packet) {
        return [];
    }

    const decodedFields: { [key: string]: any } = {};

    for (const { name, dataType, signedness, endianness } of packet.fields) {
        console.log(name, dataType, signedness, endianness);
        decodedFields[name] = data.get(dataType, signedness, endianness);
    }

    return decodedFields;
};
