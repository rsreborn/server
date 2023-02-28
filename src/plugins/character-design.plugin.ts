import { logger } from '@runejs/common';
import { RunePlugin } from '@engine/plugin';
import { ButtonAction, IButtonActionData } from '@engine/actions';
import { sendChatboxMessage, sendCloseWidgets, sendLogout } from '@engine/net/packets';
import { Player } from '@engine/world/player';

@RunePlugin({
    id: 'rs:character-design',
    version: '1.0.0',
    // dependencies: [
    //     'rs:cooking_skill'
    // ],
    // compatibleBuilds: [
    //     289, 319, 357, 414
    // ]
})
export default class CharacterDesignPlugin {

    @ButtonAction([
        { buttons: [ 3651 ] },
        { widgets: 'rs:options', buttons: 8 }
    ])
   characterDesignAccepted(action: IButtonActionData) {
        switch (action.button) {
            case 3651:
                sendCloseWidgets(action.player);
                break;
        }
    }
}
