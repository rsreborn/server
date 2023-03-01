import { ByteBuffer } from '@runejs/common';
import { Player } from '../../../world/player';
import { chatboxMessagePacket } from '../outbound-packets/encoders/chatbox-message-packet';
import { sendChatboxMessage } from '../packet-handler';
import { InboundPacket } from '../packets';

interface MagicOnItemPacketData {
    spellId: number;
    itemId: number;
    slotIndex: number;
    interfaceId: number;
}

export const useMagicOnItemPacket: InboundPacket<MagicOnItemPacketData> = {
    name: 'magic-on-item',
    handler: (
        player: Player,
        data: MagicOnItemPacketData,
    ): void => {
        sendChatboxMessage(player, 
            `Used Spell ${data.spellId} on item id ${data.itemId} in slot ${data.slotIndex} on interface ${data.interfaceId}`)
    },
    opcodes: {
        254: 102,
    },
    decoders: {
        254: (opcode: number, data: ByteBuffer) => {
            const itemId = data.get('short');
            const slotIndex = data.get('short');
            const interfaceId = data.get('short');
            const spellId = data.get('short');

            return { itemId, spellId, slotIndex, interfaceId };
        },
    },
};
