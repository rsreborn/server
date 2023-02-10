import { ByteBuffer } from '@runejs/common';
import { OutboundPacket } from '../../packets';

interface WidgetData {
    widgetId: number;
    sidebarWidgetId: number;
}

export const gameScreenAndSidebar: OutboundPacket<WidgetData> = {
    name: 'gameScreenAndSidebar',
    opcodes: {
        254: 249,
    },
    encoders: {
        254: (player, opcode, data) => {
            const buffer = new ByteBuffer(4);
            buffer.put(data.widgetId, 'short');
            buffer.put(data.sidebarWidgetId, 'short');
            return buffer;
        }
    },
};
