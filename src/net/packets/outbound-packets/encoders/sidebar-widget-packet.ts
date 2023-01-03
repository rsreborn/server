import { ByteBuffer } from '@runejs/common';
import { OutboundPacket } from '@net/packets/packets';

interface SidebarWidgetData {
    widgetId: number;
    sidebarId: number;
}

export const sidebarWidgetPacket: OutboundPacket<SidebarWidgetData> = {
    name: 'sidebarWidget',
    opcodes: {
        289: 63,
        319: 229,
        357: 163,
    },
    encoders: {
        289: (player, opcode, data) => {
            const buffer = new ByteBuffer(3);
            buffer.put(data.widgetId, 'short');
            buffer.put(data.sidebarId, 'byte');
            return buffer;
        },
        319: (player, opcode, data) => {
            const buffer = new ByteBuffer(3);
            buffer.put(data.widgetId, 'short');
            buffer.put(data.sidebarId, 'byte');
            return buffer;
        },
        357: (player, opcode, data) => {
            const buffer = new ByteBuffer(3);
            buffer.put(data.widgetId, 'short');
            buffer.put(data.sidebarId, 'byte');
            return buffer;
        }
    },
};
