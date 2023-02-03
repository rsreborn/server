import { Coord } from '@engine/world';
import { ByteBuffer } from '@runejs/common';
import { OutboundPacket } from '../../packets';

interface HintIconData {
    hintType: HintType;
    entityIndex?: number;
    position?: Coord;
}

export enum HintType {
    PLAYER = 1,
    POSITION_TILE_CENTERED = 2,
    POSITION_TILE_WEST = 3,
    POSITION_TILE_EAST = 4,
    POSITION_TILE_SOUTH = 5,
    POSITION_TILE_NORTH = 6,
    NPC = 10
}

export const showHintIconPacket: OutboundPacket<HintIconData> = {
    name: 'showHintIcon',
    opcodes: {
        254: 64,
    },
    encoders: {
        254: (player, opcode, data) => {
            if (data.hintType === 1 || data.hintType === 10) {
                const buffer = new ByteBuffer(3);
                buffer.put(data.hintType);
                buffer.put(data.entityIndex, 'short');
                return buffer;
            } else if (data.hintType >= 2 && data.hintType <= 6) {
                const buffer = new ByteBuffer(6);
                console.log(data.position)
                buffer.put(data.position?.y, 'short');
                buffer.put(data.position?.x, 'short');
                buffer.put(data.position?.plane);
                return buffer;
            }
        }
    },
};
