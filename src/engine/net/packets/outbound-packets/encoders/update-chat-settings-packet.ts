import { ByteBuffer } from '@runejs/common';
import { Packet } from '../../packet';
import { OutboundPacket } from '../../packets';

interface UpdateChatSettingsData {
    publicChatValue: ChatSettings;
    privateChatValue: ChatSettings;
    tradeChatValue: ChatSettings;
}

export enum ChatSettings {
    ON = 0,
    FRIENDS = 1,
    OFF = 2
}

export const updateChatSettingsPacket: OutboundPacket<UpdateChatSettingsData> = {
    name: 'updateChatSettings',
    opcodes: {
        254: 24,
    },
    encoders: {
        254: (player, opcode, data) => {
            const packet = new Packet(24);
            packet.put(data.publicChatValue, 'byte');
            packet.put(data.privateChatValue, 'byte');
            packet.put(data.tradeChatValue, 'byte');
            return packet;
        }
    },
};
