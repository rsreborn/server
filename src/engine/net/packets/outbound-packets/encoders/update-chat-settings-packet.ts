import { ByteBuffer } from '@runejs/common';
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
            const buffer = new ByteBuffer(3);
            buffer.put(data.publicChatValue, 'byte');
            buffer.put(data.privateChatValue, 'byte');
            buffer.put(data.tradeChatValue, 'byte');
            return buffer;
        }
    },
};
