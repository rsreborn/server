import { ByteBuffer, logger } from '@runejs/common';
import { Player } from '../world/player';
import { getMapCoord } from '../world';

export const INBOUND_PACKET_SIZES = [
    0, 0, 0, 1, -1, 0, 0, 0, 0, 0, //0
    0, 0, 0, 0, 8, 0, 6, 2, 2, 0,  //10
    0, 2, 0, 6, 0, 12, 0, 0, 0, 0, //20
    0, 0, 0, 0, 0, 8, 4, 0, 0, 2,  //30
    2, 6, 0, 6, 0, -1, 0, 0, 0, 0, //40
    0, 0, 0, 12, 0, 0, 0, 0, 8, 0, //50
    0, 8, 0, 0, 0, 0, 0, 0, 0, 0,  //60
    6, 0, 2, 2, 8, 6, 0, -1, 0, 6, //70
    0, 0, 0, 0, 0, 1, 4, 6, 0, 0,  //80
    0, 0, 0, 0, 0, 3, 0, 0, -1, 0, //90
    0, 13, 0, -1, 0, 0, 0, 0, 0, 0,//100
    0, 0, 0, 0, 0, 0, 0, 6, 0, 0,  //110
    1, 0, 6, 0, 0, 0, -1, 0, 2, 6, //120
    0, 4, 6, 8, 0, 6, 0, 0, 0, 2,  //130
    0, 0, 0, 0, 0, 6, 0, 0, 0, 0,  //140
    0, 0, 1, 2, 0, 2, 6, 0, 0, 0,  //150
    0, 0, 0, 0, -1, -1, 0, 0, 0, 0,//160
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  //170
    0, 8, 0, 3, 0, 2, 0, 0, 8, 1,  //180
    0, 0, 12, 0, 0, 0, 0, 0, 0, 0, //190
    2, 0, 0, 0, 0, 0, 0, 0, 4, 0,  //200
    4, 0, 0, 0, 7, 8, 0, 0, 10, 0, //210
    0, 0, 0, 0, 0, 0, -1, 0, 6, 0, //220
    1, 0, 0, 0, 6, 0, 6, 8, 1, 0,  //230
    0, 4, 0, 0, 0, 0, -1, 0, -1, 4,//240
    0, 0, 6, 6, 0, 0, 0            //250
];

export enum PacketType {
    FIXED = 0,
    VAR_BYTE = 1,
    VAR_SHORT = 2
}

export interface InboundPacket {
    opcode: number | null;
    size: number | null;
    buffer: ByteBuffer;
}

export const handleInboundPacket = (player: Player, opcode: number, data: ByteBuffer | null): void => {
    logger.info(`Packet ${ opcode } received with size of ${ data?.length ?? 0 }.`);
    // @todo - Kat 18/Oct/22
};

export const queuePacket = (
    player: Player,
    opcode: number,
    packetData: ByteBuffer,
    packetType: PacketType = PacketType.FIXED,
    queueType: 'packet' | 'update' = 'packet',
): void => {
    let size = packetData.length;

    if (packetType !== PacketType.FIXED) {
        size += packetType;
    }

    const packet = new ByteBuffer(size + 1);
    packet.put((opcode + player.client.outCipher.rand()) & 0xff);

    let copyStart = 1;

    if (packetType === PacketType.VAR_BYTE) {
        packet.put(packetData.length, 'byte');
        copyStart = 2;
    } else if (packetType === PacketType.VAR_SHORT) {
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
    queuePacket(player, 50, buffer, PacketType.VAR_BYTE);
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
