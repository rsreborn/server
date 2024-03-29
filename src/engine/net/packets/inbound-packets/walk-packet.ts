import { ByteBuffer } from '@runejs/common';
import { Player } from '../../../world/player';
import { Coord } from '../../../world';
import { queuePath } from '../../../world/movement-queue';
import { InboundPacket } from '../packets';

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
        254: [ 6, 220, 127 ],
        289: [ 234, 236, 67 ],
        319: [ 155, 178, 191 ],
        357: [ 66, 77, 213 ],
        414: [ 20, 104, 142 ],
        498: [ 74, 149, 177 ],
    },
    decoders: {
        254: (opcode: number, data: ByteBuffer) => {
            let size = data.length;
            if (opcode === 220) {
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
        },
        414: (opcode: number, data: ByteBuffer) => {
            let size = data.length;
            if (opcode === 142) {
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

            const forceRun = data.get('byte') === 1;
            const startY = data.get('short', 'u', 'le');
            const startX = data.get('short', 'u');

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
        498: (opcode: number, data: ByteBuffer) => {
            let size = data.length;
            if (opcode === 74) {
                size -= 14;
            }

            const totalSteps = Math.floor((size - 5) / 2) + 1;
            const path: Coord[] = new Array(totalSteps);

            const startY = data.get('short', 'u', 'le');
            const startX = data.get('short', 'u', 'le');
            const forceRun = data.get('byte') === 1;

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
        }
    },
};
