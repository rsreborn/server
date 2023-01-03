import { ByteBuffer } from '@runejs/common';
import { OutboundPacket } from '@net/packets/packets';

interface FriendsListData {
    friendListStatus: number;
}

export const friendsListPacket: OutboundPacket<FriendsListData> = {
    name: 'friendsList',
    opcodes: {
        289: 235,
        319: 78,
        357: 152,
    },
    encoders: {
        289: (player, opcode, data) => {
            const buffer = new ByteBuffer(1);
            buffer.put(data.friendListStatus, 'byte');
            return buffer;
        },
        319: (player, opcode, data) => {
            const buffer = new ByteBuffer(1);
            buffer.put(data.friendListStatus, 'byte');
            return buffer;
        },
        357: (player, opcode, data) => {
            const buffer = new ByteBuffer(1);
            buffer.put(data.friendListStatus, 'byte');
            return buffer;
        }
    },
};
