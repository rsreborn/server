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
        254: 24,
    },
    encoders: {
        254: (player, opcode, data) => {
            const buffer = new ByteBuffer(3);
            //buffer.put(6668, 'short');
              buffer.put(1, 'byte');
              buffer.put(1, 'byte');
              buffer.put(2, 'byte');
             // buffer.put(3214, 'short');
            // buffer.put(2);
            return buffer;
        }
    },
};
