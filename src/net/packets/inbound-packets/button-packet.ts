import { ByteBuffer } from '@runejs/common';
import { Player } from '../../../world/player';
import { sendLogout } from '../packet-handler';
import { InboundPacket } from '@net/packets/packets';

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
            case 153:
                player.running = true;
                break;
            case 152:
                player.running = false;
                break;
        }
        console.log(`button packet handler ${data.widgetId}`);
    },
    opcodes: {
        289: 86,
        319: 189,
        357: 211,
    },
    decoders: {
        289: (opcode: number, data: ByteBuffer) => {
            const widgetId = data.get('short', 'u');
            return { widgetId };
        },
        319: (opcode: number, data: ByteBuffer) => {
            const widgetId = data.get('short', 'u');
            return { widgetId };
        },
        357: (opcode: number, data: ByteBuffer) => {
            const widgetId = data.get('short', 'u');
            return { widgetId };
        }
    },
};
