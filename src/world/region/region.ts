import { Coord } from "../coord"
import { Npc } from "../npc";
import { Player } from "../player";

export const getRegionId = (coord: Coord): number => (((coord.x >> 3) / 8) << 8) + ((coord.y >> 3) / 8);

export interface RegionCoord {
    regionBaseX: number,
    regionBaseY: number,
    regionX: number,
    regionY: number,
    localRegionX: number,
    localRegionY: number,
    regionChunkLocalX: number,
    regionChunkLocalY: number,
    regionChunkTileLocalX: number,
    regionChunkTileLocalY: number,
}

export const getRegionCoords = (coord: Coord): RegionCoord => {
    const regionBaseX = (coord.x >> 6) << 6
    const regionBaseY = (coord.y >> 6) << 6
    const regionX = regionBaseX >> 6
    const regionY = regionBaseY >> 6
    const localRegionX = coord.x - regionBaseX
    const localRegionY = coord.y - regionBaseY
    const regionChunkLocalX = localRegionX >> 3
    const regionChunkLocalY = localRegionY >> 3
    const regionChunkTileLocalX = localRegionX - (regionChunkLocalX << 3)
    const regionChunkTileLocalY = localRegionY - (regionChunkLocalY << 3)

    return {
        regionBaseX,
        regionBaseY,
        regionX,
        regionY,
        localRegionX,
        localRegionY,
        regionChunkLocalX,
        regionChunkLocalY,
        regionChunkTileLocalX,
        regionChunkTileLocalY,
    }
};

export interface Chunk { // 8 x 8 more tities
    // objects: RSObject[];
    npcs: Npc[];
    players: Player[];
    // triggers:
}






// export const getRegionId = (coord: Coord): number => ();

// 1 2 4 8

// const x, y, z = 0;

// const regionBaseX = (x >> 6) << 6
// const regionBaseY = (y >> 6) << 6
// const regionX = regionBaseX >> 6
// const regionY = regionBaseY >> 6
// const localRegionX = x - regionBaseX
// const localRegionY = y - regionBaseY
// const regionChunkLocalX = localRegionX >> 3
// const regionChunkLocalY = localRegionY >> 3
// const regionChunkTileLocalX = localRegionX - (regionChunkLocalX << 3)
// const regionChunkTileLocalY = localRegionY - (regionChunkLocalY << 3)

// export interface Chunk { // 8 x 8 tities
//     // objects: RSObject[];
//     npcs: Npc[];
//     players: Player[];
// }

// export 