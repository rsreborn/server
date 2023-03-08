import { ByteBuffer } from '@runejs/common';
import { Packet } from '../../packet';
import { OutboundPacket } from '../../packets';

export const resetButtonStatePacket: OutboundPacket = {
    name: 'resetButtonState',
    opcodes: {
        254: 140,
    },
    encoders: {
        254: (player, opcode, data) => {
            const packet = new Packet(140);
            return packet;
        }
    },
};
