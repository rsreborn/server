import { IRunePlugin } from '@engine/plugin';
import { ActionType } from './action-type';
import { pluginActions } from './plugin-actions';

export interface IActionHook {
    actionType: ActionType;
}

export interface IPluginAction<HANDLER_FN> extends IActionHook {
    plugin: IRunePlugin;
    handler: HANDLER_FN;
}

export const Action = <HOOK_ARGS, HANDLER_FN>(
    action: IActionHook & HOOK_ARGS,
) => {
    return function (
        targetClass: any,
        propertyKey: string | symbol,
        // propertyDescriptor: PropertyDescriptor
    ) {
        const pluginAction: IPluginAction<HANDLER_FN> = {
            ...action,
            plugin: targetClass as IRunePlugin,
            handler: targetClass[propertyKey] as HANDLER_FN,
        };

        pluginActions[action.actionType].push(pluginAction as any);
    };
};
