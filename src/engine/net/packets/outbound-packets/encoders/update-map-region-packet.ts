import { Coord } from '../../../../world';
import { Packet, PacketType } from '../../packet';
import { OutboundPacket } from '../../packets';

interface UpdateMapRegionData {
    mapCoords: Coord;
    localCoords: Coord;
}

export const updateMapRegionPacket: OutboundPacket<UpdateMapRegionData> = {
    name: 'updateMapRegion',
    opcodes: {
        // 254: 209,
        289: 219,
        319: 228,
        357: 121,
        414: 127,
        498: 44,
    },
    types: {
        414: PacketType.VAR_SHORT,
        498: PacketType.VAR_SHORT,
    },
    encoders: {
        // 254: (player, opcode, data) => {
        //     const packet = new Packet(209);
        //     packet.put(data.mapCoords.x, 'short');
        //     packet.put(data.mapCoords.y, 'short');
        //     return packet;
        // },
        289: (player, opcode, data) => {
            const packet = new Packet(219);
            packet.put(data.mapCoords.x, 'short');
            packet.put(data.mapCoords.y, 'short');
            return packet;
        },
        319: (player, opcode, data) => {
            const packet = new Packet(228);
            packet.put(data.mapCoords.x, 'short');
            packet.put(data.mapCoords.y, 'short', 'le');
            return packet;
        },
        357: (player, opcode, data) => {
            const packet = new Packet(121);
            packet.put(data.mapCoords.y, 'short', 'le');
            packet.put(data.mapCoords.x, 'short');
            return packet;
        },
        414: (player, opcode, data) => {
            const packet = new Packet(127, PacketType.VAR_SHORT);
            packet.put(data.mapCoords.x, 'short', 'le');
            packet.put(data.localCoords.x, 'short', 'le');
            packet.put(data.mapCoords.y, 'short', 'le');

            const startX = Math.floor((data.mapCoords.x - 6) / 8);
            const endX = Math.floor((data.mapCoords.x + 6) / 8);
            const startY = Math.floor((data.mapCoords.y - 6) / 8);
            const endY = Math.floor((data.mapCoords.y + 6) / 8);

            // @todo xtea key support - Kat 13/Nov/22
            for (let mapX = startX; mapX <= endX; mapX++) {
                for (let mapY = startY; mapY <= endY; mapY++) {
                    for (let seeds = 0; seeds < 4; seeds++) {
                        packet.put(0, 'int', 'le');
                    }
                }
            }
            packet.put(data.mapCoords.plane, 'byte');
            packet.put(data.localCoords.y, 'short', 'le');
            return packet;
        },
        498: (player, opcode, data) => {
            const packet = new Packet(44, PacketType.VAR_SHORT);

            const startX = Math.floor((data.mapCoords.x - 6) / 8);
            const endX = Math.floor((data.mapCoords.x + 6) / 8);
            const startY = Math.floor((data.mapCoords.y - 6) / 8);
            const endY = Math.floor((data.mapCoords.y + 6) / 8);

            // @todo xtea key support - Kat 29/Nov/22
            for (let mapX = startX; mapX <= endX; mapX++) {
                for (let mapY = startY; mapY <= endY; mapY++) {
                    // for (let seeds = 0; seeds < 4; seeds++) {
                    //     buffer.put(0, 'int');
                    // }
                    // buffer.put(14881828, 'int');
                    // buffer.put(-6662814, 'int');
                    // buffer.put(58238456, 'int');
                    // buffer.put(146761213 , 'int');

                    packet.put(-329250188, 'int');
                    packet.put(-245862849, 'int');
                    packet.put(-94022035, 'int');
                    packet.put(-1987970363 , 'int');
                }
            }

            packet.put(data.mapCoords.y, 'short');
            packet.put(data.mapCoords.x, 'short');
            packet.put(data.localCoords.x, 'short');
            packet.put(data.mapCoords.plane, 'byte');
            packet.put(data.localCoords.y, 'short');
            return packet;
        },
    },
};
