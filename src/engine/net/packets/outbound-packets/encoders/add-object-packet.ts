import { Coord } from '@engine/world/coord';
import { ByteBuffer } from '@runejs/common';
import { Packet } from '../../packet';
import { sendUpdateCoords } from '../../packet-handler';
import { OutboundPacket } from '../../packets';

interface ObjectData {
    positionOffset: number;
    objectId: number;
    objectType: number;
    objectOrientation: number;
    position: Coord;
}

export const addObjectPacket: OutboundPacket<ObjectData> = {
    name: 'addObject',
    opcodes: {
        254: 70,
    },
    encoders: {
        254: (player, opcode, data) => {
            sendUpdateCoords(player, data.position.x, data.position.y);
            const packet = new Packet(70);
            packet.put(data.positionOffset ?? 0, 'byte');
            packet.put((data.objectType << 2) + (data.objectOrientation & 3), 'byte');
            packet.put(data.objectId, 'short');
            return packet;
        }
    },
};


