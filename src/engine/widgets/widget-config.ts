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
