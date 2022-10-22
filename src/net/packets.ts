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

enum PacketType {
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

export const writePacket = (player: Player, opcode: number, packetBuffer: ByteBuffer, packetType: PacketType = PacketType.FIXED): void => {
    let size = packetBuffer.length;
    let copyStart = 1;

    if (packetType !== PacketType.FIXED) {
        size += packetType;
    }

    const buffer = new ByteBuffer(size + 1);
    buffer.put((opcode + player.client.outCipher.rand()) & 0xff);

    if (packetType === PacketType.VAR_BYTE) {
        buffer.put(size, 'byte');
        copyStart += packetType
    } else if (packetType === PacketType.VAR_SHORT) {
        buffer.put(size, 'short');
        copyStart += packetType
    }
    packetBuffer.copy(buffer, copyStart, 0, size);
    player.client.connection.socket.write(buffer.toNodeBuffer());
};

export const sendChatboxMessage = (player: Player, message: string): void => {
    const buffer = new ByteBuffer(message.length + 1);
    buffer.putString(message, 10);
    writePacket(player, 50, buffer, PacketType.VAR_BYTE);
};

export const sendUpdateMapRegionPacket = (player: Player): void => {
    const buffer = new ByteBuffer(4);
    const mapCoord = getMapCoord(player.position);
    buffer.put(mapCoord.x, 'short');
    buffer.put(mapCoord.y, 'short', 'le');

    writePacket(player, 228, buffer);
};

export const sendSideBarWidget = (player: Player, sideBarId: number, widgetId: number): void => {
    const buffer = new ByteBuffer(3);
    buffer.put(widgetId, 'short');
    buffer.put(sideBarId - 128, 'byte'); // @todo Subtracting 128 because this is a byteA, need to refactor out A, S, and C from the client buffer. - Brian 10-19-22
    writePacket(player, 229, buffer);
};

export const sendSystemUpdate = (player: Player, time: number): void => {
    const buffer = new ByteBuffer(2);
    buffer.put(time, 'short');
    writePacket(player, 103, buffer);
};
