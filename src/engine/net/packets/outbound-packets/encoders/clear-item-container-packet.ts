import { ByteBuffer } from '@runejs/common';
import { OutboundPacket } from '../../packets';

interface ClearItemContainerData {
    widgetId: number;
}

export const clearItemContainerPacket: OutboundPacket<ClearItemContainerData> = {
    name: 'clearItemContainer',
    opcodes: {
        254: 168,
    },
    encoders: {
        254: (player, opcode, data) => {
            const buffer = new ByteBuffer(2);
             buffer.put(data.widgetId, 'short');
            return buffer;
        }
    },
};
