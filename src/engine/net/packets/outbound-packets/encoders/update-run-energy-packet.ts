import { ByteBuffer } from '@runejs/common';
import { OutboundPacket } from '../../packets';

interface RunEnergyData {
    runEnergy: number;
}

export const updateRunEnergyPacket: OutboundPacket<RunEnergyData> = {
    name: 'updateRunEnergy',
    opcodes: {
        254: 94,
    },
    encoders: {
        254: (player, opcode, data) => {
            const buffer = new ByteBuffer(1);
             buffer.put(data.runEnergy);
            return buffer;
        }
    },
};
