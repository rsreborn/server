import { ByteBuffer } from '@runejs/common';
import { Packet } from '../../packet';
import { OutboundPacket } from '../../packets';

export const playerDetailsPacket: OutboundPacket<void> = {
    name: 'playerDetails',
    opcodes: {
        254: 213,
        // 289: ?,
        319: 55,
        // 357: ?,
    },
    encoders: {
        254: player => {
            const packet = new Packet(3);
            packet.put(player.worldIndex, 'short', 'le');
            packet.put(player.hasMembership ? 1 : 0);
            return packet;
        },
        // 319: player => {
        //     const buffer = new ByteBuffer(3);
        //     buffer.put(player.hasMembership ? 1 : 0);
        //     buffer.put(player.worldIndex, 'short');
        //     return buffer;
        // }
    },
};
