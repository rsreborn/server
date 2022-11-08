import { ByteBuffer } from '@runejs/common';
import { Npc } from '../../../../world/npc';
import { Player } from '../../../../world/player';

export interface NpcSyncEncoder {
    packetOpcode: number;
    updateMaskEncoder: (npc: Npc, data: ByteBuffer) => void;
    appendNewlyTrackedNpcs: (player: Player, npc: Npc, data: ByteBuffer) => void;
}

export const npcSyncEncoders: { [key: number]: NpcSyncEncoder } = {};
