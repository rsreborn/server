import { handleButtonAction } from '@engine/actions';
import widgets from '@engine/widgets';
import { ByteBuffer } from '@runejs/common';
import { Player } from '../../../world/player';
import { sendLogout } from '../packet-handler';
import { InboundPacket } from '../packets';

interface ButtonPacketData {
    widgetId?: number;
    buttonId: number;
}

export const buttonPacket: InboundPacket<ButtonPacketData> = {
    name: 'button',
    handler: (
        player: Player,
        data: ButtonPacketData,
    ): void => {
        console.log(`button packet handler ${data.widgetId}`);
        const widget = !!data.widgetId ? widgets.getName(data.widgetId, (player?.client?.connection?.buildNumber ?? 0) < 400 ? 'old' : 'new') : undefined;
        if (!handleButtonAction({ player, widget, button: data.buttonId })) {
            // Todo Don't actually use a switch in here. Just wanted to enable logout. - Brian 10-26-22
            switch(data.widgetId) {
                // case 2458:
                //     sendLogout(player);
                //     break;
                case 153:
                    player.running = true;
                    break;
                case 152:
                    player.running = false;
                    break;
            }
        }
    },
    opcodes: {
        289: 86,
        319: 189,
        357: 211,
    },
    decoders: {
        289: (opcode: number, data: ByteBuffer) => {
            const buttonId = data.get('short', 'u');
            return { buttonId };
        },
        319: (opcode: number, data: ByteBuffer) => {
            const buttonId = data.get('short', 'u');
            return { buttonId };
        },
        357: (opcode: number, data: ByteBuffer) => {
            const buttonId = data.get('short', 'u');
            return { buttonId };
        }
    },
};
