import { createServer, Server, Socket } from 'net';
import { createServer as createWebServer } from 'http';
import { ByteBuffer, logger } from '@runejs/common';
import { SocketOptions } from '../server';
import { getArchives, getCrcTable } from '../../cache';

export enum FileServerConnectionType {
    JAGGRAB = 'JAGGRAB',
    WEB = 'WEB',
}

export interface FileServer {
    hostName: string;
    jaggrabPort: number;
    webPort: number;
    socketOptions?: SocketOptions;
    jaggrabServer?: Server;
    webServer?: Server;
}

export interface FileServerConnection {
    socket: Socket;
}

let fileServer: FileServer;

const handleRequest = (request: string): ByteBuffer => {
    if (request.startsWith('/crc')) {
        return getCrcTable(319);
    } else {
        const archives = getArchives();
        const archiveNames = Object.keys(archives);

        for (const archiveName of archiveNames) {
            if (request.startsWith(`/${archiveName}`)) {
                return archives[archiveName];
            }
        }

        return null;
    }
};

const jaggrabDataReceived = (connection: FileServerConnection, data: Buffer): void => {
    const str = data.toString().trim();
    logger.info(str);
    const fileRequest = str.replace('JAGGRAB ', '');
    const fileData = handleRequest(fileRequest);
    if (fileData?.length) {
        connection.socket.write(fileData);
    }
};

const jaggrabConnectionClosed = (connection: FileServerConnection, hadError: boolean): void => {

};

const jaggrabConnectionError = (connection: FileServerConnection, error: Error): void => {

};

const jaggrabConnectionCreated = (
    socket: Socket,
    socketOptions?: SocketOptions,
): FileServerConnection => {
    const connection: FileServerConnection = { socket };

    socket.setNoDelay(socketOptions?.noDelay ?? true);
    socket.setKeepAlive(socketOptions?.keepAlive ?? true);
    socket.setTimeout(socketOptions?.timeout ?? 30000);

    socket.on('data', data => jaggrabDataReceived(connection, data));
    socket.on('close', hadError => jaggrabConnectionClosed(connection, hadError));
    socket.on('error', error => jaggrabConnectionError(connection, error));

    return connection;
};

export const startFileServer = (
    hostName: string,
    jaggrabPort: number,
    webPort: number,
    socketOptions?: SocketOptions,
): FileServer => {
    const webServer = createWebServer((req, res) => {
        logger.info(`${req.method} ${req.url}`);
        const fileData = handleRequest(req.url);
        if (fileData?.length) {
            res.writeHead(200, { 'Content-Type': 'application/octect-stream' });
            res.write(fileData);
        } else {
            res.writeHead(404);
        }
    }).listen(webPort, hostName);

    logger.info(`Web file server listening @ ${ hostName }:${ webPort }`);

    const jaggrabServer = createServer(
        socket =>
            jaggrabConnectionCreated(socket, socketOptions)
    ).listen(jaggrabPort, hostName);

    logger.info(`JAGGRAB file server listening @ ${ hostName }:${ jaggrabPort }`);

    fileServer = {
        hostName,
        jaggrabPort,
        webPort,
        socketOptions,
        jaggrabServer,
        webServer,
    };

    return fileServer;
};

export const getFileServer = (): FileServer => {
    if (!fileServer) {
        throw new Error(`File Server not yet initialized!`);
    }

    return fileServer;
};
