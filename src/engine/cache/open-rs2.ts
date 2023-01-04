import axios from 'axios';
import AdmZip from 'adm-zip';
import { Buffer } from 'buffer';
import { logger } from '@runejs/common';

export interface OpenRS2BuildNumber {
    major: number;
    minor: number | null;
}

export interface OpenRS2Cache {
    id: number;
    scope: 'runescape' | string;
    game: 'runescape' | 'darkscape' | string;
    environment: 'live' | 'beta' | string;
    language: 'en' | 'de' | 'fr' | 'pt' | string;
    builds: OpenRS2BuildNumber[];
    timestamp: Date; // ISO 8601 format
    sources: string[];
    valid_indexes: number | null;
    indexes: number | null;
    valid_groups: number | null;
    groups: number | null;
    valid_keys: number | null;
    keys: number | null;
    size: number | null;
    blocks: number | null;
    disk_store_valid: boolean | null;
}

const openRS2Endpoint = 'https://archive.openrs2.org';

const getOpenRS2CacheList = async (): Promise<OpenRS2Cache[]> => {
    const response = await axios.get<OpenRS2Cache[]>(
        `${ openRS2Endpoint }/caches.json`
    );
    return response.data;
};

const getOpenRS2CacheFilesById = async (
    id: number,
    scope: string = 'runescape'
): Promise<{ [fileName: string]: Buffer }> => {
    const response = await axios.get(
        `${ openRS2Endpoint }/caches/${ scope }/${ id }/disk.zip`,
        { responseType: 'arraybuffer' }
    );

    if (!response?.data) {
        return {};
    }

    const zipEntries = new AdmZip(Buffer.from(response.data, 'binary')).getEntries();
    const files: { [fileName: string]: Buffer } = {};

    for (const entry of zipEntries) {
        files[entry.name] = entry.getData();
    }

    return files;
};


export const getOpenRS2CacheFilesByBuild = async (
    build: number
): Promise<{ [fileName: string]: Buffer }> => {
    logger.info(`Searching OpenRS2 for build ${ build }...`);

    const cacheList = (await getOpenRS2CacheList())
        ?.filter(c => c.scope === 'runescape' && c.game === 'runescape') || [];

    const desiredCacheInfo = cacheList.find(cacheDetails => {
        for (const b of cacheDetails.builds) {
            if (b.major === build) {
                return true;
            }
        }

        return false;
    });

    if (desiredCacheInfo) {
        logger.info(`Build ${ build } was found within the OpenRS2 archive, fetching data...`);

        return await getOpenRS2CacheFilesById(desiredCacheInfo.id);
    } else {
        logger.error(`Build ${ build } was not found within the OpenRS2.org archive.`);
    }

    return {};
};
