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
        319: 127,
    },
    encoders: {
        319: (player, opcode, data) => {
            const buffer = new ByteBuffer(data.message.length + 3);
            buffer.putString(data.message, 10);
            buffer.put(data.widgetId, 'short');
            return buffer;
        }
    },
};
