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
        254: 186,
    },
    encoders: {
        254: (player, opcode, data) => {
            const buffer = new ByteBuffer(3);
            buffer.put(166, 'short');
            buffer.put(1);
            return buffer;
        }
    },
};
