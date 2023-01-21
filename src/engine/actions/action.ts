import { IRunePlugin } from '@engine/plugin';
import { ActionType } from './action-type';
import pluginActions from './plugin-actions';

export interface IActionHook<HANDLER> {
    actionType: ActionType;
    handler: HANDLER;
}

export interface IPluginAction<HANDLER, HOOK_FN> extends IActionHook<HANDLER> {
    plugin: IRunePlugin;
    hook: HOOK_FN;
}

export const Action = <HOOK_ARGS, ACTION_HANDLER, HOOK_FN>(
    action: IActionHook<ACTION_HANDLER> & HOOK_ARGS,
) => {
    return function (
        targetClass: any,
        propertyKey: string | symbol,
        propertyDescriptor: PropertyDescriptor
    ) {
        const pluginAction: IPluginAction<ACTION_HANDLER, HOOK_FN> = {
            ...action,
            plugin: targetClass as IRunePlugin,
            hook: targetClass[propertyKey] as HOOK_FN,
        };

        pluginActions[action.actionType].push(pluginAction as any);
    };
};
