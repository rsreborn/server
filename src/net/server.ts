import { createServer, Server } from 'net';
import { logger } from '@runejs/common';
import { connectionCreated } from './connection';
import { openWorld, World } from '../world';

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

export const startServer = (
    serverName: string,
    hostName: string,
    port: number,
    worldId: number,
    socketOptions?: SocketOptions,
): ServerInstance => {
    const server = createServer(
        socket => connectionCreated(socket, socketOptions)
    ).listen(port, hostName);

    logger.info(`${ serverName } listening @ ${ hostName }:${ port }.`);

    const world = openWorld(worldId);

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
