import { ByteBuffer } from '@runejs/common';
import { OutboundPacket } from '../../packets';

interface WeightData {
    weight: number;
}

export const updateWeightPacket: OutboundPacket<WeightData> = {
    name: 'updateWeight',
    opcodes: {
        254: 164,
    },
    encoders: {
        254: (player, opcode, data) => {
            const buffer = new ByteBuffer(2);
             buffer.put(data.weight, 'short');
            return buffer;
        }
    },
};
