import { Player } from '@engine/world/player';
import { logger } from '@runejs/common';
import { Action, IPluginAction } from '../action';

export interface IButtonHook {
    interfaces: string | string[] | number | number[];
    buttonIds: number | number[];
}

export interface IButtonActionData {
    player: Player;
}

export type ButtonHookFn = (data: IButtonActionData) => void;

export type ButtonActionHandlerFn = (
    hookFn: ButtonHookFn,
    player: Player,
) => void;

export interface IButtonPluginAction extends IPluginAction<ButtonActionHandlerFn, ButtonHookFn> {
}

export const ButtonAction = (hook: IButtonHook) => {
    return Action<IButtonHook, ButtonActionHandlerFn, ButtonHookFn>({
        actionType: 'button',
        handler: buttonActionHandler,
        ...hook
    });
};

export const buttonActionHandler: ButtonActionHandlerFn = (
    hookFn: ButtonHookFn,
    player: Player,
) => {
    // Handles the heavy lifting before feeding info off into the hook function 
    logger.info('I clicked a button!');
    hookFn({ player });
};
