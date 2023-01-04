export interface ActionHookMetadata {
}

export function ActionHook(metadata: ActionHookMetadata) {
    return function (
        target: any,
        key: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        target.metadata = metadata;
        console.log(target);
    };
}

export interface PluginMetadata {
    id: string;
    version?: string;
    dependencies?: string[];
    compatibleBuilds?: number[];
}

export function Plugin(metadata: PluginMetadata) {
    return function (constructor: Function) {
        constructor.prototype.metadata = metadata;
    }
}
