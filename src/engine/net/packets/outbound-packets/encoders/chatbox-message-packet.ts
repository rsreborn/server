import { Packet, PacketType } from '../../packet';
import { OutboundPacket } from '../../packets';

interface ChatboxMessageData {
    message: string;
}

export const chatboxMessagePacket: OutboundPacket<ChatboxMessageData> = {
    name: 'chatboxMessage',
    type: PacketType.VAR_BYTE,
    opcodes: {
        254: 73,
        289: 196,
        319: 50,
        357: 31,
        414: 75,
    },
    encoders: {
        
        254: (player, opcode, data) => {
            const packet = new Packet(opcode, PacketType.VAR_BYTE);
            packet.putString(data.message, 10);
            return packet;
        },
        289: (player, opcode, data) => {
            const packet = new Packet(opcode, PacketType.VAR_BYTE);
            packet.putString(data.message, 10);
            return packet;
        },
        319: (player, opcode, data) => {
            const packet = new Packet(opcode, PacketType.VAR_BYTE);
            packet.putString(data.message, 10);
            return packet;
        },
        357: (player, opcode, data) => {
            const buffer = new Packet(data.message.length + 1);
            buffer.putString(data.message, 10);
            return buffer;
        },
        414: (player, opcode, data) => {
            const buffer = new Packet(data.message.length + 1);
            buffer.putString(data.message);
            return buffer;
        }
    },
};
