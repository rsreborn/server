import { createServer, Server } from 'net';
import { logger } from '@runejs/common';
import { connectionCreated } from './connection';
import { closeWorld, openWorld, World } from '../world';
import { loadCaches } from '../cache';
import { getFileServer, startFileServer } from './file-server';

export interface SocketOptions {
    noDelay?: boolean;
    keepAlive?: boolean;
    timeout?: number;
}

export interface GameServer {
    serverName: string;
    hostName: string;
    port: number;
    buildNumbers: number[];
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
    buildNumbers: number[],
    socketOptions?: SocketOptions,
    fileServerSocketOptions?: SocketOptions,
): Promise<GameServer> => {
    await loadCaches(buildNumbers);

    startFileServer(hostName, jaggrabPort, webPort, fileServerSocketOptions);

    const server = createServer(
        socket => connectionCreated(socket, socketOptions)
    ).listen(port, hostName);

    running = true;

    const world = openWorld(worldId);

    logger.info(`${ serverName } listening @ ${ hostName }:${ port }`);

    gameServer = {
        serverName,
        hostName,
        port,
        buildNumbers,
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

export const serverRunning = (): boolean => {
    return running;
};
