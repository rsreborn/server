import { ByteBuffer } from '@runejs/common';
import { Packet } from '../../packet';
import { OutboundPacket } from '../../packets';

interface WidgetData {
    widgetId: number;
    npcId: number;
}

export const showWidgetNpcHeadPacket: OutboundPacket<WidgetData> = {
    name: 'widgetNpcHead',
    opcodes: {
        254: 3,
        289: 244,
        319: 157,
        357: 18,
    },
    encoders: {
        254: (player, opcode, data) => {
            const packet = new Packet(3);
            packet.put(data.widgetId, 'short');
            packet.put(data.npcId, 'short');
            return packet;
        },
        289: (player, opcode, data) => {
            const packet = new Packet(244);
            packet.put(data.widgetId, 'short');
            packet.put(data.npcId, 'short');
            return packet;
        },
        319: (player, opcode, data) => {
            const packet = new Packet(157);
            packet.put(data.npcId, 'short');
            packet.put(data.widgetId, 'short', 'le');
            return packet;
        },
        357: (player, opcode, data) => {
            const packet = new Packet(18);
            packet.put(data.widgetId, 'short');
            packet.put(data.npcId, 'short', 'le');
            return packet;
        }
    },
};
