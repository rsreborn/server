import { Packet } from '../../packet';
import { OutboundPacket } from '../../packets';

const logoutEncoder = (packetId: number) => new Packet(packetId);

export const logoutPacket: OutboundPacket = {
    name: 'logout',
    opcodes: {
        254: 21,
        289: 121,
        319: 49,
        357: 161,
    },
    encoders: {
        254: (player, opcode) => logoutEncoder(opcode),
        289: (player, opcode) => logoutEncoder(opcode),
        319: (player, opcode) => logoutEncoder(opcode),
        357: (player, opcode) => logoutEncoder(opcode),
    },
};
