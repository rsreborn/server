import { ByteBuffer } from '@runejs/common';
import { Packet } from '../../packet';
import { OutboundPacket } from '../../packets';

interface WidgetPositionData {
    widgetId: number;
    xOffset: number;
    yOffset: number;
}

export const updateWidgetPositionPacket: OutboundPacket<WidgetPositionData> = {
    name: 'updateWidgetPosition',
    opcodes: {
        254: 27,
    },
    encoders: {
        254: (player, opcode, data) => {
            const packet = new Packet(27);
            packet.put(data.widgetId, 'short');
            packet.put(data.xOffset, 'short');
            packet.put(data.yOffset, 'short');
            return packet;
        }
    },
};
