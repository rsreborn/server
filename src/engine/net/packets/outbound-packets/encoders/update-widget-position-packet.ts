import { ByteBuffer } from '@runejs/common';
import { OutboundPacket, PacketSize } from '../../packets';

interface WidgetPositionData {
    widgetId: number;
    xOffset: number;
    yOffset: number;
}

export const updateWidgetPositionPacket: OutboundPacket<WidgetPositionData> = {
    name: 'updateWidgetPosition',
    opcodes: {
        254: 27,
    },
    encoders: {
        254: (player, opcode, data) => {
            const buffer = new ByteBuffer(6);
            buffer.put(data.widgetId, 'short');
            buffer.put(data.xOffset, 'short');
            buffer.put(data.yOffset, 'short');
            return buffer;
        }
    },
};
