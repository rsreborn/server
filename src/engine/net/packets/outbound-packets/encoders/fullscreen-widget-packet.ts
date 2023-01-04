import { ByteBuffer } from '@runejs/common';
import { OutboundPacket } from '../../packets';

interface WidgetData {
    fullscreenWidgetId: number,
    widgetId: number;
}

export const showFullscreenWidget: OutboundPacket<WidgetData> = {
    name: 'fullscreenWidget',
    opcodes: {
        357: 9,
    },
    encoders: {
        357: (player, opcode, data) => {
            const buffer = new ByteBuffer(4);
            buffer.put(data.fullscreenWidgetId, 'short');
            buffer.put(data.widgetId, 'short', 'le');
            return buffer;
        }
    },
};
