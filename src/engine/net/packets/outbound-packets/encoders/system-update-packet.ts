import { ByteBuffer } from '@runejs/common';
import { Packet } from '../../packet';
import { OutboundPacket } from '../../packets';

interface SystemUpdateData {
    time: number;
}

export const systemUpdatePacket: OutboundPacket<SystemUpdateData> = {
    name: 'systemUpdate',
    opcodes: {
        254: 143,
        289: 204,
        319: 103,
        357: 10,
    },
    encoders: {
        254: (player, opcode, data) => {
            const packet = new Packet(143);
            packet.put(data.time, 'short');
            return packet;
        },
        // 289: (player, opcode, data) => {
        //     const buffer = new ByteBuffer(2);
        //     buffer.put(data.time, 'short');
        //     return buffer;
        // },
        // 319: (player, opcode, data) => {
        //     const buffer = new ByteBuffer(2);
        //     buffer.put(data.time, 'short');
        //     return buffer;
        // },
        // 357: (player, opcode, data) => {
        //     const buffer = new ByteBuffer(2);
        //     buffer.put(data.time, 'short', 'le');
        //     return buffer;
        // }
    },
};
