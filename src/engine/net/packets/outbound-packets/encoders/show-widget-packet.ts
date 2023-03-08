import { ByteBuffer } from '@runejs/common';
import { Packet } from '../../packet';
import { OutboundPacket } from '../../packets';

interface WidgetData {
    widgetId: number;
}

export const showWidgetPacket: OutboundPacket<WidgetData> = {
    name: 'widget',
    opcodes: {
        254: 197,
        289: 119,
        319: 188,
        357: 255,
    },
    encoders: {
        254: (player, opcode, data) => {
            const packet = new Packet(197);
            packet.put(data.widgetId, 'short');
            return packet;
        },
        289: (player, opcode, data) => {
            const packet = new Packet(119);
            packet.put(data.widgetId, 'short');
            return packet;
        },
        319: (player, opcode, data) => {
            const packet = new Packet(188);
            packet.put(data.widgetId, 'short', 'le');
            return packet;
        },
        357: (player, opcode, data) => {
            const packet = new Packet(255);
            packet.put(data.widgetId, 'short', 'le');
            return packet;
        }
    },
};
