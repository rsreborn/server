import { Packet } from '../../packet';
import { OutboundPacket } from '../../packets';

interface WidgetData {
    widgetId: number;
}

export const sidebarWidgetWithDisabledTabsPacket: OutboundPacket<WidgetData> = {
    name: 'sidebarDisabledTabs',
    opcodes: {
        254: 187,
        319: 253
    },
    encoders: {
        254: (player, opcode, data) => {
            const packet = new Packet(187);
            packet.put(data.widgetId, 'short');
            return packet;
        },
        319: (player, opcode, data) => {
            const packet = new Packet(253);
            packet.put(data.widgetId, 'short', 'le');
            return packet;
        }
    },
};
