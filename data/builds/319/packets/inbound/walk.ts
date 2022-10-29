import { ByteBuffer } from '@runejs/common';
import { coord, Coord } from '../../../../../src/world';

export default {
    opcodes: [ 155, 178, 191 ],
    size: -1,
    decoder: (opcode: number, size: number, data: ByteBuffer) => {
        let len = size;

        if(opcode === 178) {
            len -= 14;
        }

        const totalSteps = Math.floor((len - 5) / 2);
        const forceRun = data.get('byte') === 1;
        const startX = data.get('short', 'u', 'le');
        const path: Coord[] = new Array(totalSteps);

        for (let i = 0; i < totalSteps; i++) {
            const x = data.get();
            const y = data.get();
            path[i] = coord(x, y);
        }

        const startY = data.get('short', 'u', 'le');

        return {
            totalSteps,
            forceRun,
            startX,
            startY,
            path,
        };
    }
};
