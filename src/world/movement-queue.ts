import { Coord } from './coord';
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

export const queuePath = (player: Player, path: Coord[], forceRun: boolean): void => {
    console.log(path);

    let lastCoords = getLastCoords(player);
    for (const coord of path) {
        let diffX = coord.x - lastCoords.x;
        let diffY = coord.y - lastCoords.y;

        const stepsBetween = Math.max(Math.abs(diffX), Math.abs(diffY));

        for (let i = 0; i < stepsBetween; i++) {
            if(diffX !== 0) {
                diffX += diffX < 0 ? 1 : -1;
            }

            if(diffY !== 0) {
                diffY += diffY < 0 ? 1 : -1;
            }

            lastCoords.x -= diffX;
            lastCoords.y -= diffY;

            const newCoord: Coord = {
                x: lastCoords.x, y: lastCoords.y, plane: lastCoords.plane
            };

            player.movementQueue.path.push(newCoord);
        }

        if (lastCoords.x === coord.x && lastCoords.y === coord.y) {
            player.movementQueue.path.push(coord);
        }
    }

    console.log(player.movementQueue.path);
};
