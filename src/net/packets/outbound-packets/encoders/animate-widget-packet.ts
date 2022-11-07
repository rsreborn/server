import { ByteBuffer } from '@runejs/common';
import { OutboundPacket } from '../../packets';

interface WidgetData {
    widgetId: number;
    animationId: number;
}

export const animateWidgetPacket: OutboundPacket<WidgetData> = {
    name: 'animateWidget',
    opcodes: {
        319: 95,
    },
    encoders: {
        319: (player, opcode, data) => {
            const buffer = new ByteBuffer(4);
            buffer.put(data.widgetId, 'short');
            buffer.put(data.animationId, 'short');
            return buffer;
        }
    },
};
