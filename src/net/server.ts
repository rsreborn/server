import { createServer, Server } from 'net';
import { logger } from '@runejs/common';
import { connectionCreated } from './connection';
import { closeWorld, openWorld, World } from '../world';
import { loadCache } from '../cache';
import { getFileServer, startFileServer } from './file-server';
import { readPacketFiles } from './packets';

export interface SocketOptions {
    noDelay?: boolean;
    keepAlive?: boolean;
    timeout?: number;
}

export interface GameServer {
    serverName: string;
    hostName: string;
    port: number;
    buildNumber: number; // @todo make this player based with the server supporting any - Kat 29/Oct/22
    socketOptions?: SocketOptions;
    server: Server;
    world: World;
}

let gameServer: GameServer;
let running: boolean = false;

const shutdownEvents = [
    'SIGHUP',  'SIGINT',  'SIGQUIT',
    'SIGILL',  'SIGTRAP', 'SIGABRT',
    'SIGBUS',  'SIGFPE',  'SIGUSR1',
    'SIGSEGV', 'SIGUSR2', 'SIGTERM'
];

shutdownEvents.forEach(signal => process.on(signal as any, () => {
    if (!running) {
        return;
    }

    running = false;

    logger.warn(`${signal} received.`);

    closeWorld();

    gameServer?.server?.close();
    getFileServer()?.jaggrabServer?.close();
    getFileServer()?.webServer?.close();

    logger.info(`Server shut down.`);
    process.exit(0);
}));

export const startServer = async (
    serverName: string,
    hostName: string,
    port: number,
    worldId: number,
    jaggrabPort: number,
    webPort: number,
    buildNumber: number = 319,
    socketOptions?: SocketOptions,
    fileServerSocketOptions?: SocketOptions,
): Promise<GameServer> => {
    await loadCache(buildNumber);

    startFileServer(hostName, jaggrabPort, webPort, fileServerSocketOptions);

    const server = createServer(
        socket => connectionCreated(socket, socketOptions)
    ).listen(port, hostName);

    const world = openWorld(worldId);

    logger.info(`${ serverName } listening @ ${ hostName }:${ port }`);

    running = true;

    gameServer = {
        serverName,
        hostName,
        port,
        buildNumber,
        socketOptions,
        server,
        world,
    };

    return gameServer;
};

export const getGameServer = (): GameServer => {
    if (!gameServer) {
        throw new Error(`Game Server not yet initialized!`);
    }

    return gameServer;
};
