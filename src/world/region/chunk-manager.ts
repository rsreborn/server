import { Coord, coord, isWithinDistance } from "../coord";
import { getWorld } from "../world";
import { Npc } from "../npc";
import { Player, playerLogin } from "../player";
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

export interface ChunkCoord {
    regionId: number,
    regionX: number,
    regionY: number,
    regionChunkLocalX: number,
    regionChunkLocalY: number,
    plane: number,
}

export const removePlayerFromChunk = (player: Player): void => {
    getChunkByCoords(player.coords).players.splice(player.worldIndex, 1);
}

export const removeNpcFromChunk = (npc: Npc): void => {
    getChunkByCoords(npc.coords).npcs.splice(npc.worldIndex, 1);
}

export const addPlayerToChunk = (player: Player): void => {
    const chunkId = getChunkId(player.coords);
    player.lastChunkId = chunkId;
    getChunk(chunkId).players[player.worldIndex] = player.worldIndex;
}

export const addNpcToChunk = (npc: Npc): void => {
    const chunkId = getChunkId(npc.coords);
    npc.lastChunkId = chunkId;
    getChunk(chunkId).npcs[npc.worldIndex] = npc.worldIndex;
}

export const updatePlayerChunk = (player: Player): void => {
    const chunkId = getChunkId(player.coords);
    if (player.lastChunkId !== chunkId) {
        const regionId = chunkId & 0xffff;
        const lastRegionId = player.lastChunkId & 0xffff;
        // console.log('regionId: ', regionId)
        // console.log('lastRegionId: ', lastRegionId)
        if (regionId !== lastRegionId) {
            // player.sync.mapRegion = true;
        }
        getChunk(player.lastChunkId).players.splice(player.worldIndex, 1);
        addPlayerToChunk(player);
    }
}

export const updateNpcChunk = (npc: Npc): void => {
    const chunkId = getChunkId(npc.coords);
    if (npc.lastChunkId !== chunkId) {
        getChunk(npc.lastChunkId).npcs.splice(npc.worldIndex, 1);
        addNpcToChunk(npc);
    }
}

export const getLocalChunkIds = (entityCoord: Coord, distance: number = 14): number[] => {
    const regionCoords = getRegionCoords(entityCoord);
    const chunkIds: number[] = [];
    const offset = Math.ceil(distance / 8) * 8;
    const baseX = regionCoords.regionBaseX + regionCoords.localRegionX;
    const baseY = regionCoords.regionBaseY + regionCoords.localRegionY;
    for (let x = baseX - offset; x < baseX + offset; x += 8) {
        for (let y = baseY - offset; y < baseY + offset; y += 8) {
            chunkIds.push(
                getChunkId(
                    coord(
                        x,
                        y,
                        entityCoord.plane
                    )
                )
            );
        }
    }

    return chunkIds;
}

export const getChunkIds = (chunkIds: number[]): Chunk[] => chunkIds.map(id => getWorld().chunkManager.activeChunks[id]).filter(chunk => chunk !== undefined);

export const getLocalPlayerIds = (entityCoord: Coord, distance: number = 14): number[] => {
    const chunkIds = getLocalChunkIds(entityCoord, distance);
    const chunks = getChunkIds(chunkIds);
    const players = chunks.map(chunk => chunk.players).flat();

    return players.filter(playerIndex => getWorld().players[playerIndex] && isWithinDistance(getWorld().players[playerIndex].coords, entityCoord, distance));
}

export const getLocalNpcIds = (entityCoord: Coord, distance: number = 14): number[] => {
    const chunkIds = getLocalChunkIds(entityCoord, distance);
    const chunks = getChunkIds(chunkIds);
    const npcs = chunks.map(chunk => chunk.npcs).flat();

    return npcs.filter(npcIndex => getWorld().npcs[npcIndex] && isWithinDistance(getWorld().npcs[npcIndex].coords, entityCoord, distance));
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

export const getChunkCoord = (chunkId: number): ChunkCoord => {
    return {
        regionId: chunkId & 0xffff,
        regionX: (chunkId >> 8) & 0xff,
        regionY: chunkId & 0xff,
        regionChunkLocalX: (chunkId >> 20) & 0xf,
        regionChunkLocalY: (chunkId >> 16) & 0xf,
        plane: (chunkId >> 24) & 0xf,
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

    return (coord.plane << 24)
      | (regionCoords.regionChunkLocalX << 20)
      | (regionCoords.regionChunkLocalY << 16)
      | (regionCoords.regionX << 8)
      | regionCoords.regionY;
}
