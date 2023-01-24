import { Player } from '@engine/world/player';
import { logger } from '@runejs/common';
import { pluginActions, Action, IPluginAction } from '@engine/actions';

export interface IButtonHook {
    widgets: string | string[];
    buttons: number | number[];
}

export interface IButtonActionData {
    player: Player;
}

export type ButtonHookFn = (data: IButtonActionData) => void;

export type ButtonActionHandlerFn = (
    hookFn: ButtonHookFn,
    player: Player,
) => void;

export interface IButtonPluginAction extends IButtonHook, IPluginAction<ButtonActionHandlerFn, ButtonHookFn> {
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
    hookFn({ player });
};

export const handleButtonAction = (
    player: Player, 
    widget: string, 
    button: number,
) => {
    const buttonActions = pluginActions.button.filter(buttonAction => {
        const { widgets, buttons } = buttonAction;

        if (Array.isArray(widgets)) {
            if (!widgets.includes(widget)) {
                return false;
            }
        } else {
            if (widgets !== widget) {
                return false;
            }
        }

        if (Array.isArray(buttons)) {
            if (!buttons.includes(button)) {
                return false;
            }
        } else {
            if (buttons !== button) {
                return false;
            }
        }

        return true;
    });

    if (!buttonActions) {
        logger.warn(`No button actions found for ${widget} ${button}.`);
        return;
    }

    for (const action of buttonActions) {
        // @todo action queue system
        const { hook, handler } = action;
        handler(hook, player);
    }
};
