import { ByteBuffer } from '@runejs/common';
import { OutboundPacket } from '../../packets';

interface SideBarData {
    sidebarId: number;
}

export const flashSidebarIconPacket: OutboundPacket<SideBarData> = {
    name: 'flashSideBarIcon',
    opcodes: {
        254: 58,
        289: 181,
        319: 168,
        357: 236,
    },
    encoders: {
        254: (player, opcode, data) => {
            const buffer = new ByteBuffer(1);
            buffer.put(data.sidebarId, 'byte');
            return buffer;
        },
        289: (player, opcode, data) => {
            const buffer = new ByteBuffer(1);
            buffer.put(data.sidebarId, 'byte');
            return buffer;
        },
        319: (player, opcode, data) => {
            const buffer = new ByteBuffer(1);
            buffer.put(data.sidebarId, 'byte');
            return buffer;
        },
        357: (player, opcode, data) => {
            const buffer = new ByteBuffer(1);
            buffer.put(data.sidebarId, 'byte');
            return buffer;
        }
    },
};
