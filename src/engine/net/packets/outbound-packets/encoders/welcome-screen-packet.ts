import { ByteBuffer } from '@runejs/common';
import { Packet } from '../../packet';
import { OutboundPacket } from '../../packets';

interface WelcomeScreenData {
}

export const welcomeScreenPacket: OutboundPacket<WelcomeScreenData> = {
    name: 'welcomeScreen',
    opcodes: {
        254: 146,
        289: 253,
        319: 178,
        357: 39,
    },
    encoders: {
        254: (player, opcode, data) => {
            const packet = new Packet(146);
            packet.put(77777, 'int');
            packet.put(0, 'short');
            packet.put(0, 'byte');
            packet.put(0, 'short');
            packet.put(0, 'byte');
            return packet;
        },
        // 289: (player, opcode, data) => {
        //     const buffer = new ByteBuffer(10);
        //     buffer.put(77777, 'int');
        //     buffer.put(0, 'short');
        //     buffer.put(0, 'byte');
        //     buffer.put(0, 'short');
        //     buffer.put(0, 'byte');
        //     return buffer;
        // },
        // 319: (player, opcode, data) => {
        //     const buffer = new ByteBuffer(10);
        //     buffer.put(0, 'short');
        //     buffer.put(77777, 'int');
        //     buffer.put(0, 'byte');
        //     buffer.put(0, 'byte');
        //     buffer.put(0, 'short', 'le');
        //     return buffer;
        // },
        // 357: (player, opcode, data) => {
        //     const buffer = new ByteBuffer(23);
        //     buffer.put(0, 'short');
        //     buffer.put(0, 'short');
        //     buffer.put(0, 'short', 'le');
        //     buffer.put(0, 'short');
        //     buffer.put(0, 'short');
        //     buffer.put(0, 'short', 'le');
        //     buffer.put(77777, 'int', 'le');
        //     buffer.put(0, 'short');
        //     buffer.put(0, 'short', 'le');
        //     buffer.put(0, 'short', 'le');
        //     buffer.put(0, 'byte');
        //     return buffer;
        // }
    },
};
