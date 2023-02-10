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
        254: 5,
    },
    encoders: {
        254: (player, opcode, data) => {
            const buffer = new ByteBuffer(0);
            return buffer;
        }
    },
};
