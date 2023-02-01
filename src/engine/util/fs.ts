import { join } from 'path';
import { logger } from '@runejs/common';
import { FileFilter, getFiles } from '@runejs/common/fs';
import merge from 'ts-deepmerge';

export interface RequireFilesOptions {
    /**
     * The directory to require files from.
     */
    dir: string;

    /**
     * An optional file filter (whitelist or blacklist) 
     * used to determine which files to require.
     */
    filter?: FileFilter;

    /**
     * An optional string (usually a file extension) to 
     * remove from the main Node `require` statement.
     */
    removeFromPath?: string;
}

export async function* requireFiles<FILE_TYPE = any>({
    dir,
    filter,
    removeFromPath,
}: RequireFilesOptions): AsyncGenerator<FILE_TYPE> {
    for await (const path of getFiles(dir, filter)) {
        let filePath = path.substring(dir.length);
        if (removeFromPath) {
            filePath = filePath.replace(removeFromPath, '');
        }

        const fileRequirePath = join('..', dir, filePath);

        try {
            const fileData = require.main.require(fileRequirePath);
            yield fileData;
        } catch (error) {
            logger.error(`Error loading file at ${fileRequirePath}:`);
            logger.error(error);
        }
    }
}

export interface RequireConfigFilesOptions {
    /**
     * The name of the config file directory within `./data/config/`
     */
    dirName: string;

    /**
     * The file extension of the config files being required.
     * Defaults to `.json` if not provided.
     */
    configFileExtension?: string;
}

export async function requireConfigFiles<FILE_TYPE = any>({
    dirName,
    configFileExtension,
}: RequireConfigFilesOptions): Promise<FILE_TYPE> {
    if (!configFileExtension) {
        configFileExtension = 'json';
    }

    const dir = join('.', 'data', 'config', dirName);
    const filter: FileFilter = { type: 'whitelist', list: [`.${configFileExtension}`] };

    let configMap = {};

    for await(const fileData of requireFiles<FILE_TYPE>({ dir, filter })) {
        configMap = merge(configMap, fileData);
    }

    return configMap as FILE_TYPE;
}
