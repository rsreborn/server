import { ActionType } from './action-type';
import { IButtonAction } from './impl';

type PluginActionMapType = { [key in ActionType]: unknown };

interface IPluginActionMap extends PluginActionMapType {
    button: IButtonAction[];
}

export const pluginActions: IPluginActionMap = {
    button: [],
};
