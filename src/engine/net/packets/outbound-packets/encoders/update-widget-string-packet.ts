import { ByteBuffer } from '@runejs/common';
import { Packet, PacketType } from '../../packet';
import { OutboundPacket } from '../../packets';

interface WidgetData {
    widgetId: number;
    message: string;
}

export const updateWidgetString: OutboundPacket<WidgetData> = {
    name: 'updateWidgetString',
//    size: PacketType.VAR_SHORT,
    opcodes: {
        254: 41,
        289: 59,
        319: 127,
        357: 239
    },
    encoders: {
        254: (player, opcode, data) => {
            const packet = new Packet(41, PacketType.VAR_SHORT);
            packet.put(data.widgetId, 'short');
            packet.putString(data.message, 10);
            return packet;
        },
        289: (player, opcode, data) => {
            const packet = new Packet(59, PacketType.VAR_SHORT);
            packet.put(data.widgetId, 'short');
            packet.putString(data.message, 10);
            return packet;
        },
        319: (player, opcode, data) => {
            const packet = new Packet(127, PacketType.VAR_SHORT);
            packet.putString(data.message, 10);
            packet.put(data.widgetId, 'short');
            return packet;
        },
        357: (player, opcode, data) => {
            const packet = new Packet(239, PacketType.VAR_SHORT);
            packet.put(data.widgetId, 'short');
            packet.putString(data.message, 10);
            return packet;
        }
    },
};
