import { ByteBuffer } from '@runejs/common';
import { Player } from '../../../world/player';
import { chatboxMessagePacket } from '../outbound-packets/encoders/chatbox-message-packet';
import { sendChatboxMessage } from '../packet-handler';
import { InboundPacket } from '../packets';

interface MoveContainerItemPacketData {
    fromSlotIndex: number;
    toSlotIndex: number;
    inventoryId: number;
    mode: number;
}

export const moveContainerItemPacket: InboundPacket<MoveContainerItemPacketData> = {
    name: 'move-container-item',
    handler: (
        player: Player,
        data: MoveContainerItemPacketData,
    ): void => {
        sendChatboxMessage(player, `Interface: ${data.inventoryId} Slot: ${data.fromSlotIndex} to ${data.toSlotIndex} Mode: ${data.mode}`)
    },
    opcodes: {
        254: 176,
    },
    decoders: {
        254: (opcode: number, data: ByteBuffer) => {
            const inventoryId = data.get('short');
            const fromSlotIndex = data.get('short');
            const toSlotIndex = data.get('short');
            const mode = data.get('byte');

            return { fromSlotIndex, toSlotIndex, inventoryId, mode };
        },
    },
};
