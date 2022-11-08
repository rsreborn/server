import { Coord } from "../coord";
import { NpcSyncState, resetNpcSyncState } from "./npc-sync";

export interface Npc {
    id: number;
    worldIndex: number;
    coords: Coord;
    sync: NpcSyncState;
    lastChunkId?: number;
}

export const npcTick = async (npc: Npc): Promise<void> => {
    // We wrap this in a promise so that all player ticks can be run
    // in parallel using Promise.all()
    return new Promise<void>(resolve => {
        // @todo - Kat 19/Oct/22
        resolve();
    });
};

export const npcTickCleanup = async (npc: Npc): Promise<void> => {
    return new Promise<void>(resolve => {
        resetNpcSyncState(npc);
        resolve();
    });
};
