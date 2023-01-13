import plugins from './plugins';

export interface PluginMetadata {
    id: string;
    version?: string;
    dependencies?: string[];
    compatibleBuilds?: number[];
}

export const Plugin = (metadata: PluginMetadata) => {
    return function (constructor: Function) {
        constructor.prototype.metadata = metadata;
        // plugins.push(constructor);
        // console.log(plugins);
        // console.log('@Plugin', constructor.prototype.metadata, Object.keys(constructor));
        // console.log(Object.getOwnPropertyNames(constructor.prototype));
    }
};

export interface IPlugin {
    metadata: PluginMetadata;
}
