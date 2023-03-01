import { ByteBuffer } from '@runejs/common';
import { Player } from '../../../world/player';
import { sendChatboxMessage } from '../packet-handler';
import { InboundPacket } from '../packets';

interface NpcClickPacketData {
    npcIndex: number;
}

export const npcClickPacket: InboundPacket<NpcClickPacketData> = {
    name: 'npc-click',
    handler: (
        player: Player,
        data: NpcClickPacketData,
    ): void => {
       
        sendChatboxMessage(player, `Npc Index: ${data.npcIndex}`);
    },
    opcodes: {
        254: [143, 195, 69, 122, 118],
        319: 111,
    },
    decoders: {
        254: (opcode: number, data: ByteBuffer) => {
            const npcIndex = data.get('short');
            return { npcIndex };
        },
        319: (opcode: number, data: ByteBuffer) => {
            const npcIndex = data.get('short', 'u', 'le');
            return { npcIndex };
        },
    },
};
