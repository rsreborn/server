import { ByteBuffer } from '@runejs/common';
import { OutboundPacket, PacketSize } from '../packets';

interface ChatboxMessageData {
    message: string;
}

export const chatboxMessagePacket: OutboundPacket<ChatboxMessageData> = {
    name: 'chatboxMessage',
    size: PacketSize.VAR_BYTE,
    opcodes: {
        319: 50
    },
    encoders: {
        319: (player, opcode, data) => {
            const buffer = new ByteBuffer(data.message.length + 1);
            buffer.putString(data.message, 10);
            return buffer;
        }
    },
};
