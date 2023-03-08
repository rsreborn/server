import { Packet } from '../../packet';
import { OutboundPacket } from '../../packets';

interface ConfigData {
    configId: number;
    configValue: number;
}

export const configLowPacket: OutboundPacket<ConfigData> = {
    name: 'configLow',
    opcodes: {
        254: 186,
    },
    encoders: {
        254: (player, opcode, data) => {
            const packet = new Packet(186);
            packet.put(data.configId, 'short');
            packet.put(data.configValue);
            return packet;
        }
    },
};
