import { ByteBuffer } from '@runejs/common';
import { OutboundPacket } from '../../packets';

interface ShowItemData {
    widgetId: number;
    itemId: number;
    itemZoom: number;
}

export const showWidgetItemPacket: OutboundPacket<ShowItemData> = {
    name: 'widgetItem',
    opcodes: {
        254: 222,
    },
    encoders: {
        254: (player, opcode, data) => {
            const buffer = new ByteBuffer(6);
            buffer.put(data.widgetId, 'short');
            buffer.put(data.itemId, 'short'); // object Id
            buffer.put(data.itemZoom, 'short');

            return buffer;
        }
    },
};
