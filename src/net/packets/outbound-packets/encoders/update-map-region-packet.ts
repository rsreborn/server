import { ByteBuffer } from '@runejs/common';
import { OutboundPacket, PacketSize } from '../../packets';
import { Coord } from '../../../../world';

interface UpdateMapRegionData {
    mapCoords: Coord;
    localCoords: Coord;
}

export const updateMapRegionPacket: OutboundPacket<UpdateMapRegionData> = {
    name: 'updateMapRegion',
    opcodes: {
        319: 228,
        357: 121,
        414: 127,
    },
    sizes: {
        414: PacketSize.VAR_SHORT,
    },
    encoders: {
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
    },
};
