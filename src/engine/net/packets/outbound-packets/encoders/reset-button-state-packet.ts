import { ByteBuffer } from '@runejs/common';
import { OutboundPacket } from '../../packets';

export const resetButtonStatePacket: OutboundPacket = {
    name: 'resetButtonState',
    opcodes: {
        254: 140,
    },
    encoders: {
        254: (player, opcode, data) => {
            const buffer = new ByteBuffer(0);
            return buffer;
        }
    },
};
