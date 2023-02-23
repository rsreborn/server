import { ByteBuffer } from '@runejs/common';
import { sendUpdateCoords } from '../../packet-handler';
import { OutboundPacket } from '../../packets';

interface UpdateSkillData {
    skillId: number;
    skillLevel: number;
    skillExperience: number;
}

export const justTestingPacket: OutboundPacket<UpdateSkillData> = {
    name: 'justTesting',
    opcodes: {
        254: 30,
    },
    encoders: {
        254: (player, opcode, data) => {
            sendUpdateCoords(player, 3219, 3222)
            const buffer = new ByteBuffer(4);
            buffer.put(0, 'byte');
            buffer.put((10 << 2) + (3 & 3), 'byte'); // Object Type and Orientation
            buffer.put(521, 'short');
            //   buffer.put(1, 'byte');
            //   buffer.put(2, 'byte');
            // buffer.put(2);
            return buffer;
        }
    },
};
