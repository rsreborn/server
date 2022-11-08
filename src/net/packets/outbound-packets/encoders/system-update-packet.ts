import { ByteBuffer } from '@runejs/common';
import { OutboundPacket } from '../../packets';

interface SystemUpdateData {
    time: number;
}

export const systemUpdatePacket: OutboundPacket<SystemUpdateData> = {
    name: 'systemUpdate',
    opcodes: {
        319: 103
    },
    encoders: {
        319: (player, opcode, data) => {
            const buffer = new ByteBuffer(2);
            buffer.put(data.time, 'short');
            return buffer;
        }
    },
};
