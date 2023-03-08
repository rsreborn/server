import { ByteBuffer } from '@runejs/common';
import { Packet } from '../../packet';
import { OutboundPacket } from '../../packets';

interface ClearItemContainerData {
    widgetId: number;
}

export const clearItemContainerPacket: OutboundPacket<ClearItemContainerData> = {
    name: 'clearItemContainer',
    opcodes: {
        254: 168,
    },
    encoders: {
        254: (player, opcode, data) => {
            const packet = new Packet(168);
            packet.put(data.widgetId, 'short');
            return packet;
        }
    },
};
