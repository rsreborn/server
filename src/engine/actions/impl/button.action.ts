import { Player } from '@engine/world/player';
import { logger } from '@runejs/common';
import { pluginActions, Action, IPluginAction } from '@engine/actions';

export interface IButtonActionHook {
    widgets?: string | string[];
    buttons: number | number[];
}

export interface IButtonActionData {
    player: Player;
    widget?: string;
    button: number;
}

export type ButtonHandlerFn = (data: IButtonActionData) => void;

export interface IButtonAction extends IButtonActionHook, IPluginAction<ButtonHandlerFn> {
}

/**
 * The @ButtonAction decorator, used to define a specific button action.
 * @param hook
 * @returns 
 */
export const ButtonAction = (hook: IButtonActionHook) => {
    return Action<IButtonActionHook, ButtonHandlerFn>({
        actionType: 'button',
        ...hook
    });
};

export const handleButtonAction = ({
    player, 
    widget, 
    button,
}: IButtonActionData): boolean => {
    const buttonActions = pluginActions.button.filter(buttonAction => {
        const { widgets, buttons } = buttonAction;

        if (widgets && widget) {
            if (Array.isArray(widgets)) {
                if (!widgets.includes(widget)) {
                    return false;
                }
            } else {
                if (widgets !== widget) {
                    return false;
                }
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
        return false;
    }

    for (const action of buttonActions) {
        // @todo action queue system
        action.handler({ 
            player, 
            widget, 
            button,
        });
    }

    return true;
};
