import { ByteBuffer } from '@runejs/common';
import { sendUpdateCoords } from '../../packet-handler';
import { OutboundPacket, PacketSize } from '../../packets';

interface ProjectileData {
    offset: number;
    graphicId: number;
    height: number;
    delay: number;
}

export const justTestingPacket: OutboundPacket<ProjectileData> = {
    name: 'justTesting',
    size: PacketSize.VAR_SHORT,
    opcodes: {
        254: 170,
    },
    encoders: {
        254: (player, opcode, data) => {
           // sendUpdateCoords(player, 3219, 3222)
           
            const buffer = new ByteBuffer(114);
            buffer.put(5382, 'short');

            for (let i = 0; i < 28; i++) {
                buffer.put(i, 'byte');
                buffer.put(1039 + i, 'short');
                buffer.put(1, 'byte');
            }
            return buffer;
        }
    },
};
