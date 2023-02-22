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
        254: 120,
    },
    encoders: {
        254: (player, opcode, data) => {
            const buffer = new ByteBuffer(5);
            buffer.put(0, 'byte');

            buffer.put(3140, 'short');
            //   buffer.put(1, 'byte');
            //   buffer.put(2, 'byte');
            buffer.put(1, 'short');
            // buffer.put(2);
            return buffer;
        }
    },
};
