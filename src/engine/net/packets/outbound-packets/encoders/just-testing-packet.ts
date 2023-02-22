import { encodeBase37Username } from '@engine/util/base37';
import { ByteBuffer } from '@runejs/common';
import { OutboundPacket, PacketSize } from '../../packets';

interface UpdateSkillData {
    skillId: number;
    skillLevel: number;
    skillExperience: number;
}

export const justTestingPacket: OutboundPacket<UpdateSkillData> = {
    name: 'justTesting',
    opcodes: {
        254: 14,
    },
    encoders: {
        254: (player, opcode, data) => {
            const buffer = new ByteBuffer(4);
             buffer.put(639, 'short');
             buffer.put(300, 'short');
            // buffer.put(2);
            return buffer;
        }
    },
};
