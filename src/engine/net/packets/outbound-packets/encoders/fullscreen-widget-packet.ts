import { ByteBuffer } from '@runejs/common';
import { Packet } from '../../packet';
import { OutboundPacket } from '../../packets';

interface WidgetData {
    fullscreenWidgetId: number,
    widgetId: number;
}

export const showFullscreenWidget: OutboundPacket<WidgetData> = {
    name: 'fullscreenWidget',
    opcodes: {
        357: 9,
    },
    encoders: {
        357: (player, opcode, data) => {
            const packet = new Packet(9);
            packet.put(data.fullscreenWidgetId, 'short');
            packet.put(data.widgetId, 'short', 'le');
            return packet;
        }
    },
};
