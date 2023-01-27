import { logger } from '@runejs/common';
import { RunePlugin } from '@engine/plugin';
import { ButtonAction, IButtonActionData } from '@engine/actions';
import { sendLogout } from '@engine/net/packets';

@RunePlugin({
    id: 'rs:logout',
    version: '1.0.0',
    // dependencies: [
    //     'rs:cooking_skill'
    // ],
    // compatibleBuilds: [
    //     289, 319, 357, 414
    // ]
})
export default class LogoutPlugin {

    @ButtonAction({
        buttons: 2458,
    })
    logoutButtonClicked(action: IButtonActionData) {
        logger.info('logout hook called', action);
        sendLogout(action.player);
    }

}
