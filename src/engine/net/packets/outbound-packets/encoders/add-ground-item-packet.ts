import { Coord } from '@engine/world/coord';
import { Packet } from '../../packet';
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
            const packet = new Packet(120);
            packet.put(data.positionOffset ?? 0, 'byte');
            packet.put(data.itemId, 'short');
            packet.put(data.itemAmount, 'short');
            return packet;
        }
    },
};


