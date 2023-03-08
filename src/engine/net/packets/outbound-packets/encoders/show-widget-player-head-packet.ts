import { ByteBuffer } from '@runejs/common';
import { Packet } from '../../packet';
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
            const packet = new Packet(161);
            packet.put(data.widgetId, 'short');
            return packet;
        },
        289: (player, opcode, data) => {
            const packet = new Packet(30);
            packet.put(data.widgetId, 'short');
            return packet;
        },
        319: (player, opcode, data) => {
            const packet = new Packet(252);
            packet.put(data.widgetId, 'short', 'le');
            return packet;
        },
        357: (player, opcode, data) => {
            const packet = new Packet(34);
            packet.put(data.widgetId, 'short', 'le');
            return packet;
        }
    },
};
