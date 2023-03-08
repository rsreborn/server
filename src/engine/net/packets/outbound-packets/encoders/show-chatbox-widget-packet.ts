import { ByteBuffer } from '@runejs/common';
import { Packet } from '../../packet';
import { OutboundPacket } from '../../packets';

interface WidgetData {
    widgetId: number;
}

export const showChatboxWidgetPacket: OutboundPacket<WidgetData> = {
    name: 'chatboxWidget',
    opcodes: {
        254: 239,
    },
    encoders: {
        254: (player, opcode, data) => {
            const packet = new Packet(239);
            packet.put(data.widgetId, 'short');
            return packet;
        },
    },
};
