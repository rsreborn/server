import { ByteBuffer } from '@runejs/common';
import { OutboundPacket, PacketSize } from '../../packets';

interface ChatboxMessageData {
    message: string;
}

export const chatboxMessagePacket: OutboundPacket<ChatboxMessageData> = {
    name: 'chatboxMessage',
    size: PacketSize.VAR_BYTE,
    opcodes: {
        289: 196,
        319: 50,
        357: 31,
        414: 75,
    },
    encoders: {
        289: (player, opcode, data) => {
            const buffer = new ByteBuffer(data.message.length + 1);
            buffer.putString(data.message, 10);
            return buffer;
        },
        319: (player, opcode, data) => {
            const buffer = new ByteBuffer(data.message.length + 1);
            buffer.putString(data.message, 10);
            return buffer;
        },
        357: (player, opcode, data) => {
            const buffer = new ByteBuffer(data.message.length + 1);
            buffer.putString(data.message, 10);
            return buffer;
        },
        414: (player, opcode, data) => {
            const buffer = new ByteBuffer(data.message.length + 1);
            buffer.putString(data.message);
            return buffer;
        }
    },
};
