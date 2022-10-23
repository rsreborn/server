import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { packedCacheFileName, readFileCache, DataFile, IndexFile } from '@runejs/cache';
import { getOpenRS2CacheFilesByBuild } from './open-rs2';
import { logger } from '@runejs/common';

export interface FileCache {
    dataFile: DataFile;
    indexFiles: IndexFile[];
}

let cache: FileCache | null = null;

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
    return cache;
};

export const getCache = (): FileCache => {
    if (!cache) {
        throw new Error(`A file cache is not yet loaded!`);
    }

    return cache;
};
