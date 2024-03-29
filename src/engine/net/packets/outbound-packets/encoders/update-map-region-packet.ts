import { ByteBuffer } from '@runejs/common';
import { Coord } from '../../../../world';
import { OutboundPacket, PacketSize } from '../../packets';

interface UpdateMapRegionData {
    mapCoords: Coord;
    localCoords: Coord;
}

export const updateMapRegionPacket: OutboundPacket<UpdateMapRegionData> = {
    name: 'updateMapRegion',
    opcodes: {
        254: 209,
        289: 219,
        319: 228,
        357: 121,
        414: 127,
        498: 44,
    },
    sizes: {
        414: PacketSize.VAR_SHORT,
        498: PacketSize.VAR_SHORT,
    },
    encoders: {
        254: (player, opcode, data) => {
            const buffer = new ByteBuffer(4);
            buffer.put(data.mapCoords.x, 'short');
            buffer.put(data.mapCoords.y, 'short');
            return buffer;
        },
        289: (player, opcode, data) => {
            const buffer = new ByteBuffer(4);
            buffer.put(data.mapCoords.x, 'short');
            buffer.put(data.mapCoords.y, 'short');
            return buffer;
        },
        319: (player, opcode, data) => {
            const buffer = new ByteBuffer(4);
            buffer.put(data.mapCoords.x, 'short');
            buffer.put(data.mapCoords.y, 'short', 'le');
            return buffer;
        },
        357: (player, opcode, data) => {
            const buffer = new ByteBuffer(4);
            buffer.put(data.mapCoords.y, 'short', 'le');
            buffer.put(data.mapCoords.x, 'short');
            return buffer;
        },
        414: (player, opcode, data) => {
            const buffer = new ByteBuffer(500);
            buffer.put(data.mapCoords.x, 'short', 'le');
            buffer.put(data.localCoords.x, 'short', 'le');
            buffer.put(data.mapCoords.y, 'short', 'le');

            const startX = Math.floor((data.mapCoords.x - 6) / 8);
            const endX = Math.floor((data.mapCoords.x + 6) / 8);
            const startY = Math.floor((data.mapCoords.y - 6) / 8);
            const endY = Math.floor((data.mapCoords.y + 6) / 8);

            // @todo xtea key support - Kat 13/Nov/22
            for (let mapX = startX; mapX <= endX; mapX++) {
                for (let mapY = startY; mapY <= endY; mapY++) {
                    for (let seeds = 0; seeds < 4; seeds++) {
                        buffer.put(0, 'int', 'le');
                    }
                }
            }
            buffer.put(data.mapCoords.plane, 'byte');
            buffer.put(data.localCoords.y, 'short', 'le');
            return buffer.flipWriter();
        },
        498: (player, opcode, data) => {
            const buffer = new ByteBuffer(500);

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

                    buffer.put(-329250188, 'int');
                    buffer.put(-245862849, 'int');
                    buffer.put(-94022035, 'int');
                    buffer.put(-1987970363 , 'int');
                }
            }

            buffer.put(data.mapCoords.y, 'short');
            buffer.put(data.mapCoords.x, 'short');
            buffer.put(data.localCoords.x, 'short');
            buffer.put(data.mapCoords.plane, 'byte');
            buffer.put(data.localCoords.y, 'short');
            return buffer.flipWriter();
        },
    },
};
