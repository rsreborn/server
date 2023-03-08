import { ByteBuffer } from '@runejs/common';
import { Packet } from '../../packet';
import { OutboundPacket } from '../../packets';

interface ShowItemData {
    widgetId: number;
    itemId: number;
    itemZoom: number;
}

export const showWidgetItemPacket: OutboundPacket<ShowItemData> = {
    name: 'widgetItem',
    opcodes: {
        254: 222,
    },
    encoders: {
        254: (player, opcode, data) => {
            const packet = new Packet(222);
            packet.put(data.widgetId, 'short');
            packet.put(data.itemId, 'short'); // object Id
            packet.put(data.itemZoom, 'short');

            return packet;
        }
    },
};
