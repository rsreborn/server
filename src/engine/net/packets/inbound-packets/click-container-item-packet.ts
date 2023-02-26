import { ByteBuffer } from '@runejs/common';
import { Player } from '../../../world/player';
import { sendChatboxMessage } from '../packet-handler';
import { InboundPacket } from '../packets';

interface ContainerItemClickPacketData {
    interfaceId: number;
    itemId: number;
    slotIndex: number;
}

export const containerItemClickPacket: InboundPacket<ContainerItemClickPacketData> = {
    name: 'container-item-click',
    handler: (
        player: Player,
        data: ContainerItemClickPacketData,
    ): void => {
        sendChatboxMessage(player, `Item Id: ${data.itemId}, Interface Id: ${data.interfaceId}, Slot Id: ${data.slotIndex}`)
    },
    opcodes: {
        254: [ 243, 228, 80, 163, 74 ],
        319: 154,
    },
    decoders: {
        254: (opcode: number, data: ByteBuffer) => {
            const itemId = data.get('short');
            const slotIndex = data.get('short');
            const interfaceId = data.get('short');

            return { interfaceId, itemId, slotIndex };
        },
    },
};
