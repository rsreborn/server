import { ByteBuffer } from '@runejs/common';
import { Packet } from '../../packet';
import { OutboundPacket } from '../../packets';

interface WidgetData {
    widgetId: number;
}

export const showChatboxWidgetOnlyPacket: OutboundPacket<WidgetData> = {
    name: 'chatboxWidgetOnly',
    opcodes: {
        254: 141,
        289: 81,
        319: 200,
        357: 124,
    },
    encoders: {
        254: (player, opcode, data) => {
            const packet = new Packet(141);
            packet.put(data.widgetId, 'short');
            return packet;
        },
        289: (player, opcode, data) => {
            const packet = new Packet(81);
            packet.put(data.widgetId, 'short');
            return packet;
        },
        319: (player, opcode, data) => {
            const packet = new Packet(200);
            packet.put(data.widgetId, 'short');
            return packet;
        },
        357: (player, opcode, data) => {
            const packet = new Packet(124);
            packet.put(data.widgetId, 'short', 'le');
            return packet;
        }
    },
};
