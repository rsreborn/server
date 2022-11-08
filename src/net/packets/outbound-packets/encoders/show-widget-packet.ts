import { ByteBuffer } from '@runejs/common';
import { OutboundPacket } from '../../packets';

interface WidgetData {
    widgetId: number;
}

export const showWidgetPacket: OutboundPacket<WidgetData> = {
    name: 'widget',
    opcodes: {
        319: 229,
        357: 255,
    },
    encoders: {
        319: (player, opcode, data) => {
            const buffer = new ByteBuffer(2);
            buffer.put(data.widgetId, 'short', 'le');
            return buffer;
        },
        357: (player, opcode, data) => {
            const buffer = new ByteBuffer(2);
            buffer.put(data.widgetId, 'short', 'le');
            return buffer;
        }
    },
};
