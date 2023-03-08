import { Packet } from '../../packet';
import { OutboundPacket } from '../../packets';

interface SidebarWidgetData {
    widgetId: number;
    sidebarId: number;
}

export const sidebarWidgetPacket: OutboundPacket<SidebarWidgetData> = {
    name: 'sidebarWidget',
    opcodes: {
        254: 91,
        289: 63,
        319: 229,
        357: 163,
        414: 242,
    },
    encoders: {
        254: (player, opcode, data) => {
            const packet = new Packet(91);
            packet.put(data.widgetId, 'short');
            packet.put(data.sidebarId, 'byte');
            return packet;
        },
        289: (player, opcode, data) => {
            const packet = new Packet(63);
            packet.put(data.widgetId, 'short');
            packet.put(data.sidebarId, 'byte');
            return packet;
        },
        319: (player, opcode, data) => {
            const packet = new Packet(229);
            packet.put(data.widgetId, 'short');
            packet.put(data.sidebarId, 'byte');
            return packet;
        },
        357: (player, opcode, data) => {
            const packet = new Packet(163);
            packet.put(data.widgetId, 'short');
            packet.put(data.sidebarId, 'byte');
            return packet;
        },
        414: (player, opcode, data) => {
            const packet = new Packet(242);
            packet.put(data.widgetId, 'short');
            packet.put(data.sidebarId, 'byte');
            return packet;
        }
    },
};
