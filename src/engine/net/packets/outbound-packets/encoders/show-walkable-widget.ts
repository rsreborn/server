import { ByteBuffer } from '@runejs/common';
import { sendUpdateCoords } from '../../packet-handler';
import { OutboundPacket } from '../../packets';

interface WidgetData {
    widgetId: number;
}

export const walkableWidgetPacket: OutboundPacket<WidgetData> = {
    name: 'walkableWidget',
    opcodes: {
        254: 85,
    },
    encoders: {
        254: (player, opcode, data) => {
            const buffer = new ByteBuffer(2);
            buffer.put(data.widgetId, 'short');
            return buffer;
        }
    },
};
