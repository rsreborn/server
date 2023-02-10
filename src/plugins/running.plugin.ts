import { logger } from '@runejs/common';
import { RunePlugin } from '@engine/plugin';
import { ButtonAction, IButtonActionData } from '@engine/actions';
import { sendLogout } from '@engine/net/packets';

@RunePlugin({
    id: 'rs:running',
    version: '1.0.0',
    // dependencies: [
    //     'rs:cooking_skill'
    // ],
    // compatibleBuilds: [
    //     289, 319, 357, 414
    // ]
})
export default class MovementControlsPlugin {

    @ButtonAction([
        { buttons: [152, 153] },
        { widgets: 'rs:options', buttons: 8 }
    ])
    movementControlsClicked(action: IButtonActionData) {
        switch (action.button) {
            case 152:
                action.player.running = false;
                break;
            case 153:
                action.player.running = true;
                break;
        }
    }
}
