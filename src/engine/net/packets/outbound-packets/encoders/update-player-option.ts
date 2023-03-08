import { ByteBuffer } from '@runejs/common';
import { Packet, PacketType } from '../../packet';
import { OutboundPacket } from '../../packets';

interface UpdatePlayerOptionData {
    optionNumber: number;
    optionText: string;
    shouldDisplayAsTopOfList: boolean;
}

export const updatePlayerOptionPacket: OutboundPacket<UpdatePlayerOptionData> = {
    name: 'updatePlayerOption',
    opcodes: {
        254: 204,
    },
    encoders: {
        254: (player, opcode, data) => {
            console.log(data.optionText.length);
            const packet = new Packet(204, PacketType.VAR_BYTE);
            packet.put(data.optionNumber);
            packet.put((Number(data.shouldDisplayAsTopOfList)));
            packet.putString(data.optionText, 10);
            return packet;
        }
    },
};
