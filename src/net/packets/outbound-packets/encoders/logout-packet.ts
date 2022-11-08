import { ByteBuffer } from '@runejs/common';
import { OutboundPacket } from '../../packets';

const logoutEncoder = () => new ByteBuffer(0);

export const logoutPacket: OutboundPacket = {
    name: 'logout',
    opcodes: {
        319: 49
    },
    encoders: {
        319: logoutEncoder
    },
};