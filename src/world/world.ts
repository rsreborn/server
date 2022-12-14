import { logger } from '@runejs/common';
import { Coord } from './coord';
import { createNpcSyncState, Npc, npcSync, npcTick, npcTickCleanup } from './npc';
import { Player, playerTickCleanup, playerTick, playerSync, createPlayerSyncState } from './player';
import { ChunkManager, addPlayerToChunk, removePlayerFromChunk, addNpcToChunk, removeNpcFromChunk } from './region';
import { serverRunning } from '../net/server';
import { defaultAppearance } from '../world/player/appearance';
import { createMovementQueue } from './movement-queue';
import { readFileSync } from 'fs';
import { systemUpdatePacket } from 'net/packets/outbound-packets/encoders/system-update-packet';
import { join } from 'path';

export const TICK_LENGTH = 600;

export interface World {
    worldId: number;
    players: Player[];
    npcs: Npc[];
    chunkManager: ChunkManager;
}

let worldSingleton: World;
let tickTimeout: NodeJS.Timeout;

const tick = async (): Promise<void> => {
    if (!worldSingleton) {
        throw new Error(`World is not open!`);
    }

    if (!serverRunning()) {
        return;
    }

    const startTime = Date.now();

    const activePlayers = worldSingleton.players.filter(p => p !== null);
    const activeNpcs = worldSingleton.npcs.filter(n => n !== null);

    if (activePlayers.length !== 0) {
        // Run Player and NPC ticks
        await Promise.all([
            ...activePlayers.map(async player => playerTick(player)),
            ...activeNpcs.map(async npc => npcTick(npc))
        ]);

        // Run Player and NPC syncs
        await Promise.all([
            ...activePlayers.map(async player => playerSync(player)),
            ...activePlayers.map(async player => npcSync(player)),
        ]);

        // Run Player and NPC post-tick cleanups
        await Promise.all([
            ...activePlayers.map(async player => playerTickCleanup(player)),
            ...activeNpcs.map(async npc => npcTickCleanup(npc))
        ]);
    }

    const endTime = Date.now();
    const duration = endTime - startTime;
    const delay = Math.max(TICK_LENGTH - duration, 0);

    //logger.info(`World ${worldSingleton.worldId} tick completed in ${duration} ms, next tick in ${delay} ms.`);
    tickTimeout = setTimeout(async () => tick(), delay);
};

export const addPlayer = (player: Player): boolean => {
    // if (worldSingleton.players.find(p => p?.uid === player.uid)) { wtf
    //     logger.error(`Player ${player.username} (${player.uid}) is already online!`);
    //     return false;
    // }

    const worldIndex = worldSingleton.players.findIndex((p, index) => p == null && index > 0);
    if (worldIndex === -1) {
        return false; // World is full
    }

    player.worldIndex = worldIndex;
    worldSingleton.players[worldIndex] = player;

    addPlayerToChunk(player);

    return true;
};

export const removePlayer = (player: Player): void => {
    removePlayerFromChunk(player)
    worldSingleton.players[player.worldIndex] = null;
};

interface NpcSpawnData {
    id: number;
    coords: Coord;
}

interface NpcSpawnData2 {
    id: number;
    x: number;
    y: number;
    height: number;
    walk: number;
    maxHit: number;
    strength: number;
    attack: number;
}

interface NpcSpawns {
    spawns: NpcSpawnData2[];
}

const convertTheStuff = () => {
    const result = readFileSync(join('.', 'data', 'spawn-config.cfg'), 'utf-8');
    
    let split = result.split(/[\t|\n]+/)
    let spawns: NpcSpawnData[] = []

    console.log(split[0], split.length)

    for(let i = 0; i < split.length; i++) {
        if (split[i].startsWith("spawn")) {
            let npcId = parseInt(split[i].substring(7));

            let npc = {
                id: npcId,
                coords: {
                    x: parseInt(split[i + 1]),
                    y: parseInt(split[i + 2]),
                    plane: parseInt(split[i + 3]),
                }
            } as NpcSpawnData;
            if (npcId <= 2291)
                spawns.push(npc);
        }
    }
    return spawns;
}

const loadTheJson = () => {
    const result = readFileSync(join('.', 'data', 'spawn-config.cfg'), 'utf-8');
    let spawns: NpcSpawns;
    spawns = JSON.parse(result);
    return spawns;
}

export const npcs = (): Npc[] => {
    let spawnData = convertTheStuff()
    let npcs = [];
    console.log(spawnData.length);
    for (let i = 0; i < spawnData.length; i++) {
        const worldIndex = worldSingleton.npcs.findIndex((p, index) => p == null && index > 0)
            npcs.push({
                id: spawnData[i].id,
                worldIndex: worldIndex,
                coords: {
                    x: spawnData[i].coords.x,
                    y: spawnData[i].coords.y,
                    plane: spawnData[i].coords.plane,
                },
                sync: createNpcSyncState(),
            });
            let npc = npcs[worldIndex]
            worldSingleton.npcs[worldIndex] = npc;
            addNpcToChunk(npcs[i]);
    }
    return npcs;
}

export const players = (): Player[] => {
    let players = [];

    for (let i = 10; i < 2048; i++) {
        let random = Math.floor(Math.random() * 120);
        let random2 = Math.floor(Math.random() * 120);
        players.push({
            username: "Cats" + i,
            coords: {
                x: 3222 + random,
                y: 3222 + random2,
                plane: 0
            },
            sync: createPlayerSyncState(),
            appearance: defaultAppearance(),
            movementQueue: createMovementQueue(),
            trackedPlayerIndexes: [],
            trackedNpcIndexes: [],
        });        
    }
    return players;
};

export const openWorld = (
    worldId: number,
): World => {
    worldSingleton = {
        worldId,
        chunkManager: {
            activeChunks: new Array(0),
        },
        players: new Array(2048).fill(null),
        npcs: new Array(16000).fill(null),
    };
    worldSingleton.npcs = npcs();

    logger.info(`World ${worldId} opened.`);

    tick();

    return worldSingleton;
};

export const closeWorld = (): void => {
    // @todo kick players - Kat 19/Oct/22

    if (tickTimeout) {
        clearTimeout(tickTimeout);
        tickTimeout = undefined;
    }

    if (worldSingleton) {
        logger.info(`World ${ worldSingleton.worldId } closed.`);
        worldSingleton = undefined;
    }
};

export const getWorld = (): World => {
    if (!worldSingleton) {
        throw new Error(`World is not open!`);
    }

    return worldSingleton;
};
