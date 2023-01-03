import { ByteBuffer } from '@runejs/common';
import { Player } from '../../../world/player';
import { InboundPacket } from '@net/packets/packets';

interface ClickPacketData {
    hash: number;
}

export const clickPacket: InboundPacket<ClickPacketData> = {
    name: 'click',
    handler: (
        player: Player,
        data: ClickPacketData,
    ): void => {
        console.log(`click packet handler ${data.hash}`);
    },
    opcodes: {
        319: 76,
        357: 48,
    },
    decoders: {
        319: (opcode: number, data: ByteBuffer) => {
            const hash = data.get('int', 'u', 'le');
            return { hash };
        },
        357: (opcode: number, data: ByteBuffer) => {
            const hash = data.get('int');
            return { hash };
        }
    },
};
