export interface Coord {
    x: number;
    y: number;
    plane?: number;
}

export const coord = (x: number, y: number, plane: number = 0): Coord => {
    return { x, y, plane };
};

export const getMapCoord = (coord: Coord): Coord => ({
    x: coord.x >> 3,
    y: coord.y >> 3,
    plane: coord.plane ?? 0,
});

export const getLocalCoord = (coord: Coord): Coord => ({
    x: coord.x - 8 * ((coord.x >> 3) - 6),
    y: coord.y - 8 * ((coord.y >> 3) - 6),
    plane: coord.plane ?? 0,
});

export const getRegionId = (coord: Coord): Coord => ({
    x: coord.x - 8 * ((coord.x >> 3) - 6),
    y: coord.y - 8 * ((coord.y >> 3) - 6),
    plane: coord.plane ?? 0,
});

export const isWithinDistance = (position1: Coord, position2: Coord): boolean => {
    if (position1.plane !== position2.plane) {
        return false;
    }
    let deltaX = position1.x - position2.x, deltaY = position1.y - position2.y;
    return deltaX <= 14 && deltaX >= -15 && deltaY <= 14 && deltaY >= -15;
}
