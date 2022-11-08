import { ByteBuffer } from '@runejs/common';
import { OutboundPacket } from '../../packets';

interface WidgetData {
    widgetId: number;
}

export const showChatboxWidgetPacket: OutboundPacket<WidgetData> = {
    name: 'chatboxWidget',
    opcodes: {
        319: 200,
    },
    encoders: {
        319: (player, opcode, data) => {
            const buffer = new ByteBuffer(2);
            buffer.put(data.widgetId, 'short');
            return buffer;
        }
    },
};
