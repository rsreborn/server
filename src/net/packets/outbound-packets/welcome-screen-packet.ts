import { ByteBuffer } from '@runejs/common';
import { OutboundPacket } from '../packets';

interface WelcomeScreenData {
}

export const welcomeScreenPacket: OutboundPacket<WelcomeScreenData> = {
    name: 'welcomeScreen',
    opcodes: {
        319: 178
    },
    encoders: {
        319: (player, opcode, data) => {
            const buffer = new ByteBuffer(10);
            buffer.put(0, 'short');
            buffer.put(77777, 'int');
            buffer.put(0, 'byte');
            buffer.put(0, 'byte');
            buffer.put(0, 'short', 'le');
            return buffer;
        }
    },
};
