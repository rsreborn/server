import { ByteBuffer } from '@runejs/common';
import { OutboundPacket, PacketSize } from '../../packets';

interface UpdatePlayerOptionData {
    optionNumber: number;
    optionText: string;
    shouldDisplayAsTopOfList: boolean;
}

export const updatePlayerOptionPacket: OutboundPacket<UpdatePlayerOptionData> = {
    name: 'updatePlayerOption',
    size: PacketSize.VAR_BYTE,
    opcodes: {
        254: 204,
    },
    encoders: {
        254: (player, opcode, data) => {
            console.log(data.optionText.length);
            const buffer = new ByteBuffer(data.optionText.length + 3);
            buffer.put(data.optionNumber);
            buffer.put((Number(data.shouldDisplayAsTopOfList)));
            buffer.putString(data.optionText, 10);
            return buffer;
        }
    },
};
