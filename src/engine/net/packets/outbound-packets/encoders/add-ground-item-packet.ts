import { Coord } from '@engine/world/coord';
import { Player } from '@engine/world/player/player';
import { ByteBuffer } from '@runejs/common';
import { sendUpdateCoords } from '../../packet-handler';
import { OutboundPacket } from '../../packets';

interface GroundItemData {
    positionOffset: number;
    itemId: number;
    itemAmount: number;
    position: Coord;
}

export const addGroundItemPacket: OutboundPacket<GroundItemData> = {
    name: 'addGroundItem',
    opcodes: {
        254: 120,
    },
    encoders: {
        254: (player, opcode, data) => {
            sendUpdateCoords(player, data.position.x, data.position.y);
            const buffer = new ByteBuffer(5);
            buffer.put(data.positionOffset ?? 0, 'byte');
            buffer.put(data.itemId, 'short');
            buffer.put(data.itemAmount, 'short');
            return buffer;
        }
    },
};


