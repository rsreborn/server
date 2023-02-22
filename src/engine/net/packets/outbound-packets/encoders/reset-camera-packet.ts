import { ByteBuffer } from '@runejs/common';
import { OutboundPacket } from '../../packets';

const resetCameraEncoder = () => new ByteBuffer(0);

export const resetCameraPacket: OutboundPacket = {
    name: 'resetCamera',
    opcodes: {
        254: 225,
    },
    encoders: {
        23: resetCameraEncoder,
    },
};
