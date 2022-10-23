import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { ByteBuffer, logger } from '@runejs/common';
import { Crc32 } from '@runejs/common/crc32';
import {
    packedCacheFileName,
    readFileCache,
    DataFile,
    IndexFile,
    getFileData
} from '@runejs/cache';
import { getOpenRS2CacheFilesByBuild } from './open-rs2';

export interface FileCache {
    dataFile: DataFile;
    indexFiles: IndexFile[];
}

let cache: FileCache | null = null;
let archives: { [key: string]: ByteBuffer };
let crcTable: ByteBuffer;

const loadArchives = (): { [key: string]: ByteBuffer } => {
    const dataFile = cache.dataFile;
    const indexFile = cache.indexFiles[0];

    archives = {
        'title': getFileData(dataFile, indexFile, 1),
        'config': getFileData(dataFile, indexFile, 2),
        'interface': getFileData(dataFile, indexFile, 3),
        'media': getFileData(dataFile, indexFile, 4),
        'versionlist': getFileData(dataFile, indexFile, 5),
        'textures': getFileData(dataFile, indexFile, 6),
        'wordenc': getFileData(dataFile, indexFile, 7),
        'sounds': getFileData(dataFile, indexFile, 8),
    };

    return archives;
};

export const loadCache = async (buildNumber: number): Promise<FileCache> => {
    const cachePath = join('.', 'cache');
    let packedCacheFiles: { [key: string]: Buffer };

    if (existsSync(cachePath)) {
        const fileNames = readdirSync(cachePath)?.filter(fileName => fileName?.startsWith(packedCacheFileName));
        if (fileNames?.length) {
            packedCacheFiles = {};
            for (const name of fileNames) {
                const data = readFileSync(join(cachePath, name));
                if (data?.length) {
                    packedCacheFiles[name] = data;
                }
            }
        }
    }

    if (!packedCacheFiles || !Object.keys(packedCacheFiles).length) {
        logger.info(`Fetching game file cache...`);
        packedCacheFiles = await getOpenRS2CacheFilesByBuild(buildNumber);
        mkdirSync(cachePath, { recursive: true });
        const fileNames = Object.keys(packedCacheFiles).filter(fileName => fileName?.startsWith(packedCacheFileName));;
        for (const fileName of fileNames) {
            writeFileSync(join(cachePath, fileName), packedCacheFiles[fileName]);
        }
    }

    if (!packedCacheFiles || !Object.keys(packedCacheFiles).length) {
        throw new Error(`Packed cache files not found, please ensure the ./cache directory exists and contains a valid game file cache.`);
    }

    cache = readFileCache(packedCacheFiles);
    loadArchives();
    getCrcTable(buildNumber);
    return cache;
};

export const getCrcTable = (buildNumber: number): ByteBuffer => {
    if (crcTable) {
        return crcTable;
    }

    Crc32.init();
    const checksums: number[] = new Array(9);

    checksums[0] = buildNumber;

    const indexFile = cache.indexFiles[0];

    for (let i = 1; i < checksums.length; i++) {
        const fileData = getFileData(cache.dataFile, indexFile, i);
        checksums[i] = Crc32.update(0, fileData.length, fileData);
    }

    let hash = 1234;

    for (let i = 0; i < checksums.length; i++) {
        hash = (hash << 1) + checksums[i];
    }

    const buffer = new ByteBuffer(4 * (checksums.length + 1));
    for (let i = 0; i < checksums.length; i++) {
        buffer.put(checksums[i], 'int');
    }

    buffer.put(hash, 'int');

    crcTable = buffer;
    return crcTable;
};

export const getCache = (): FileCache => {
    if (!cache) {
        throw new Error(`A file cache is not yet loaded!`);
    }

    return cache;
};

export const getArchives = (): { [key: string]: ByteBuffer } => {
    if (!archives) {
        throw new Error(`Archives not yet loaded!`);
    }

    return archives;
}
