import { ByteBuffer } from '@runejs/common';
import { OutboundPacket, PacketSize } from '../../packets';

interface WindowPaneData {
    windowId: number;
}

export const windowPanePacket: OutboundPacket<WindowPaneData> = {
    name: 'windowPane',
    opcodes: {
        498: 222
    },
    encoders: {
        498: (player, opcode, data) => {
            const buffer = new ByteBuffer(3);
            buffer.put(data.windowId, 'short');
            buffer.put(0); // ???
            return buffer;
        }
    },
};
