import { ByteBuffer } from '@runejs/common';
import { Packet } from '../../packet';
import { OutboundPacket } from '../../packets';

interface ConfigData {
    configId: number;
    configValue: number;
}

export const configHighPacket: OutboundPacket<ConfigData> = {
    name: 'configHigh',
    opcodes: {
        254: 196,
    },
    encoders: {
        254: (player, opcode, data) => {
            const packet = new Packet(196);
            packet.put(data.configId, 'short');
            packet.put(data.configValue, 'int');
            return packet;
        }
    },
};
