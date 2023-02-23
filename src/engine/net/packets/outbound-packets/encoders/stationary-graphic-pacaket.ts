import { Coord } from '@engine/world';
import { ByteBuffer } from '@runejs/common';
import { sendUpdateCoords } from '../../packet-handler';
import { OutboundPacket } from '../../packets';

interface ProjectileData {
    position: Coord;
    offset: number;
    graphicId: number;
    height: number;
    delay: number;
}

export const stationaryGraphic: OutboundPacket<ProjectileData> = {
    name: 'stationaryGraphic',
    opcodes: {
        254: 114,
    },
    encoders: {
        254: (player, opcode, data) => {
            sendUpdateCoords(player, data.position.x, data.position.y)
            const buffer = new ByteBuffer(6);
            buffer.put(data.offset ?? 0, 'byte');
            buffer.put(data.graphicId, 'short');
            buffer.put(data.height, 'byte');
            buffer.put(data.delay, 'short');
            return buffer;
        }
    },
};
