import { Coord } from "../coord";
import { getWorld } from "world/world";
import { Npc } from "../npc";
import { Player } from "../player";
import { Chunk } from "./region";

export interface ChunkManager {
    activeChunks: Chunk[];
}

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

export const addPlayerToChunk = (player: Player): boolean => {
    const chunk = getChunk(getChunkId(player.coords));
    let players = chunk.players;

    if (players[player.worldIndex] === null) {
        players[player.worldIndex] = player;
    }
    return true;
}

export const addNpcToChunk = (npc: Npc): boolean => {
    const chunk = getChunk(getChunkId(npc.coords));
    let npcs = chunk.npcs;

    if (npcs[npc.worldIndex] === null) {
        npcs[npc.worldIndex] = npc;
    }
    return true;
}

export const removeEntityFromChunk = (entity: Player | Npc): boolean => {

    return false;
}


export const updateEntity = (entity: Player | Npc): boolean => {
    
    return false;
}

export const getRegionId = (coord: Coord): number => (((coord.x >> 3) / 8) << 8) + ((coord.y >> 3) / 8);

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

export const getChunk = (chunkId: number): Chunk => {

    const activeChunks = getWorld().chunkManager.activeChunks;
    let chunk = activeChunks[chunkId] ?? null;

    if (chunk === null) {
        chunk = {
            npcs: new Array(0),
            players: new Array(0),
        };
        activeChunks[chunkId] = chunk;
    }
    return chunk;
}

export const getChunkId = (coord: Coord): number => {
    const regionCoords = getRegionCoords(coord);
    return getRegionId(coord) | regionCoords.regionChunkLocalX >> 4 | regionCoords.regionChunkLocalY >> 6; // Todo keep the 8th bit for the plane when we add support - Brian 11/1/2022
}
