import { ByteBuffer } from '@runejs/common';
import { OutboundPacket } from '../../packets';

interface WidgetData {
    widgetId: number;
    widgetColor: number;
}

export const updateWidgetStringDisabledColorPacket: OutboundPacket<WidgetData> = {
    name: 'widgetStringDisabledColor',
    opcodes: {
        254: 38,
    },
    encoders: {
        254: (player, opcode, data) => {
            const buffer = new ByteBuffer(4);
            buffer.put(data.widgetId, 'short');
            buffer.put(data.widgetColor, 'short');
            return buffer;
        }
    },
};
