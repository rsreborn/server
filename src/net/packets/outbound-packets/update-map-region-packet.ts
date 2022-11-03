import { ByteBuffer } from '@runejs/common';
import { OutboundPacket } from '../packets';
import { Coord } from '../../../world';

interface UpdateMapRegionData {
    mapCoords: Coord;
}

export const updateMapRegionPacket: OutboundPacket<UpdateMapRegionData> = {
    name: 'updateMapRegion',
    opcodes: {
        319: 228
    },
    encoders: {
        319: (player, opcode, data) => {
            const buffer = new ByteBuffer(4);
            buffer.put(data.mapCoords.x, 'short');
            buffer.put(data.mapCoords.y, 'short', 'le');
            return buffer;
        }
    },
};
