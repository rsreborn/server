import { ByteBuffer } from '@runejs/common';
import { OutboundPacket } from '../../packets';

export const playerDetailsPacket: OutboundPacket<void> = {
    name: 'playerDetails',
    opcodes: {
        // 289: ?,
        319: 55,
        // 357: ?,
    },
    encoders: {
        319: player => {
            const buffer = new ByteBuffer(3);
            buffer.put(player.hasMembership ? 1 : 0);
            buffer.put(player.worldIndex, 'short');
            return buffer;
        }
    },
};
