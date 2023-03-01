import { Coord } from '@engine/world/coord';
import { Player } from '@engine/world/player/player';
import { ByteBuffer } from '@runejs/common';
import { sendUpdateCoords } from '../../packet-handler';
import { OutboundPacket } from '../../packets';

interface ObjectData {
    positionOffset: number;
    animationId: number;
    objectType: number;
    objectOrientation: number;
    position: Coord;
}

export const animateObjectPacket: OutboundPacket<ObjectData> = {
    name: 'animateObject',
    opcodes: {
        254: 30,
    },
    encoders: {
        254: (player, opcode, data) => {
            sendUpdateCoords(player, data.position.x, data.position.y);
            const buffer = new ByteBuffer(4);
            buffer.put(data.positionOffset ?? 0, 'byte');
            buffer.put((data.objectType << 2) + (data.objectOrientation & 3), 'byte');
            buffer.put(data.animationId, 'short');
            return buffer;
        }
    },
};


