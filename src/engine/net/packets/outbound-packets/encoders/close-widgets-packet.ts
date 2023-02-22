import { ByteBuffer } from '@runejs/common';
import { OutboundPacket } from '../../packets';

const closeWidgetsEncoder = () => new ByteBuffer(0);

export const closeWidgetsPacket: OutboundPacket = {
    name: 'closeWidgets',
    opcodes: {
        254: 174,
        289: 23,
        319: 143
    },
    encoders: {
        289: closeWidgetsEncoder,
        319: closeWidgetsEncoder
    },
};
