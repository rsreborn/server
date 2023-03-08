import { ByteBuffer } from '@runejs/common';
import { Packet } from '../../packet';
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
            const packet = new Packet(164);
             packet.put(data.weight, 'short');
            return packet;
        }
    },
};
