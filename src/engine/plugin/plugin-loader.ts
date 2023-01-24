import { join } from 'path';
import { logger } from '@runejs/common';
import { getFiles } from '@runejs/common/fs';
import { plugins } from './plugins';

export class PluginLoader {

    constructor() {
    }

    clearPlugins(): void {
        plugins.splice(0);
    }

    registerPlugin(constructor: Function): void {
        plugins.push(constructor);
    }

    async loadPlugins(): Promise<void> {
        const pluginDir = join('.', 'dist', 'plugins');
        const relativeDir = join('..', '..', 'plugins');
    
        for await (const path of getFiles(pluginDir, { type: 'whitelist', list: ['.plugin.js', 'index.js'] })) {
            const location = join(relativeDir, path.substring(pluginDir.length).replace('.js', ''));
    
            try {
                let plugin = require(location);
                if (!plugin) {
                    continue;
                }
    
                if (plugin.default) {
                    plugin = plugin.default;
                }

                this.registerPlugin(plugin);
            } catch (error) {
                logger.error(`Error loading plugin file at ${location}:`);
                logger.error(error);
            }
        }
    }

}
