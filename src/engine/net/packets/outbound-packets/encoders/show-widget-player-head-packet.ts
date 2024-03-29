import { ByteBuffer } from '@runejs/common';
import { OutboundPacket } from '../../packets';

interface WidgetData {
    widgetId: number;
}

export const showWidgetPlayerHeadPacket: OutboundPacket<WidgetData> = {
    name: 'widgetPlayerHead',
    opcodes: {
        254: 161,
        289: 30,
        319: 252,
        357: 34,
    },
    encoders: {
        254: (player, opcode, data) => {
            const buffer = new ByteBuffer(2);
            buffer.put(data.widgetId, 'short');
            return buffer;
        },
        289: (player, opcode, data) => {
            const buffer = new ByteBuffer(2);
            buffer.put(data.widgetId, 'short');
            return buffer;
        },
        319: (player, opcode, data) => {
            const buffer = new ByteBuffer(2);
            buffer.put(data.widgetId, 'short', 'le');
            return buffer;
        },
        357: (player, opcode, data) => {
            const buffer = new ByteBuffer(2);
            buffer.put(data.widgetId, 'short', 'le');
            return buffer;
        }
    },
};
