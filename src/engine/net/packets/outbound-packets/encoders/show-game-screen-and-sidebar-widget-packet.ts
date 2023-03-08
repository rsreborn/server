import { ByteBuffer } from '@runejs/common';
import { Packet } from '../../packet';
import { OutboundPacket } from '../../packets';

interface WidgetData {
    widgetId: number;
    sidebarWidgetId: number;
}

export const gameScreenAndSidebarPacket: OutboundPacket<WidgetData> = {
    name: 'gameScreenAndSidebar',
    opcodes: {
        254: 249,
    },
    encoders: {
        254: (player, opcode, data) => {
            const packet = new Packet(249);
            packet.put(data.widgetId, 'short');
            packet.put(data.sidebarWidgetId, 'short');
            return packet;
        }
    },
};
