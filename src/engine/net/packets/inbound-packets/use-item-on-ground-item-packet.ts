import { ByteBuffer } from '@runejs/common';
import { Player } from '../../../world/player';
import { chatboxMessagePacket } from '../outbound-packets/encoders/chatbox-message-packet';
import { sendChatboxMessage } from '../packet-handler';
import { InboundPacket } from '../packets';

interface ItemOnGroundItemPacketData {
    groundItemId: number;
    groundItemX: number;
    groundItemY: number;
    fromInterfaceId: number;
    itemToUse: number;
    itemToUseSlot: number;
}

export const useItemOnGroundItemPacket: InboundPacket<ItemOnGroundItemPacketData> = {
    name: 'item-on-ground-item',
    handler: (
        player: Player,
        data: ItemOnGroundItemPacketData,
    ): void => {
        sendChatboxMessage(player, 
            `Item ${data.itemToUse} in slot ${data.itemToUseSlot} used on item ${data.groundItemId} at ${data.groundItemX}, ${data.groundItemY} from interface ${data.fromInterfaceId}`
            )
    },
    opcodes: {
        254: 245,
    },
    decoders: {
        254: (opcode: number, data: ByteBuffer) => {
            const groundItemX = data.get('short');
            const groundItemY = data.get('short');
            const groundItemId = data.get('short');
            const itemToUse = data.get('short');
            const itemToUseSlot = data.get('short');
            const fromInterfaceId = data.get('short');

            return { groundItemX, groundItemY, groundItemId, itemToUse, itemToUseSlot, fromInterfaceId };
        },
    },
};
