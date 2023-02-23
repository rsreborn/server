import { ByteBuffer } from '@runejs/common';
import { sendUpdateCoords } from '../../packet-handler';
import { OutboundPacket } from '../../packets';

interface ProjectileData {
    offset: number;
    graphicId: number;
    height: number;
    delay: number;
}

export const justTestingPacket: OutboundPacket<ProjectileData> = {
    name: 'justTesting',
    opcodes: {
        254: 114,
    },
    encoders: {
        254: (player, opcode, data) => {
            sendUpdateCoords(player, 3222, 3220)
           
            const buffer = new ByteBuffer(6);
            buffer.put(0, 'byte');
            buffer.put(86, 'short');
            buffer.put(128, 'byte');
            buffer.put(0, 'short');

            //   buffer.put(1, 'byte');
            //   buffer.put(2, 'byte');
            // buffer.put(2);
            return buffer;
        }
    },
};
