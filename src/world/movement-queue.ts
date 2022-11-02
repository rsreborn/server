import { coord, Coord } from './coord';
import { Player } from './player';

export interface MovementQueue {
    path: Coord[];
}

export const createMovementQueue = (): MovementQueue => {
    return {
        path: [],
    }
};

export const resetMovementQueue = (player: Player): void => {
    player.movementQueue.path = [];
}

export const getLastCoords = (player: Player): Coord => {
    if (player.movementQueue.path.length !== 0) {
        return player.movementQueue.path[player.movementQueue.path.length - 1];
    } else {
        return player.coords;
    }
};

export const queueCoord = (
    player: Player,
    { x, y }: Coord,
    forceRun: boolean = false, // @todo forced running - Kat 1/Nov/22
): void => {
    let lastPosition = getLastCoords(player);

    let lastX = lastPosition.x;
    let lastY = lastPosition.y;
    let diffX = x - lastX;
    let diffY = y - lastY;

    const stepsBetween = Math.max(Math.abs(diffX), Math.abs(diffY));

    for (let i = 0; i < stepsBetween; i++) {
        if (diffX !== 0) {
            diffX += diffX < 0 ? 1 : -1;
        }

        if (diffY !== 0) {
            diffY += diffY < 0 ? 1 : -1;
        }

        lastX = x - diffX;
        lastY = y - diffY;

        const newCoord = coord(lastX, lastY);

        lastPosition = newCoord;
        player.movementQueue.path.push(newCoord);
    }

    if (lastX !== x || lastY !== y) {
        const newCoord = coord(x, y);
        player.movementQueue.path.push(newCoord);
    }
};

export const calculateDirection = (diffX: number, diffY: number): number => {
    if(diffX < 0) {
        if(diffY < 0) {
            return 5;
        } else if(diffY > 0) {
            return 0;
        } else {
            return 3;
        }
    } else if(diffX > 0) {
        if(diffY < 0) {
            return 7;
        } else if(diffY > 0) {
            return 2;
        } else {
            return 4;
        }
    } else {
        if(diffY < 0) {
            return 6;
        } else if(diffY > 0) {
            return 1;
        } else {
            return -1;
        }
    }
};

export const queuePath = (
    player: Player,
    path: Coord[],
    clearQueue: boolean = false,
    forceRun: boolean = false,
): void => {
    if (clearQueue) {
        player.movementQueue.path = [];
    }

    path.forEach(coord => queueCoord(player, coord, forceRun));
}

export const movementTick = (player: Player) => {
    const path = player.movementQueue.path;

    if (!path.length) {
        return;
    }

    const walkPosition = path.shift();
    const originalPosition = player.coords;
    const walkDiffX = walkPosition.x - originalPosition.x;
    const walkDiffY = walkPosition.y - originalPosition.y;
    const walkDir = calculateDirection(walkDiffX, walkDiffY);

    if (walkDir === -1) {
        return;
    }

    player.coords = walkPosition;

    // @todo running - Kat 1/Nov/22
    // @todo map region changing - Kat 1/Nov/22

    player.sync.walkDir = walkDir;
};
