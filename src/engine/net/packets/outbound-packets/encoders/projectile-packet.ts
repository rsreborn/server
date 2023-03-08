import { ByteBuffer } from '@runejs/common';
import { Packet } from '../../packet';
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

            const packet = new Packet(37);
            packet.put(data.angle, 'byte');
            packet.put(data.offsetX, 'byte');
            packet.put(data.offsetY, 'byte');
            packet.put(data.targetIndex, 'short');
            packet.put(data.graphicId, 'short');
            packet.put(data.heightStart, 'byte');
            packet.put(data.heightEnd, 'byte');
            packet.put(data.delay, 'short');
            packet.put(data.speed, 'short');
            packet.put(data.slope, 'byte');
            packet.put(data.distanceFromSource, 'byte');
            return packet;
        }
    },
};
