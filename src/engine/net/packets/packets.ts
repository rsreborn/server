import { ByteBuffer } from '@runejs/common';
import { Player } from '../../world/player';
import { Packet, PacketType } from './packet';

export enum PacketQueueType {
    PACKET = 'packet',
    SYNC = 'sync',
}

// export interface Packet {
//     opcode: number | null;
//     size: number | null;
//     buffer: ByteBuffer;
// }

export type PacketOpcodeMap = { [key: number]: number | number[] };
export type PacketDecoder<T = any> = (opcode: number, data: ByteBuffer) => T;
export type PacketDecoderMap<T = any> = { [key: number]: PacketDecoder<T> };
export type PacketEncoder<T = any> = (player: Player, opcode: number, data: T) => Packet;
export type PacketEncoderMap<T = any> = { [key: number]: PacketEncoder<T> };
export type PacketTypeMap = { [key: number]: PacketType };
export type PacketHandler<T = any> = (
    player: Player,
    data: T,
) => void;

export interface InboundPacket<T = any> {
    name: string;
    handler: PacketHandler<T>;
    opcodes: PacketOpcodeMap;
    decoders: PacketDecoderMap<T>;
}

export interface OutboundPacket<T = any> {
    name: string;
    type?: PacketType;
    queue?: PacketQueueType;
    types?: PacketTypeMap;
    opcodes: PacketOpcodeMap;
    encoders: PacketEncoderMap<T>;
}
