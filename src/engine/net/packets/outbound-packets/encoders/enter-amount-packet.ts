import { ByteBuffer } from '@runejs/common';
import { Packet } from '../../packet';
import { OutboundPacket } from '../../packets';

export const enterAmountPacket: OutboundPacket = {
    name: 'enterAmount',
    opcodes: {
        254: 5,
    },
    encoders: {
        254: (player, opcode, data) => {
            const packet = new Packet(5);
            return packet;
        },
    },
};
