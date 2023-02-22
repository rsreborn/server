import { encodeBase37Username } from '@engine/util/base37';
import { ByteBuffer } from '@runejs/common';
import { OutboundPacket, PacketSize } from '../../packets';

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
            const buffer = new ByteBuffer(3);
            buffer.put(data.configId, 'short');
            buffer.put(data.configValue);
            return buffer;
        }
    },
};
