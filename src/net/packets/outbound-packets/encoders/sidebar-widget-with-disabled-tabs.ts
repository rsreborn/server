import { ByteBuffer } from '@runejs/common';
import { OutboundPacket } from '../../packets';

interface WidgetData {
    widgetId: number;
}

export const sidebarWidgetWithDisabledTabsPacket: OutboundPacket<WidgetData> = {
    name: 'sidebarDisabledTabs',
    opcodes: {
        319: 253
    },
    encoders: {
        319: (player, opcode, data) => {
            const buffer = new ByteBuffer(2);
            buffer.put(data.widgetId, 'short', 'le');
            return buffer;
        }
    },
};
