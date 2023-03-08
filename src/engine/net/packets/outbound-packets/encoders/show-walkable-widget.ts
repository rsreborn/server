import { ByteBuffer } from '@runejs/common';
import { Packet } from '../../packet';
import { OutboundPacket } from '../../packets';

interface WidgetData {
    widgetId: number;
}

export const walkableWidgetPacket: OutboundPacket<WidgetData> = {
    name: 'walkableWidget',
    opcodes: {
        254: 85,
    },
    encoders: {
        254: (player, opcode, data) => {
            const packet = new Packet(85);
            packet.put(data.widgetId, 'short');
            return packet;
        }
    },
};
