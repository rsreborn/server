import { ByteBuffer } from '@runejs/common';
import { Player } from '../../../world/player';
import { chatboxMessagePacket } from '../outbound-packets/encoders/chatbox-message-packet';
import { sendChatboxMessage } from '../packet-handler';
import { InboundPacket } from '../packets';

interface GroundItemClickPacketData {
    itemId: number;
    xCoord: number;
    yCoord: number;
}

export const groundItemClickPacket: InboundPacket<GroundItemClickPacketData> = {
    name: 'ground-item-click',
    handler: (
        player: Player,
        data: GroundItemClickPacketData,
    ): void => {
        sendChatboxMessage(player, `Item Id: ${data.itemId}, X: ${data.xCoord}, Y: ${data.yCoord}`)
    },
    opcodes: {
        254: [ 141, 67, 178, 47, 97 ],
        319: 154,
    },
    decoders: {
        254: (opcode: number, data: ByteBuffer) => {
            const xCoord = data.get('short');
            const yCoord = data.get('short');
            const itemId = data.get('short');

            return { itemId, xCoord, yCoord };
        },
    },
};
