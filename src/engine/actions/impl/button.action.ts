import { Player } from '@engine/world/player';
import { logger } from '@runejs/common';
import { pluginActions, Action, IPluginAction } from '@engine/actions';

export interface IButtonHook {
    widgets?: string | string[];
    buttons: number | number[];
}

export interface IButtonActionData {
    player: Player;
    widget?: string;
    button: number;
}

export type ButtonHandlerFn = (data: IButtonActionData) => void;

export interface IButtonAction extends IPluginAction<IButtonHook, ButtonHandlerFn> {
}

/**
 * The @ButtonAction decorator, used to define a specific button action.
 * @param hook
 * @returns 
 */
export const ButtonAction = (hooks: IButtonHook | IButtonHook[]) => {
    return Action<IButtonHook, ButtonHandlerFn>({
        actionType: 'button',
        hooks
    });
};

export const handleButtonAction = ({
    player, 
    widget, 
    button,
}: IButtonActionData): boolean => {
    const buttonActions = pluginActions.button.filter(buttonAction => {
        const hooks = Array.isArray(buttonAction.hooks) ? buttonAction.hooks : [buttonAction.hooks];

        const validHooks = hooks.filter(hook => {
            const { widgets, buttons } = hook;

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

        return validHooks.length !== 0;
    });

    if (!buttonActions) {
        logger.warn(`No button actions found for ${widget} ${button}.`);
        return false;
    }

    for (const action of buttonActions) {
        // @todo action queue system
        try {
            action.handler({ 
                player, 
                widget, 
                button,
            });
        } catch (e) {
            logger.error(e);
        }
    }

    return true;
};
