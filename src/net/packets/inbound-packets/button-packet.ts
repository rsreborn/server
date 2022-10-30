import { ByteBuffer } from '@runejs/common';
import { Player } from '../../../world/player';
import { sendLogout, InboundPacket } from '../packets';

interface ButtonPacketData {
    widgetId: number;
}

export const buttonPacket: InboundPacket<ButtonPacketData> = {
    name: 'button',
    handler: (
        player: Player,
        data: ButtonPacketData,
    ): void => {
        // Todo Don't actually use a switch in here. Just wanted to enable logout. - Brian 10-26-22
        switch(data.widgetId) {
            case 2458:
                sendLogout(player);
                break;
        }
        console.log(`button packet handler ${data.widgetId}`);
    },
    opcodes: {
        319: 189
    },
    decoders: {
        319: (opcode: number, data: ByteBuffer) => {
            const widgetId = data.get('short', 'u');
            return { widgetId };
        }
    },
};
