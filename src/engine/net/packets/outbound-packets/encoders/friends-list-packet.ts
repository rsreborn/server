import { ByteBuffer } from '@runejs/common';
import { Packet } from '../../packet';
import { OutboundPacket } from '../../packets';

interface FriendsListData {
    friendListStatus: number;
}

export const friendsListPacket: OutboundPacket<FriendsListData> = {
    name: 'friendsList',
    opcodes: {
        254: 255,
        289: 235,
        319: 78,
        357: 152,
    },
    encoders: {
        254: (player, opcode, data) => {
            const packet = new Packet(255);
            packet.put(data.friendListStatus, 'byte');
            return packet;
        },
        // 289: (player, opcode, data) => {
        //     const buffer = new ByteBuffer(1);
        //     buffer.put(data.friendListStatus, 'byte');
        //     return buffer;
        // },
        // 319: (player, opcode, data) => {
        //     const buffer = new ByteBuffer(1);
        //     buffer.put(data.friendListStatus, 'byte');
        //     return buffer;
        // },
        // 357: (player, opcode, data) => {
        //     const buffer = new ByteBuffer(1);
        //     buffer.put(data.friendListStatus, 'byte');
        //     return buffer;
        // }
    },
};
