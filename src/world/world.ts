import { logger } from '@runejs/common';
import { Coord } from './coord';
import { createNpcSyncState, Npc, npcSync, npcTick, npcTickCleanup } from './npc';
import { Player, playerTickCleanup, playerTick, playerSync } from './player';

export const TICK_LENGTH = 600;

export interface World {
    worldId: number;
    players: Player[];
    npcs: Npc[];
}

let worldSingleton: World;
let tickTimeout: NodeJS.Timeout;

const tick = async (): Promise<void> => {
    if (!worldSingleton) {
        throw new Error(`World is not open!`);
    }

    const startTime = Date.now();

    const activePlayers = worldSingleton.players.filter(p => p !== null);
    const activeNpcs = worldSingleton.npcs.filter(n => n !== null);

    if (activePlayers.length !== 0) {
        // Run Player and NPC ticks
        await Promise.all([
            ...activePlayers.map(async player => playerTick(player)),
            ...activeNpcs.map(async npc => npcTick(npc))
        ]);

        // Run Player and NPC syncs
        await Promise.all(
            activePlayers.map(async player => [playerSync(player), npcSync(player)]),
        );

        // Run Player and NPC post-tick cleanups
        await Promise.all([
            ...activePlayers.map(async player => playerTickCleanup(player)),
            ...activeNpcs.map(async npc => npcTickCleanup(npc))
        ]);
    }

    const endTime = Date.now();
    const duration = endTime - startTime;
    const delay = Math.max(TICK_LENGTH - duration, 0);

    // logger.info(`World ${worldSingleton.worldId} tick completed in ${duration} ms, next tick
    // in ${delay} ms.`);
    tickTimeout = setTimeout(async () => tick(), delay);
};

export const addPlayer = (player: Player): boolean => {
    if (worldSingleton.players.find(p => p?.uid === player.uid)) {
        logger.error(`Player ${player.username} (${player.uid}) is already online!`);
        return false;
    }

    const worldIndex = worldSingleton.players.findIndex(p => p === null);
    if (worldIndex === -1) {
        return false; // World is full
    }

    player.worldIndex = worldIndex;
    worldSingleton.players[worldIndex] = player;

    return true;
};

export const removePlayer = (player: Player): boolean => {
    worldSingleton.players[player.worldIndex] = null;
    return true;
};

export const openWorld = (
    worldId: number,
): World => {
    worldSingleton = {
        worldId,
        players: new Array(2000).fill(null),
        npcs: [{
            id: 50,
            coords: {
                x: 3223,
                y: 3223,
                plane: 0
            },
            sync: createNpcSyncState()
        },
        {
            id: 5,
            coords: {
                x: 3223,
                y: 3223,
                plane: 0
            },
            sync: createNpcSyncState()
        }],
    };

    logger.info(`World ${worldId} opened.`);

    tick();

    return worldSingleton;
};

export const closeWorld = (): void => {
    // @todo kick players - Kat 19/Oct/22

    if (tickTimeout) {
        clearTimeout(tickTimeout);
        tickTimeout = undefined;
    }

    if (worldSingleton) {
        logger.info(`World ${ worldSingleton.worldId } closed.`);
        worldSingleton = undefined;
    }
};

export const getWorld = (): World => {
    if (!worldSingleton) {
        throw new Error(`World is not open!`);
    }

    return worldSingleton;
};
