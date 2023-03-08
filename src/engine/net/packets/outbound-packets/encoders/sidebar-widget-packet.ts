import { ByteBuffer } from '@runejs/common';
import { Packet } from '../../packet';
import { OutboundPacket } from '../../packets';

interface SidebarWidgetData {
    widgetId: number;
    sidebarId: number;
}

export const sidebarWidgetPacket: OutboundPacket<SidebarWidgetData> = {
    name: 'sidebarWidget',
    opcodes: {
        254: 91,
        289: 63,
        319: 229,
        357: 163,
        414: 242,
    },
    encoders: {
        254: (player, opcode, data) => {
            const packet = new Packet(91);
            packet.put(data.widgetId, 'short');
            packet.put(data.sidebarId, 'byte');
            return packet;
        },
        // 289: (player, opcode, data) => {
        //     const buffer = new ByteBuffer(3);
        //     buffer.put(data.widgetId, 'short');
        //     buffer.put(data.sidebarId, 'byte');
        //     return buffer;
        // },
        // 319: (player, opcode, data) => {
        //     const buffer = new ByteBuffer(3);
        //     buffer.put(data.widgetId, 'short');
        //     buffer.put(data.sidebarId, 'byte');
        //     return buffer;
        // },
        // 357: (player, opcode, data) => {
        //     const buffer = new ByteBuffer(3);
        //     buffer.put(data.widgetId, 'short');
        //     buffer.put(data.sidebarId, 'byte');
        //     return buffer;
        // },
        // 414: (player, opcode, data) => {
        //     const buffer = new ByteBuffer(3);
        //     buffer.put(data.widgetId, 'short');
        //     buffer.put(data.sidebarId, 'byte');
        //     return buffer;
        // }
    },
};
