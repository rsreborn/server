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
            const packet = new Packet(213);
            packet.put(player.worldIndex, 'short', 'le');
            packet.put(player.hasMembership ? 1 : 0);
            return packet;
        },
        319: player => {
            const packet = new Packet(55);
            packet.put(player.hasMembership ? 1 : 0);
            packet.put(player.worldIndex, 'short');
            return packet;
        }
    },
};
