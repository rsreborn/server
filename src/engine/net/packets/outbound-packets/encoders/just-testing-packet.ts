import { ByteBuffer } from '@runejs/common';
import { OutboundPacket } from '../../packets';

interface UpdateSkillData {
    skillId: number;
    skillLevel: number;
    skillExperience: number;
}

export const justTestingPacket: OutboundPacket<UpdateSkillData> = {
    name: 'justTesting',
    opcodes: {
        254: 38,
    },
    encoders: {
        254: (player, opcode, data) => {
            const buffer = new ByteBuffer(4);
            buffer.put(7332, 'short');
            buffer.put(0, 'short');
            return buffer;
        }
    },
};
