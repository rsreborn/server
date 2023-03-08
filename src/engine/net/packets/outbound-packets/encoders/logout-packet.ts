import { ByteBuffer } from '@runejs/common';
import { Packet } from '../../packet';
import { OutboundPacket } from '../../packets';

const logoutEncoder = () => new Packet(21);

export const logoutPacket: OutboundPacket = {
    name: 'logout',
    opcodes: {
        254: 21,
        // 289: 121,
        // 319: 49,
        // 357: 161,
    },
    encoders: {
        254: logoutEncoder,
        // 289: logoutEncoder,
        // 319: logoutEncoder,
        // 357: logoutEncoder,
    },
};
