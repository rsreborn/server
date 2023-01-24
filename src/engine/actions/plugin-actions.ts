import { ActionType } from './action-type';
import { IButtonPluginAction } from './impl';

type PluginActionMapType = { [key in ActionType]: unknown };

interface IPluginActionMap extends PluginActionMapType {
    button: IButtonPluginAction[];
}

export const pluginActions: IPluginActionMap = {
    button: [],
};
