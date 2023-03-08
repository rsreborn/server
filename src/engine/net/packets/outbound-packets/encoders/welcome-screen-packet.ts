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
        289: (player, opcode, data) => {
            const packet = new Packet(253);
            packet.put(77777, 'int');
            packet.put(0, 'short');
            packet.put(0, 'byte');
            packet.put(0, 'short');
            packet.put(0, 'byte');
            return packet;
        },
        319: (player, opcode, data) => {
            const packet = new Packet(178);
            packet.put(0, 'short');
            packet.put(77777, 'int');
            packet.put(0, 'byte');
            packet.put(0, 'byte');
            packet.put(0, 'short', 'le');
            return packet;
        },
        357: (player, opcode, data) => {
            const packet = new Packet(39);
            packet.put(0, 'short');
            packet.put(0, 'short');
            packet.put(0, 'short', 'le');
            packet.put(0, 'short');
            packet.put(0, 'short');
            packet.put(0, 'short', 'le');
            packet.put(77777, 'int', 'le');
            packet.put(0, 'short');
            packet.put(0, 'short', 'le');
            packet.put(0, 'short', 'le');
            packet.put(0, 'byte');
            return packet;
        }
    },
};
