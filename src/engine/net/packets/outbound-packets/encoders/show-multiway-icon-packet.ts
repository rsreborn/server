import { Packet } from '../../packet';
import { OutboundPacket } from '../../packets';

interface MultiwayData {
    showMultiwayIcon: boolean;
}

export const showMultiwayIconPacket: OutboundPacket<MultiwayData> = {
    name: 'showMultiwayIcon',
    opcodes: {
        254: 75,
    },
    encoders: {
        254: (player, opcode, data) => {
            const packet = new Packet(75);
            packet.put(Number(data.showMultiwayIcon));
            return packet;
        }
    },
};
