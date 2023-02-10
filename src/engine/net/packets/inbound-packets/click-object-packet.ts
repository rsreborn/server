import { ByteBuffer } from '@runejs/common';
import { Player } from '../../../world/player';
import { chatboxMessagePacket } from '../outbound-packets/encoders/chatbox-message-packet';
import { sendChatboxMessage } from '../packet-handler';
import { InboundPacket } from '../packets';

interface ObjectClickPacketData {
    objectId: number;
    xCoord: number;
    yCoord: number;
}

export const objectClickPacket: InboundPacket<ObjectClickPacketData> = {
    name: 'object-click',
    handler: (
        player: Player,
        data: ObjectClickPacketData,
    ): void => {
       
        sendChatboxMessage(player, `${data.objectId}, ${data.xCoord}, ${data.yCoord}`)
    },
    opcodes: {
        319: 154,
    },
    decoders: {
        319: (opcode: number, data: ByteBuffer) => {
            const objectId = data.get('short', 'u', 'le');
            const yCoord = data.get('short', 'u', 'le');
            const xCoord = data.get('short', 'u', 'le');
            return { objectId, xCoord, yCoord };
        },
    },
};
