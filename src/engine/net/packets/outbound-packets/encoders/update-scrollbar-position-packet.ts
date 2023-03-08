import { encodeBase37Username } from '@engine/util/base37';
import { ByteBuffer } from '@runejs/common';
import { Packet } from '../../packet';
import { OutboundPacket } from '../../packets';

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
            const packet = new Packet(14);
             packet.put(data.widgetId, 'short');
             packet.put(data.pixelsToMove, 'short');
            return packet;
        }
    },
};
