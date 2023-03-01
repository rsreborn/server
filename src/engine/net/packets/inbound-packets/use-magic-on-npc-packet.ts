import { ByteBuffer } from '@runejs/common';
import { Player } from '../../../world/player';
import { chatboxMessagePacket } from '../outbound-packets/encoders/chatbox-message-packet';
import { sendChatboxMessage } from '../packet-handler';
import { InboundPacket } from '../packets';

interface MagicOnNpcPacketData {
    spellId: number;
    npcIndex: number;
}

export const useMagicOnNpcPacket: InboundPacket<MagicOnNpcPacketData> = {
    name: 'item-on-npc',
    handler: (
        player: Player,
        data: MagicOnNpcPacketData,
    ): void => {
        sendChatboxMessage(player, 
            `Used Spell ${data.spellId} on NPC Index: ${data.npcIndex}`)
    },
    opcodes: {
        254: 231,
    },
    decoders: {
        254: (opcode: number, data: ByteBuffer) => {
            const npcIndex = data.get('short');
            const spellId = data.get('short');

            return { npcIndex, spellId };
        },
    },
};
