import { ByteBuffer } from '@runejs/common';
import { Packet } from '../../packet';
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
            const packet = new Packet(138);
            packet.put(data.sidebarId, 'byte');
            return packet;
        },
    },
};
