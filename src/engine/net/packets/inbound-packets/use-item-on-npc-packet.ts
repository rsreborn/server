import { ByteBuffer } from '@runejs/common';
import { Player } from '../../../world/player';
import { chatboxMessagePacket } from '../outbound-packets/encoders/chatbox-message-packet';
import { sendChatboxMessage } from '../packet-handler';
import { InboundPacket } from '../packets';

interface ItemOnNpcPacketData {
    npcIndex: number;
    fromInterfaceId: number;
    itemToUse: number;
    itemToUseSlot: number;
}

export const useItemOnNpcPacket: InboundPacket<ItemOnNpcPacketData> = {
    name: 'item-on-npc',
    handler: (
        player: Player,
        data: ItemOnNpcPacketData,
    ): void => {
        sendChatboxMessage(player, 
            `Item ${data.itemToUse} in slot ${data.itemToUseSlot} used on npc index ${data.npcIndex} from interface ${data.fromInterfaceId}`
            )
    },
    opcodes: {
        254: 119,
    },
    decoders: {
        254: (opcode: number, data: ByteBuffer) => {
            const npcIndex = data.get('short');
            const itemToUse = data.get('short');
            const itemToUseSlot = data.get('short');
            const fromInterfaceId = data.get('short');

            return { npcIndex, itemToUse, itemToUseSlot, fromInterfaceId };
        },
    },
};
