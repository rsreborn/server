import { ByteBuffer } from '@runejs/common';
import { Player } from '../../../world/player';
import { InboundPacket } from '../packets';
import { Coord } from '../../../world';
import { queuePath } from '../../../world/movement-queue';

interface WalkPacketData {
    forceRun: boolean;
    path: Coord[];
}

export const walkPacket: InboundPacket<WalkPacketData> = {
    name: 'walk',
    handler: (
        player: Player,
        data: WalkPacketData,
    ): void => {
        queuePath(player, data.path, true, data.forceRun);
    },
    opcodes: {
        289: [ 234, 236, 67 ],
        319: [ 155, 178, 191 ],
        357: [ 66, 77, 213 ],
    },
    decoders: {
        289: (opcode: number, data: ByteBuffer) => {
            let size = data.length;
            if (opcode === 236) {
                size -= 14;
            }

            const totalSteps = Math.floor((size - 5) / 2) + 1;

            const forceRun = data.get('byte') === 1;
            const startX = data.get('short', 'u');
            const startY = data.get('short', 'u');

            const path: Coord[] = new Array(totalSteps);

            for (let i = 1; i < totalSteps; i++) {
                const x = data.get('byte');
                const y = data.get('byte');
                path[i] = {
                    x, y, plane: null
                };
            }

            path[0] = {
                x: startX, y: startY, plane: null
            };

            for (let i = 1; i < totalSteps; i++) {
                path[i].x += startX;
                path[i].y += startY;
            }

            return {
                forceRun,
                path,
            };
        },
        319: (opcode: number, data: ByteBuffer) => {
            let size = data.length;
            if (opcode === 178) {
                size -= 14;
            }

            const totalSteps = Math.floor((size - 5) / 2) + 1;

            const forceRun = data.get('byte') === 1;
            const startX = data.get('short', 'u', 'le');
            const path: Coord[] = new Array(totalSteps);

            for (let i = 1; i < totalSteps; i++) {
                const x = data.get('byte');
                const y = data.get('byte');
                path[i] = {
                    x, y, plane: null
                };
            }

            const startY = data.get('short', 'u');

            path[0] = {
                x: startX, y: startY, plane: null
            };

            for (let i = 1; i < totalSteps; i++) {
                path[i].x += startX;
                path[i].y += startY;
            }

            return {
                forceRun,
                path,
            };
        },
        357: (opcode: number, data: ByteBuffer) => {
            let size = data.length;
            if (opcode === 77) {
                size -= 14;
            }

            const totalSteps = Math.floor((size - 5) / 2) + 1;


            const path: Coord[] = new Array(totalSteps);

            for (let i = 1; i < totalSteps; i++) {
                const x = data.get('byte');
                const y = data.get('byte');
                path[i] = {
                    x, y, plane: null
                };
            }

            const startX = data.get('short', 'u');
            const startY = data.get('short', 'u', 'le');
            const forceRun = data.get('byte') === 1;

            path[0] = {
                x: startX, y: startY, plane: null
            };

            for (let i = 1; i < totalSteps; i++) {
                path[i].x += startX;
                path[i].y += startY;
            }

            return {
                forceRun,
                path,
            };
        }
    },
};
