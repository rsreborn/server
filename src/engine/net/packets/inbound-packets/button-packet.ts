import { handleButtonAction } from '@engine/actions';
import widgets from '@engine/widgets';
import { ByteBuffer, logger } from '@runejs/common';
import { Player } from '../../../world/player';
import { sendChatboxMessage, sendLogout } from '../packet-handler';
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
        try {
            sendChatboxMessage(player, `Button Id: ${data.widgetId ?? ''} ${data.buttonId}`);
            const widget = !!data.widgetId ? widgets.getName(data.widgetId, (player?.client?.connection?.buildNumber ?? 0) < 400 ? 'old' : 'new') : undefined;
            if (!handleButtonAction({ player, widget, button: data.buttonId })) { }
        } catch (e) {
            logger.error(e);
        }
    },
    opcodes: {
        254: 244,
        289: 86,
        319: 189,
        357: 211,
        414: 189,
    },
    decoders: {
        254: (opcode: number, data: ByteBuffer) => {
            const buttonId = data.get('short', 'u');
            return { buttonId };
        },
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
        },
        414: (opcode: number, data: ByteBuffer) => {
            const widgetId = data.get('short');
            const buttonId = data.get('short');
            return { widgetId, buttonId };
        },
    },
};
