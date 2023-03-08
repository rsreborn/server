import { ByteBuffer } from '@runejs/common';
import { Packet } from '../../packet';
import { OutboundPacket } from '../../packets';

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
            const packet = new Packet(222);
            packet.put(data.windowId, 'short');
            packet.put(0); // ???
            return packet;
        }
    },
};
