import { Coord } from '@engine/world';
import { Player } from '@engine/world/player';
import { ByteBuffer } from '@runejs/common';
import { Packet } from '../../packet';
import { OutboundPacket } from '../../packets';

interface SendCoordsData {
    xCoord: number;
    yCoord: number;
}

export const updateCoordsPacket: OutboundPacket<SendCoordsData> = {
    name: 'updateCoords',
    opcodes: {
        254: 173,
    },
    encoders: {
        254: (player, opcode, data) => {
            const xCoord = data.xCoord - ((player.coords.x >> 3) - 6) * 8
            const yCoord = data.yCoord - ((player.coords.y >> 3) - 6) * 8
            const packet = new Packet(173);
            packet.put(xCoord, 'byte');
            packet.put(yCoord, 'byte');
            console.log(data)
            return packet;
        }
    },
};
