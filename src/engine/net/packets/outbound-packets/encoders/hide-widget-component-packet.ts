import { ByteBuffer } from '@runejs/common';
import { OutboundPacket } from '../../packets';

interface WidgetData {
    widgetId: number;
    shouldHideComponent: boolean;
}

export const hideWidgetComponentPacket: OutboundPacket<WidgetData> = {
    name: 'hideWidgetComponent',
    opcodes: {
        254: 227,
    },
    encoders: {
        254: (player, opcode, data) => {
            const buffer = new ByteBuffer(3);
            buffer.put(data.widgetId, 'short');
            buffer.put(Number(data.shouldHideComponent));
            return buffer;
        }
    },
};
