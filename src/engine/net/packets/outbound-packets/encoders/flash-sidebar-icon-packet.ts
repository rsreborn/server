import { Packet } from '../../packet';
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
            const packet = new Packet(58);
            packet.put(data.sidebarId, 'byte');
            return packet;
        },
        289: (player, opcode, data) => {
            const packet = new Packet(181);
            packet.put(data.sidebarId, 'byte');
            return packet;
        },
        319: (player, opcode, data) => {
            const packet = new Packet(168);
            packet.put(data.sidebarId, 'byte');
            return packet;
        },
        357: (player, opcode, data) => {
            const packet = new Packet(opcode);
            packet.put(data.sidebarId, 'byte');
            return packet;
        }
    },
};
