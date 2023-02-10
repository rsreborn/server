import { ByteBuffer } from '@runejs/common';
import { OutboundPacket } from '../../packets';

export const enterAmountPacket: OutboundPacket = {
    name: 'enterAmount',
    opcodes: {
        254: 5,
    },
    encoders: {
        254: (player, opcode, data) => {
            const buffer = new ByteBuffer(0);
            return buffer;
        },
    },
};
