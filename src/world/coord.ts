export interface Coord {
    x: number;
    y: number;
    plane: number;
}

export const getMapCoord = (position: Coord): Coord => ({
    x: position.x >> 3,
    y: position.y >> 3,
    plane: position.plane,
});
