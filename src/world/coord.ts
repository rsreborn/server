export interface Coord {
    x: number;
    y: number;
    plane: number;
}

export const getMapCoord = (coord: Coord): Coord => ({
    x: coord.x >> 3,
    y: coord.y >> 3,
    plane: coord.plane,
});

export const getLocalCoord = (coord: Coord): Coord => ({
    x: coord.x - 8 * ((coord.x >> 3) - 6),
    y: coord.y - 8 * ((coord.y >> 3) - 6),
    plane: coord.plane,
});
