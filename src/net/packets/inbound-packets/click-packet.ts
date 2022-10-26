import { Player } from '../../../world/player';
import { InboundPacketHandler } from '../packets';

const handler: InboundPacketHandler = (
    player: Player,
    data: {
        hash: number;
    },
): void => {
    console.log(`click packet handler ${data.hash}`);
};

export default {
    name: 'click',
    handler,
};
