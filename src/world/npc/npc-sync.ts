import { ByteBuffer } from '@runejs/common';
import { Player } from '../player';
import { Npc } from './npc';
import { handleOutboundPacket } from '../../net/packets';

export enum SyncFlags {
    APPEARANCE = 1,
    FOCE_CHAT = 2,
    FACE_ENTITY = 0x10,
}

export interface NpcSyncState {
    appearanceUpdate: boolean;
    forceChat: boolean;
    faceEntity: boolean;
    walkDir: number;
    runDir: number;
    teleporting: boolean;
}

export const npcUpdateRequired = (npc: Npc): boolean => {
    const {
        appearanceUpdate,
        forceChat,
        faceEntity,
    } = npc.sync;

    return appearanceUpdate || forceChat || faceEntity;
};

export const createNpcSyncState = (): NpcSyncState => {
    return {
        appearanceUpdate: false,
        forceChat: false,
        faceEntity: false,
        walkDir: -1,
        runDir: -1,
        teleporting: false
    };
};

export const resetNpcSyncState = (npc: Npc): void => {
    npc.sync = createNpcSyncState();
};

// const appendAddTrackedNpc = (npc: Npc, player: Player, data: ByteBuffer): void => {
//     const x = npc.coords.x - player.coords.x;
//     const y = npc.coords.y - player.coords.y;
//     const updateRequired = npc.sync.flags !== 0;
//
//     data.putBits(14, npc.index);
//     data.putBits(5, x);
//     data.putBits(1, updateRequired ? 1 : 0);
//     data.putBits(5, y);
//     data.putBits(12, npc.id);
//     data.putBits(1, 0);
// };

export const npcSync = async (player: Player): Promise<void> => {
    // We wrap this in a promise so that all NPC syncs can be run
    // in parallel using Promise.all()
    return new Promise<void>(resolve => {
        handleOutboundPacket(player, 'npcSync', {});
        resolve();
    });
};
