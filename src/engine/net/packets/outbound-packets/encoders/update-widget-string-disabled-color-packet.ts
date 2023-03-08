import { ByteBuffer } from '@runejs/common';
import { Packet } from '../../packet';
import { OutboundPacket } from '../../packets';

interface WidgetData {
    widgetId: number;
    widgetColor: number;
}

export const updateWidgetStringDisabledColorPacket: OutboundPacket<WidgetData> = {
    name: 'widgetStringDisabledColor',
    opcodes: {
        254: 38,
    },
    encoders: {
        254: (player, opcode, data) => {
            const packet = new Packet(38);
            packet.put(data.widgetId, 'short');
            packet.put(data.widgetColor, 'short');
            return packet;
        }
    },
};
