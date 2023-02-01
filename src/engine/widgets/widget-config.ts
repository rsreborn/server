import { requireConfigFiles } from '@engine/util/fs';
import { ClientEngineType } from '@engine';

export interface IWidgetConfigData {
    old_engine_id: number;
    new_engine_id: number;
}

export interface IWidgetConfigFile { 
    [prefix: string]: { 
        [widgetKey: string]: IWidgetConfigData;
    };
}

export class WidgetConfig {

    private configs: IWidgetConfigFile;

    async load(): Promise<void> {
        this.configs = await requireConfigFiles({
            dirName: 'widgets',
        });
    }

    getName(widgetId: number, clientEngine: ClientEngineType, prefix: string = 'rs'): string {
        const widgetConfigs = this.configs[prefix];
        const entries = Object.entries(widgetConfigs);
        const name = entries.find(e => e[1][`${clientEngine}_engine_id`] === widgetId)?.[0] ?? null;
        if (!name) {
            throw new Error(`Widget ${widgetId} not found in the ${clientEngine} engine with prefix ${prefix}.`);
        }

        return `${prefix}:${name}`;
    }

    getId(widget: string, clientEngine: ClientEngineType): number {
        const widgetConfig = this.get(widget);
        return widgetConfig[`${clientEngine}_engine_id`];
    }

    get(widget: string): IWidgetConfigData {
        if (!widget.includes(':')) {
            throw new Error(
                `Widget prefix not provided to widgets.get(). Did you mean rs:${widget}?`
            );
        }

        const [ prefix, key ] = widget.split(':');

        if (!this.configs[prefix]) {
            throw new Error(`No widgets found with prefix ${prefix}.`);
        }

        const widgetConfig = this.configs[prefix][key];

        if (!widget) {
            throw new Error(`Widget ${widget} was not found.`);
        }

        return widgetConfig;
    }

}

const widgets = new WidgetConfig();

export default widgets;
