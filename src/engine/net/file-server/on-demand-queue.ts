import { Socket } from 'engine/net';
import { queue } from 'async';
import { ByteBuffer } from '@runejs/common';
import { getFileData } from '@runejs/cache';
import { getCache } from '../../cache';
import { Connection } from '../connection';

export interface OnDemandTask {
    cacheIndex: number;
    fileNumber: number;
    priority: number;
    connection: Connection;
}

export const handleOnDemandRequests = (
    connection: Connection,
    request: ByteBuffer,
): void => {
    while (request.readable >= 4) {
        const cacheIndex = request.get('byte', 'u') + 1;
        const fileNumber = request.get('short', 'u');
        const priority = request.get('byte', 'u');

        // priority 0 = standard (queued?)
        // priority 1 = not logged in
        // priority 2 = mandatory

        onDemandQueue.push({
            cacheIndex, fileNumber, priority, connection,
        });
    }
};

export const onDemandQueue = queue<OnDemandTask>((task, completed) => {
    // @todo handle different file priorities - Kat 22/Oct/22
    const { cacheIndex, fileNumber, priority, connection } = task;
    const cache = getCache(connection.buildNumber);

    // logger.info(`Handling update server task: cache[${cacheIndex}] file[${fileNumber}]
    // priority[${priority}]`);

    const indexFile = cache.indexFiles[cacheIndex];
    const file = getFileData(cache.dataFile, indexFile, fileNumber);
    const totalSize = file.length;
    let roundedSize = totalSize;

    while (roundedSize % 500 !== 0) {
        roundedSize++;
    }

    const blockCount = roundedSize / 500;
    let written = 0;

    for (let block = 0; block < blockCount; block++) {
        let blockSize = totalSize - written;
        if (blockSize > 500) {
            blockSize = 500;
        }

        const packet = new ByteBuffer(6 + blockSize);

        packet.put(cacheIndex - 1);
        packet.put(fileNumber, 'short');
        packet.put(totalSize, 'short');
        packet.put(block);
        packet.putBytes(file, written, written + blockSize);

        written += blockSize;
        connection.socket.write(packet.toNodeBuffer());
    }

    completed();
}, 1000);
