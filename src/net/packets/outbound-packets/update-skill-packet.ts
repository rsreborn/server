import { ByteBuffer } from '@runejs/common';
import { OutboundPacket } from '../packets';

interface UpdateSkillData {
    skillId: number;
    skillLevel: number;
    skillExperience: number;
}

export const updateSkillPacket: OutboundPacket<UpdateSkillData> = {
    name: 'updateSkill',
    opcodes: {
        319: 211
    },
    encoders: {
        319: (player, opcode, data) => {
            const buffer = new ByteBuffer(6);
            buffer.put(data.skillExperience, 'int');
            buffer.put(data.skillLevel, 'byte');
            buffer.put(data.skillId, 'byte');
            return buffer;
        }
    },
};
