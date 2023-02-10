import { ByteBuffer } from '@runejs/common';
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
            const buffer = new ByteBuffer(2);
            buffer.put(data.widgetId, 'short');
            return buffer;
        },
        319: (player, opcode, data) => {
            const buffer = new ByteBuffer(2);
            buffer.put(data.widgetId, 'short', 'le');
            return buffer;
        }
    },
};
