import { ByteBuffer } from '@runejs/common';
import { OutboundPacket } from '../../packets';

interface WidgetData {
    widgetId: number;
    npcId: number;
}

export const showWidgetNpcHeadPacket: OutboundPacket<WidgetData> = {
    name: 'widgetNpcHead',
    opcodes: {
        319: 157,
    },
    encoders: {
        319: (player, opcode, data) => {
            const buffer = new ByteBuffer(4);
            buffer.put(data.npcId, 'short');
            buffer.put(data.widgetId, 'short', 'le');
            return buffer;
        }
    },
};
