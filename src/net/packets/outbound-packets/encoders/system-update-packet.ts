import { ByteBuffer } from '@runejs/common';
import { OutboundPacket } from '@net/packets/packets';

interface SystemUpdateData {
    time: number;
}

export const systemUpdatePacket: OutboundPacket<SystemUpdateData> = {
    name: 'systemUpdate',
    opcodes: {
        289: 204,
        319: 103,
        357: 10,
    },
    encoders: {
        289: (player, opcode, data) => {
            const buffer = new ByteBuffer(2);
            buffer.put(data.time, 'short');
            return buffer;
        },
        319: (player, opcode, data) => {
            const buffer = new ByteBuffer(2);
            buffer.put(data.time, 'short');
            return buffer;
        },
        357: (player, opcode, data) => {
            const buffer = new ByteBuffer(2);
            buffer.put(data.time, 'short', 'le');
            return buffer;
        }
    },
};
