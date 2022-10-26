import { Player } from '../../../world/player';
import { InboundPacketHandler, sendLogout } from '../packets';

const handler: InboundPacketHandler = (
    player: Player,
    data: {
        widgetId: number;
    },
): void => {
    // Todo Don't actually use a switch in here. Just wanted to enable logout. - Brian 10-26-22
    switch(data.widgetId) {
        case 2458:
            sendLogout(player);
            break;
    }
    console.log(`button packet handler ${data.widgetId}`);
};

export default {
    name: 'button',
    handler,
};
