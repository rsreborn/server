import { ByteBuffer } from '@runejs/common';
import { OutboundPacket } from '../../packets';

// Todo: Actually come up with names for these lol...
interface UpdateCameraData {

}

export const updateCameraPacket: OutboundPacket<UpdateCameraData> = {
    name: 'updateCamera',
    opcodes: {
        254: 225,
    },
    encoders: {
        254: (player, opcode, data) => {
            const buffer = new ByteBuffer(4);
            buffer.put(2); // in and out
            buffer.put(5); // Shake
            buffer.put(120); // up and down
            buffer.put(2); // Speed
            return buffer;
        }
    },
};
