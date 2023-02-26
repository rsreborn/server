import { ByteBuffer } from '@runejs/common';
import { Player } from '../../../world/player';
import { chatboxMessagePacket } from '../outbound-packets/encoders/chatbox-message-packet';
import { sendChatboxMessage } from '../packet-handler';
import { InboundPacket } from '../packets';

interface MagicOnGroundItemPacketData {
    spellId: number;
    itemId: number;
    itemX: number;
    itemY: number;
}

export const useMagicOnGroundItemPacket: InboundPacket<MagicOnGroundItemPacketData> = {
    name: 'magic-on-ground-item',
    handler: (
        player: Player,
        data: MagicOnGroundItemPacketData,
    ): void => {
        sendChatboxMessage(player, 
            `Used Spell ${data.spellId} on item id ${data.itemId} at ${data.itemX}, ${data.itemY}`);
    },
    opcodes: {
        254: 202,
    },
    decoders: {
        254: (opcode: number, data: ByteBuffer) => {
            const itemX = data.get('short');
            const itemY = data.get('short');
            const itemId = data.get('short');
            const spellId = data.get('short');

            return { itemId, spellId, itemX, itemY };
        },
    },
};
