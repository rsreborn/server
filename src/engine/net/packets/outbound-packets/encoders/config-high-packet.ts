import { encodeBase37Username } from '@engine/util/base37';
import { ByteBuffer } from '@runejs/common';
import { OutboundPacket, PacketSize } from '../../packets';

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
            const buffer = new ByteBuffer(6);
            buffer.put(data.configId, 'short');
            buffer.put(data.configValue, 'int');
            return buffer;
        }
    },
};
