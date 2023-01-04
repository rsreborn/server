import { ByteBuffer } from '@runejs/common';
import { Player } from '../../../world/player';
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
       
        console.log(`npc click handler ${data.npcIndex}`);
    },
    opcodes: {
        319: 111,
    },
    decoders: {
        319: (opcode: number, data: ByteBuffer) => {
            const npcIndex = data.get('short', 'u', 'le');
            return { npcIndex };
        },
    },
};
