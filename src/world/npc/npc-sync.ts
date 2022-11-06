import { Player } from '../player';
import { Npc } from './npc';
import { handleOutboundPacket } from '../../net/packets';

export interface NpcSyncState {
    transformed: boolean;
    forceChat: boolean;
    faceEntity: boolean;
    walkDir: number;
    runDir: number;
    teleporting: boolean;
}

export const npcUpdateRequired = (npc: Npc): boolean => {
    const {
        transformed,
        forceChat,
        faceEntity,
    } = npc.sync;

    return transformed || forceChat || faceEntity;
};

export const createNpcSyncState = (): NpcSyncState => {
    return {
        transformed: false,
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

export const npcSync = async (player: Player): Promise<void> => {
    // We wrap this in a promise so that all NPC syncs can be run
    // in parallel using Promise.all()
    return new Promise<void>(resolve => {
        handleOutboundPacket(player, 'npcSync', {});
        resolve();
    });
};
