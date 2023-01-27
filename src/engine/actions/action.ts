import { IRunePlugin } from '@engine/plugin';
import { ActionType } from './action-type';
import { pluginActions } from './plugin-actions';

export interface IActionHook<HOOK> {
    actionType: ActionType;
    hooks: HOOK | HOOK[];
}

export interface IPluginAction<HOOK, HANDLER_FN> extends IActionHook<HOOK> {
    plugin: IRunePlugin;
    handler: HANDLER_FN;
}

export const Action = <HOOK, HANDLER_FN>(
    action: IActionHook<HOOK>,
) => {
    return function (
        targetClass: any,
        propertyKey: string | symbol,
        // propertyDescriptor: PropertyDescriptor
    ) {
        const pluginAction: IPluginAction<HOOK, HANDLER_FN> = {
            ...action,
            plugin: targetClass as IRunePlugin,
            handler: targetClass[propertyKey] as HANDLER_FN,
        };

        pluginActions[action.actionType].push(pluginAction as any);
    };
};
