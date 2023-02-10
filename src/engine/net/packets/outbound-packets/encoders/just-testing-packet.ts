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
        254: 222,
    },
    encoders: {
        254: (player, opcode, data) => {
            const buffer = new ByteBuffer(6);
            buffer.put(838, 'short');
            buffer.put(3140, 'short'); // object Id
            buffer.put(100, 'short');

            return buffer;
        }
    },
};
