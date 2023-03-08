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
        // 289: (player, opcode, data) => {
        //     const buffer = new ByteBuffer(data.message.length + 3);
        //     buffer.put(data.widgetId, 'short');
        //     buffer.putString(data.message, 10);
        //     return buffer;
        // },
        // 319: (player, opcode, data) => {
        //     const buffer = new ByteBuffer(data.message.length + 3);
        //     buffer.putString(data.message, 10);
        //     buffer.put(data.widgetId, 'short');
        //     return buffer;
        // },
        // 357: (player, opcode, data) => {
        //     const buffer = new ByteBuffer(data.message.length + 3);
        //     buffer.put(data.widgetId, 'short');
        //     buffer.putString(data.message, 10);
        //     return buffer;
        // }
    },
};
