import { ByteBuffer } from '@runejs/common';
import { Player } from '../../../world/player';
import { chatboxMessagePacket } from '../outbound-packets/encoders/chatbox-message-packet';
import { sendChatboxMessage } from '../packet-handler';
import { InboundPacket } from '../packets';

interface ItemOnPlayerPacketData {
    playerIndex: number;
    fromInterfaceId: number;
    itemToUse: number;
    itemToUseSlot: number;
}

export const useItemOnPlayerPacket: InboundPacket<ItemOnPlayerPacketData> = {
    name: 'item-on-player',
    handler: (
        player: Player,
        data: ItemOnPlayerPacketData,
    ): void => {
        sendChatboxMessage(player, 
            `Item ${data.itemToUse} in slot ${data.itemToUseSlot} used on player index ${data.playerIndex} from interface ${data.fromInterfaceId}`
            )
    },
    opcodes: {
        254: 113,
    },
    decoders: {
        254: (opcode: number, data: ByteBuffer) => {
            const playerIndex = data.get('short');
            const itemToUse = data.get('short');
            const itemToUseSlot = data.get('short');
            const fromInterfaceId = data.get('short');

            return { playerIndex, itemToUse, itemToUseSlot, fromInterfaceId };
        },
    },
};
