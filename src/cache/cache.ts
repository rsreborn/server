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

export interface Archive {
    archiveNumber: number;
    checksum: number;
    data: ByteBuffer;
}

Crc32.init();
const caches: Map<number, FileCache> = new Map<number, FileCache>();
const archives: Map<number, { [key: string]: Archive }> = new Map<number, {[p: string]: Archive}>();
const crcTables: Map<number, ByteBuffer> = new Map<number, ByteBuffer>();

const readArchive = (
    cache: FileCache,
    archiveNumber: number,
): Archive => {
    const dataFile = cache.dataFile;
    const indexFile = cache.indexFiles[0];
    const data = getFileData(dataFile, indexFile, archiveNumber);
    const checksum = Crc32.update(0, data.length, data);
    return { archiveNumber, checksum, data };
};

export const archiveNames = [
    'title',
    'config',
    'interface',
    'media',
    'versionlist',
    'textures',
    'wordenc',
    'sounds',
];

const loadArchives = (): void => {
    for (const [ build, cache ] of caches) {
        archives.set(build, {
            'title': readArchive(cache, 1),
            'config': readArchive(cache, 2),
            'interface': readArchive(cache, 3),
            'media': readArchive(cache, 4),
            'versionlist': readArchive(cache, 5),
            'textures': readArchive(cache, 6),
            'wordenc': readArchive(cache, 7),
            'sounds': readArchive(cache, 8),
        });
    }
};

export const findArchive = (
    archiveName: string,
    checksum: number,
): Archive | null => {
    for (const [ , archiveMap ] of archives) {
        if (archiveMap[archiveName].checksum === checksum) {
            return archiveMap[archiveName];
        }
    }

    return null;
};

export const loadCaches = async (buildNumbers: number[]): Promise<void> => {
    for (const build of buildNumbers) {
        await loadCache(build);
    }
};

export const loadCache = async (buildNumber: number): Promise<FileCache> => {
    const cachePath = join('.', 'cache', String(buildNumber));
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
        logger.info(`Fetching game file cache for build ${buildNumber}...`);
        packedCacheFiles = await getOpenRS2CacheFilesByBuild(buildNumber);
        mkdirSync(cachePath, { recursive: true });
        const fileNames = Object.keys(packedCacheFiles).filter(fileName => fileName?.startsWith(packedCacheFileName));;
        for (const fileName of fileNames) {
            writeFileSync(join(cachePath, fileName), packedCacheFiles[fileName]);
        }
    }

    if (!packedCacheFiles || !Object.keys(packedCacheFiles).length) {
        throw new Error(`Packed cache files for build ${buildNumber} not found, please ensure the ./cache directory exists and contains a valid game file cache.`);
    }

    caches.set(buildNumber, readFileCache(packedCacheFiles));
    loadArchives();
    getCrcTable(buildNumber);
    return caches.get(buildNumber);
};

export const getCrcTable = (buildNumber: number): ByteBuffer => {
    if (crcTables.has(buildNumber)) {
        return crcTables.get(buildNumber);
    }

    const checksums: number[] = new Array(9);

    checksums[0] = buildNumber;

    const archiveMap = archives.get(buildNumber);
    const archiveList = Object.values(archiveMap);

    for (let i = 1; i < checksums.length; i++) {
        const archive = archiveList.find(a => a.archiveNumber === i);
        checksums[i] = archive.checksum;
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

    crcTables.set(buildNumber, buffer);
    return crcTables.get(buildNumber);
};

export const getCache = (buildNumber: number): FileCache => {
    if (!caches.has(buildNumber)) {
        throw new Error(`File cache ${buildNumber} is not yet loaded!`);
    }

    return caches.get(buildNumber);
};

export const getArchives = (buildNumber: number): { [key: string]: Archive } => {
    if (!archives.has(buildNumber)) {
        throw new Error(`Archives for cache ${buildNumber} are not yet loaded!`);
    }

    return archives.get(buildNumber);
}
