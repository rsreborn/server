import { Coord } from '@engine/world/coord';
import { Player } from '@engine/world/player/player';
import { ByteBuffer } from '@runejs/common';
import { sendUpdateCoords } from '../../packet-handler';
import { OutboundPacket } from '../../packets';

interface GroundItemData {
    positionOffset: number;
    itemId: number;
    position: Coord;
}

export const removeGroundItemPacket: OutboundPacket<GroundItemData> = {
    name: 'removeGroundItem',
    opcodes: {
        254: 115,
    },
    encoders: {
        254: (player, opcode, data) => {
            sendUpdateCoords(player, data.position.x, data.position.y);
            const buffer = new ByteBuffer(3);
            buffer.put(data.positionOffset ?? 0, 'byte');
            buffer.put(data.itemId, 'short');
            return buffer;
        }
    },
};


