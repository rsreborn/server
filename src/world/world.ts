import { logger } from '@runejs/common';
import { Player, playerTickCleanup, playerTick, playerSync } from './player';

export const TICK_LENGTH = 600;

export interface World {
    worldId: number;
    players: Player[];
}

let worldSingleton: World;
let tickTimeout: NodeJS.Timeout;

const tick = async (): Promise<void> => {
    if (!worldSingleton) {
        throw new Error(`World is not open!`);
    }

    const startTime = Date.now();

    const activePlayers = worldSingleton.players;

    if (activePlayers.length !== 0) {
        // Run Player and NPC ticks
        await Promise.all([
            ...activePlayers.map(async player => playerTick(player))
        ]); // @todo NPC tick should go here as well - Kat 19/Oct/22

        // Run Player and NPC syncs
        await Promise.all(activePlayers.map(async player => playerSync(player)));

        // Run Player and NPC post-tick cleanups
        await Promise.all([
            ...activePlayers.map(async player => playerTickCleanup(player))
        ]); // @todo NPC post-tick cleanup should go here as well - Kat 19/Oct/22
    }

    const endTime = Date.now();
    const duration = endTime - startTime;
    const delay = Math.max(TICK_LENGTH - duration, 0);

    // logger.info(`World ${worldSingleton.worldId} tick completed in ${duration} ms, next tick
    // in ${delay} ms.`);
    tickTimeout = setTimeout(async () => tick(), delay);
};

export const addPlayer = (player: Player): boolean => {
    if (worldSingleton.players.find(p => p.uid === player.uid)) {
        logger.error(`Player ${player.username} (${player.uid}) is already online!`);
        return false;
    }

    // @todo check available world slots - Kat 19/Oct/22
    return true;
};

export const removePlayer = (player: Player): boolean => {
    if (worldSingleton.players.find(p => p.uid === player.uid)) {
        logger.error(`Player ${player.username} (${player.uid}) is not online!`);
        return false;
    }

    // @todo reset player world slot - Kat 19/Oct/22
    return true;
};

export const openWorld = (
    worldId: number,
): World => {
    worldSingleton = {
        worldId,
        players: [],
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
