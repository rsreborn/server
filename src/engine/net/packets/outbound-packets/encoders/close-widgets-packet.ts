import { ByteBuffer } from '@runejs/common';
import { Packet } from '../../packet';
import { OutboundPacket } from '../../packets';

const closeWidgetsEncoder = () => new Packet(174);

export const closeWidgetsPacket: OutboundPacket = {
    name: 'closeWidgets',
    opcodes: {
        254: 174,
        // 289: 23,
        // 319: 143
    },
    encoders: {
        254: closeWidgetsEncoder,
        // 289: closeWidgetsEncoder,
        // 319: closeWidgetsEncoder
    },
};
