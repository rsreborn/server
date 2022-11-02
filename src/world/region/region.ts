import { Npc } from "../npc";
import { Player } from "../player";

export interface Chunk { // 8 x 8 more tities
    // objects: RSObject[];
    npcs: number[];
    players: number[];
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
