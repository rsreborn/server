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
           
            const buffer = new ByteBuffer(300);
            buffer.put(3214, 'short'); // Widget Id

            for (let i = 0; i < 28; i++) {
                buffer.put(i, 'byte'); // Slot Id
                buffer.put(0 + (Math.random() * 3140), 'short'); // Item Id
                buffer.put(1 + (Math.random() * 50), 'byte'); // Amount
            }
            return buffer;
        }
    },
};
