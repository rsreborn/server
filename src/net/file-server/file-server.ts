import { createServer, Server, Socket } from 'net';
import { createServer as createWebServer } from 'http';
import { ByteBuffer, logger } from '@runejs/common';
import { SocketOptions } from '../server';
import { archiveNames, findArchive, getCrcTable } from '../../cache';

export interface FileServer {
    hostName: string;
    jaggrabPort: number;
    webPort: number;
    socketOptions?: SocketOptions;
    jaggrabServer?: Server;
    webServer?: Server;
}

export interface FileServerConnection {
    socket?: Socket;
}

let fileServer: FileServer;

const handleRequest = (
    request: string,
): ByteBuffer => {
    logger.info(`File request ${request} received.`);

    if (request.startsWith('/crc')) {
        try {
            const parts = request.split('-');
            const buildNumber = parseInt(parts[parts.length - 1], 10);
            return getCrcTable(buildNumber);
        } catch (e) {
            logger.error(e);
            return null;
        }
    } else {
        for (const archiveName of archiveNames) {
            if (request.startsWith(`/${archiveName}`)) {
                const checksum = parseInt(request.substring(archiveName.length + 1), 10);
                return findArchive(archiveName, checksum)?.data || null;
            }
        }

        return null;
    }
};

const jaggrabDataReceived = (
    connection: FileServerConnection,
    data: Buffer,
): void => {
    const str = data.toString().trim();
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
