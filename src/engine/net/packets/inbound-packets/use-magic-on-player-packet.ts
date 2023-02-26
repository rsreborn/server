import { ByteBuffer } from '@runejs/common';
import { Player } from '../../../world/player';
import { chatboxMessagePacket } from '../outbound-packets/encoders/chatbox-message-packet';
import { sendChatboxMessage } from '../packet-handler';
import { InboundPacket } from '../packets';

interface MagicOnPlayerPacketData {
    spellId: number;
    npcIndex: number;
}

export const useMagicOnPlayerPacket: InboundPacket<MagicOnPlayerPacketData> = {
    name: 'item-on-player',
    handler: (
        player: Player,
        data: MagicOnPlayerPacketData,
    ): void => {
        sendChatboxMessage(player, 
            `Used Spell ${data.spellId} on Player Index: ${data.npcIndex}`)
    },
    opcodes: {
        254: 68,
    },
    decoders: {
        254: (opcode: number, data: ByteBuffer) => {
            const npcIndex = data.get('short');
            const spellId = data.get('short');

            return { npcIndex, spellId };
        },
    },
};
