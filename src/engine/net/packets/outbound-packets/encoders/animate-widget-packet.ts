import { Packet } from '../../packet';
import { OutboundPacket } from '../../packets';

interface WidgetData {
    widgetId: number;
    animationId: number;
}

export const animateWidgetPacket: OutboundPacket<WidgetData> = {
    name: 'animateWidget',
    opcodes: {
        254: 95,
        289: 211,
        319: 95,
        357: 193,
    },
    encoders: {
        254: (player, opcode, data) => {
            const packet = new Packet(opcode);
            packet.put(data.widgetId, 'short');
            packet.put(data.animationId, 'short');
            return packet;
        },
        289: (player, opcode, data) => {
            const packet = new Packet(opcode);
            packet.put(data.widgetId, 'short');
            packet.put(data.animationId, 'short');
            return packet;
        },
        319: (player, opcode, data) => {
            const packet = new Packet(opcode);
            packet.put(data.widgetId, 'short');
            packet.put(data.animationId, 'short');
            return packet;
        },
        357: (player, opcode, data) => {
            const packet = new Packet(opcode);
            packet.put(data.animationId, 'short', 'le');
            packet.put(data.widgetId, 'short');
            return packet;
        }
    },
};
