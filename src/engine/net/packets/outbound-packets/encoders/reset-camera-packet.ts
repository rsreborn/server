import { ByteBuffer } from '@runejs/common';
import { Packet } from '../../packet';
import { OutboundPacket } from '../../packets';

const resetCameraEncoder = () => new Packet(225);

export const resetCameraPacket: OutboundPacket = {
    name: 'resetCamera',
    opcodes: {
        254: 225,
    },
    encoders: {
        254: resetCameraEncoder,
    },
};
