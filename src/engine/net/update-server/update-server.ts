import { getFileData } from '@runejs/cache';
import { ByteBuffer, logger } from '@runejs/common';
import { getCache, getCrcTable } from '../../cache';
import { Connection } from '../connection';

const queueFile = (
    connection: Connection,
    indexNumber: number,
    fileNumber: number,
): void => {
    if (!connection.queuedFiles) {
        connection.queuedFiles = [];
    }

    connection.queuedFiles.push({ indexNumber, fileNumber });
};

const generateFile = (
    connection: Connection,
    indexNumber: number,
    fileNumber: number,
): Buffer => {
    const build = connection.buildNumber;
    let fileData: ByteBuffer;

    if (indexNumber === 255 && fileNumber === 255) {
        fileData = getCrcTable(build);
    } else {
        const cache = getCache(build);
        if (!cache) {
            logger.error(`Cache ${build} is not loaded!`);
            return null;
        }

        const indexFile = cache.indexFiles.find(index => index.indexNumber === indexNumber);
        if (!indexFile) {
            logger.error(`Index file ${indexNumber} for build ${build} was not found!`);
            return null;
        }

        fileData = getFileData(cache.dataFile, indexFile, fileNumber);
    }

    if (!fileData?.length) {
        logger.error(`Data for file ${fileNumber} within index ${indexNumber} for build ${build} was not found!`);
        return null;
    }

    const buffer = new ByteBuffer((fileData.length - 2) + ((fileData.length - 2) / 511) + 8);
    buffer.put(indexNumber);
    buffer.put(fileNumber, 'short');

    let length: number = ((fileData.at(1, 'byte', 'u') << 24) + (fileData.at(2, 'byte', 'u') << 16) +
        (fileData.at(3, 'byte', 'u') << 8) + fileData.at(4, 'byte', 'u')) + 9;
    if (fileData.at(0) === 0) {
        length -= 4;
    }

    let c = 3;
    for (let i = 0; i < length; i++) {
        if (c === 512) {
            buffer.put(255);
            c = 1;
        }

        buffer.put(fileData.at(i));
        c++;
    }

    return buffer.flipWriter().toNodeBuffer();
};

export const handleUpdateServerRequests = (
    connection: Connection,
    request: ByteBuffer,
): void => {
    while (request.readable >= 4) {
        const requestType = request.get('byte', 'u');
        const indexNumber = request.get('byte', 'u');
        const fileNumber = request.get('short', 'u');

        switch (requestType) {
            case 0: // queue
                queueFile(connection, indexNumber, fileNumber);
                break;
            case 1: // immediate
                const fileResponse = generateFile(connection, indexNumber, fileNumber);
                if (fileResponse?.length) {
                    connection.socket.write(fileResponse);
                }
                break;
            case 2:
            case 3: // clear file queue
                connection.queuedFiles = [];
                break;
            case 4: // error
                break;
        }

        while ((connection.queuedFiles?.length ?? 0) > 0) {
            const file = connection.queuedFiles.shift();
            const fileResponse = generateFile(connection, file.indexNumber, file.fileNumber);
            if (fileResponse?.length) {
                connection.socket.write(generateFile(connection, file.indexNumber, file.fileNumber));
            }
        }
    }
};
