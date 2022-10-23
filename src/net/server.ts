import { createServer, Server } from 'net';
import { logger } from '@runejs/common';
import { connectionCreated } from './connection';
import { closeWorld, openWorld, World } from '../world';
import { loadCache } from '../cache';

export interface SocketOptions {
    noDelay?: boolean;
    keepAlive?: boolean;
    timeout?: number;
}

export interface ServerInstance {
    serverName: string;
    hostName: string;
    port: number;
    socketOptions?: SocketOptions;
    server: Server;
    world: World;
}

let serverSingleton: ServerInstance;
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

    serverSingleton?.server?.close();

    logger.info(`Server shut down.`);
    process.exit(0);
}));

export const startServer = async (
    serverName: string,
    hostName: string,
    port: number,
    worldId: number,
    socketOptions?: SocketOptions,
): Promise<ServerInstance> => {
    const server = createServer(
        socket => connectionCreated(socket, socketOptions)
    ).listen(port, hostName);

    await loadCache(319);

    const world = openWorld(worldId);

    logger.info(`${ serverName } listening @ ${ hostName }:${ port }.`);

    running = true;

    return {
        serverName,
        hostName,
        port,
        socketOptions,
        server,
        world,
    };
};

export const getServer = (): ServerInstance => {
    if (!serverSingleton) {
        throw new Error(`Server not yet initialized!`);
    }

    return serverSingleton;
};
