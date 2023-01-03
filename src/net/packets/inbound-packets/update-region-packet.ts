import { ByteBuffer } from '@runejs/common';
import { Player } from '../../../world/player';
import { InboundPacket } from '@net/packets/packets';

interface UpdateRegionPacketData { }

export const updateRegionPacket: InboundPacket<UpdateRegionPacketData> = {
    name: 'click',
    handler: (
        player: Player,
        data: UpdateRegionPacketData,
    ): void => {
        console.log(`Map region change packet`);
    },
    opcodes: {
        319: 25
    },
    decoders: {
        319: (opcode: number, data: ByteBuffer) => { 
            return {}
        }
    },
};
