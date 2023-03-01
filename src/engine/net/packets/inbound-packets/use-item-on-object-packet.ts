import { ByteBuffer } from '@runejs/common';
import { Player } from '../../../world/player';
import { chatboxMessagePacket } from '../outbound-packets/encoders/chatbox-message-packet';
import { sendChatboxMessage } from '../packet-handler';
import { InboundPacket } from '../packets';

interface ItemOnObjectPacketData {
    objectId: number;
    objectX: number;
    objectY: number;
    fromInterfaceId: number;
    itemToUse: number;
    itemToUseSlot: number;
}

export const useItemOnObjectPacket: InboundPacket<ItemOnObjectPacketData> = {
    name: 'item-on-ground-item',
    handler: (
        player: Player,
        data: ItemOnObjectPacketData,
    ): void => {
        sendChatboxMessage(player, 
            `Item ${data.itemToUse} in slot ${data.itemToUseSlot} used on object ${data.objectId} at ${data.objectX}, ${data.objectY} from interface ${data.fromInterfaceId}`
            )
    },
    opcodes: {
        254: 240,
    },
    decoders: {
        254: (opcode: number, data: ByteBuffer) => {
            const objectX = data.get('short');
            const objectY = data.get('short');
            const objectId = data.get('short');
            const itemToUse = data.get('short');
            const itemToUseSlot = data.get('short');
            const fromInterfaceId = data.get('short');

            return { objectX, objectY, objectId, itemToUse, itemToUseSlot, fromInterfaceId };
        },
    },
};
