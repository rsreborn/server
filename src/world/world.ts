import { logger } from '@runejs/common';

export interface World {
    worldId: number;
}

let worldSingleton: World;

export const openWorld = (
    worldId: number,
): World => {
    worldSingleton = {
        worldId,
    };

    logger.info(`World ${worldId} opened.`);

    return worldSingleton;
};

export const getWorld = (): World => {
    if (!worldSingleton) {
        throw new Error(`World not yet opened!`);
    }

    return worldSingleton;
};
