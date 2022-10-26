import { Player } from '../../../world/player';
import { InboundPacketHandler } from '../packets';

const handler: InboundPacketHandler = (
    player: Player,
    data: {
        widgetId: number;
    },
): void => {
    console.log(`button packet handler ${data.widgetId}`);
};

export default {
    name: 'button',
    handler,
};
