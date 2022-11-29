import { ByteBuffer } from '@runejs/common';
import { OutboundPacket, PacketSize } from '../../packets';

interface WidgetData {
    widgetId: number;
    message: string;
}

export const updateWidgetString: OutboundPacket<WidgetData> = {
    name: 'updateWidgetString',
    size: PacketSize.VAR_SHORT,
    opcodes: {
        289: 59,
        319: 127,
        357: 239
    },
    encoders: {
        289: (player, opcode, data) => {
            const buffer = new ByteBuffer(data.message.length + 3);
            buffer.put(data.widgetId, 'short');
            buffer.putString(data.message, 10);
            return buffer;
        },
        319: (player, opcode, data) => {
            const buffer = new ByteBuffer(data.message.length + 3);
            buffer.putString(data.message, 10);
            buffer.put(data.widgetId, 'short');
            return buffer;
        },
        357: (player, opcode, data) => {
            const buffer = new ByteBuffer(data.message.length + 3);
            buffer.put(data.widgetId, 'short');
            buffer.putString(data.message, 10);
            return buffer;
        }
    },
};
