import { ByteBuffer } from '@runejs/common';
import { sendUpdateCoords } from '../../packet-handler';
import { OutboundPacket } from '../../packets';

interface ProjectileData {
    angle: number;
    offsetX: number;
    offsetY: number;
    targetIndex: number;
    graphicId: number;
    heightStart: number;
    heightEnd: number;
    delay: number;
    speed: number;
    slope: number;
    distanceFromSource: number;
}

export const projectilePacket: OutboundPacket<ProjectileData> = {
    name: 'projectile',
    opcodes: {
        254: 37,
    },
    encoders: {
        254: (player, opcode, data) => {
            sendUpdateCoords(player, player.coords.x, player.coords.y)
            data.offsetX = 0;
            data.offsetY = -6;
            data.graphicId = 159;
            data.heightStart = 40;
            data.heightEnd = 36;
            data.speed = 120;
            data.targetIndex = 0;
            data.delay = 2;
            data.angle = 0;
            data.slope = 105;
            data.distanceFromSource = 0;

            const buffer = new ByteBuffer(15);
            buffer.put(data.angle, 'byte');
            buffer.put(data.offsetX, 'byte');
            buffer.put(data.offsetY, 'byte');
            buffer.put(data.targetIndex, 'short');
            buffer.put(data.graphicId, 'short');
            buffer.put(data.heightStart, 'byte');
            buffer.put(data.heightEnd, 'byte');
            buffer.put(data.delay, 'short');
            buffer.put(data.speed, 'short');
            buffer.put(data.slope, 'byte');
            buffer.put(data.distanceFromSource, 'byte');
            return buffer;
        }
    },
};
