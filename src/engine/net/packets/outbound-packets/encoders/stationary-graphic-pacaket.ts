import { Coord } from '@engine/world';
import { Packet } from '../../packet';
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
            const packet = new Packet(114);
            packet.put(data.offset ?? 0, 'byte');
            packet.put(data.graphicId, 'short');
            packet.put(data.height, 'byte');
            packet.put(data.delay, 'short');
            return packet;
        }
    },
};
