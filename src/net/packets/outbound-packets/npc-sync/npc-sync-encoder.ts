import { ByteBuffer } from '@runejs/common';
import { Npc } from '../../../../world/npc';
import { Player } from '../../../../world/player';

export interface NpcSyncEncoder {
    packetOpcode: number;
    updateMaskEncoder: (npc: Npc, player: Player, data: ByteBuffer) => void;
    appendNewlyTrackedNpcs: (player: Player, npc: Npc, data: ByteBuffer) => void;
    //faceNpc: (npc: Npc, data: ByteBuffer) => void;
    facePlayer: (npc: Npc, player: Player, data: ByteBuffer) => void;
}

export const npcSyncEncoders: { [key: number]: NpcSyncEncoder } = {};
