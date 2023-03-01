import { ByteBuffer } from '@runejs/common';
import { Player } from '../../../world/player';
import { chatboxMessagePacket } from '../outbound-packets/encoders/chatbox-message-packet';
import { sendChatboxMessage } from '../packet-handler';
import { InboundPacket } from '../packets';

interface MagicOnObjectPacketData {
    spellId: number;
    objectId: number;
    objectX: number;
    objectY: number;
}

export const useMagicOnObjectPacket: InboundPacket<MagicOnObjectPacketData> = {
    name: 'magic-on-object',
    handler: (
        player: Player,
        data: MagicOnObjectPacketData,
    ): void => {
        sendChatboxMessage(player, 
            `Used Spell ${data.spellId} on object id ${data.objectId} at ${data.objectX}, ${data.objectY}`);
    },
    opcodes: {
        254: 26,
    },
    decoders: {
        254: (opcode: number, data: ByteBuffer) => {
            const objectX = data.get('short');
            const objectY = data.get('short');
            const objectId = data.get('short');
            const spellId = data.get('short');

            return { objectId, spellId, objectX, objectY };
        },
    },
};
