import { encodeBase37Username } from '@engine/util/base37';
import { ByteBuffer } from '@runejs/common';
import { OutboundPacket, PacketSize } from '../../packets';

interface ScrollbarPositionData {
    widgetId: number;
    pixelsToMove: number;
}

export const updateScrollbarPositionPacket: OutboundPacket<ScrollbarPositionData> = {
    name: 'updateScrollbarPosition',
    opcodes: {
        254: 14,
    },
    encoders: {
        254: (player, opcode, data) => {
            const buffer = new ByteBuffer(4);
             buffer.put(data.widgetId, 'short');
             buffer.put(data.pixelsToMove, 'short');
            return buffer;
        }
    },
};
