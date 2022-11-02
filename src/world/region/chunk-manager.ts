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

export const removePlayerFromChunk = (player: Player): void => {
    getChunkByCoords(player.coords).players.splice(player.worldIndex, 1);
}

export const removeNpcFromChunk = (npc: Npc): void => {
    getChunkByCoords(npc.coords).npcs.splice(npc.worldIndex, 1);
}

export const addPlayerToChunk = (player: Player): void => {
    const chunkId = getChunkId(player.coords)
    player.lastChunkId = chunkId
    getChunk(chunkId).players[player.worldIndex] = player.worldIndex;
}

export const addNpcToChunk = (npc: Npc): void => {
    const chunkId = getChunkId(npc.coords)
    npc.lastChunkId = chunkId
    getChunk(chunkId).npcs[npc.worldIndex] = npc.worldIndex;
}

export const updatePlayerChunk = (player: Player): void => {
    const chunkId = getChunkId(player.coords)
    if (player.lastChunkId !== chunkId) {
        getChunk(player.lastChunkId).players.splice(player.worldIndex, 1);
        addPlayerToChunk(player)
    }
}

export const updateNpcChunk = (npc: Npc): void => {
    const chunkId = getChunkId(npc.coords)
    if (npc.lastChunkId !== chunkId) {
        getChunk(npc.lastChunkId).npcs.splice(npc.worldIndex, 1);
        addNpcToChunk(npc)
    }
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

export const getChunkByCoords = (coord: Coord): Chunk =>  getChunk(getChunkId(coord));

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
