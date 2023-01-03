import { ByteBuffer } from '@runejs/common';
import { OutboundPacket } from '@net/packets/packets';

interface WidgetData {
    widgetId: number;
    animationId: number;
}

export const animateWidgetPacket: OutboundPacket<WidgetData> = {
    name: 'animateWidget',
    opcodes: {
        289: 211,
        319: 95,
        357: 193,
    },
    encoders: {
        289: (player, opcode, data) => {
            const buffer = new ByteBuffer(4);
            buffer.put(data.widgetId, 'short');
            buffer.put(data.animationId, 'short');
            return buffer;
        },
        319: (player, opcode, data) => {
            const buffer = new ByteBuffer(4);
            buffer.put(data.widgetId, 'short');
            buffer.put(data.animationId, 'short');
            return buffer;
        },
        357: (player, opcode, data) => {
            const buffer = new ByteBuffer(4);
            buffer.put(data.animationId, 'short', 'le');
            buffer.put(data.widgetId, 'short');
            return buffer;
        }
    },
};
