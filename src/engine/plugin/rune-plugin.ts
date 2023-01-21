import plugins from './plugins';

export interface RunePluginMetadata {
    id: string;
    version?: string;
    dependencies?: string[];
    compatibleBuilds?: number[];
}

export const RunePlugin = (metadata: RunePluginMetadata) => {
    return function (constructor: Function) {
        constructor.prototype.metadata = metadata;
        // plugins.push(constructor);
        // console.log(plugins);
        // console.log('@Plugin', constructor.prototype.metadata, Object.keys(constructor));
        // console.log(Object.getOwnPropertyNames(constructor.prototype));
    }
};

export interface IRunePlugin {
    metadata: RunePluginMetadata;
}
