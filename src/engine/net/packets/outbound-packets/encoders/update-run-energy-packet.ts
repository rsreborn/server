import { ByteBuffer } from '@runejs/common';
import { Packet } from '../../packet';
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
            const packet = new Packet(94);
             packet.put(data.runEnergy);
            return packet;
        }
    },
};
