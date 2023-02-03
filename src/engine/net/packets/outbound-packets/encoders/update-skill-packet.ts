import { ByteBuffer } from '@runejs/common';
import { OutboundPacket } from '../../packets';

interface UpdateSkillData {
    skillId: number;
    skillLevel: number;
    skillExperience: number;
}

export const updateSkillPacket: OutboundPacket<UpdateSkillData> = {
    name: 'updateSkill',
    opcodes: {
        254: 136,
        289: 154,
        319: 211,
        357: 200,
    },
    encoders: {
        254: (player, opcode, data) => {
            const buffer = new ByteBuffer(6);
            buffer.put(data.skillId, 'byte');
            buffer.put(data.skillExperience, 'int');
            buffer.put(data.skillLevel, 'byte');

            return buffer;
        },
        289: (player, opcode, data) => {
            const buffer = new ByteBuffer(6);
            buffer.put(data.skillId, 'byte');
            buffer.put(data.skillExperience, 'int');
            buffer.put(data.skillLevel, 'byte');

            return buffer;
        },
        319: (player, opcode, data) => {
            const buffer = new ByteBuffer(6);
            buffer.put(data.skillExperience, 'int');
            buffer.put(data.skillLevel, 'byte');
            buffer.put(data.skillId, 'byte');
            return buffer;
        },
        357: (player, opcode, data) => {
            const buffer = new ByteBuffer(6);
            buffer.put(data.skillId, 'byte');
            buffer.put(data.skillLevel, 'byte');
            buffer.put(data.skillExperience, 'int', 'le');
            return buffer;
        },        
    },
};
