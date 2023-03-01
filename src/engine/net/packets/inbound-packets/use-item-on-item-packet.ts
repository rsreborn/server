import { ByteBuffer } from '@runejs/common';
import { Player } from '../../../world/player';
import { chatboxMessagePacket } from '../outbound-packets/encoders/chatbox-message-packet';
import { sendChatboxMessage } from '../packet-handler';
import { InboundPacket } from '../packets';

interface ItemOnItemPacketData {
    usedWith: number;
    usedWithSlot: number;
    interfaceId: number;
    itemToUse: number;
    itemToUseSlot: number;
    // Todo: Figure out why we have two interface ids...
    interfaceId2: number;
}

export const useItemOnItemPacket: InboundPacket<ItemOnItemPacketData> = {
    name: 'item-on-item',
    handler: (
        player: Player,
        data: ItemOnItemPacketData,
    ): void => {
        sendChatboxMessage(player, 
            `Item ${data.itemToUse} in slot ${data.itemToUseSlot} used on item ${data.usedWith} in slot ${data.usedWithSlot} on interface ${data.interfaceId} ${data.interfaceId2}`
            )
    },
    opcodes: {
        254: 200,
    },
    decoders: {
        254: (opcode: number, data: ByteBuffer) => {
            const usedWith = data.get('short');
            const usedWithSlot = data.get('short');
            const interfaceId = data.get('short');
            const itemToUse = data.get('short');
            const itemToUseSlot = data.get('short');
            const interfaceId2 = data.get('short');

            return { usedWith, usedWithSlot, interfaceId, itemToUse, itemToUseSlot, interfaceId2 };
        },
    },
};
