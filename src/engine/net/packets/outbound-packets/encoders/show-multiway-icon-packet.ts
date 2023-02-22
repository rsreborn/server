import { encodeBase37Username } from '@engine/util/base37';
import { ByteBuffer } from '@runejs/common';
import { OutboundPacket, PacketSize } from '../../packets';

interface MultiwayData {
    showMultiwayIcon: boolean;
}

export const showMultiwayIconPacket: OutboundPacket<MultiwayData> = {
    name: 'showMultiwayIcon',
    opcodes: {
        254: 75,
    },
    encoders: {
        254: (player, opcode, data) => {
            const buffer = new ByteBuffer(1);
            buffer.put(Number(data.showMultiwayIcon));
            return buffer;
        }
    },
};
