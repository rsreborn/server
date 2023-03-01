import { ByteBuffer } from '@runejs/common';
import { OutboundPacket } from '../../packets';

interface SideBarData {
    sidebarId: number;
}

export const updateActiveSidebarPacket: OutboundPacket<SideBarData> = {
    name: 'updateActiveSidebar',
    opcodes: {
        254: 138,
    },
    encoders: {
        254: (player, opcode, data) => {
            const buffer = new ByteBuffer(1);
            buffer.put(data.sidebarId, 'byte');
            return buffer;
        },
    },
};
