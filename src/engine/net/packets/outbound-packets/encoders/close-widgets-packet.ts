import { Packet } from '../../packet';
import { OutboundPacket } from '../../packets';

const closeWidgetsEncoder = (packetId: number) => new Packet(packetId);

export const closeWidgetsPacket: OutboundPacket = {
    name: 'closeWidgets',
    opcodes: {
        254: 174,
        289: 23,
        319: 143
    },
    encoders: {
        254: (player, opcode) => closeWidgetsEncoder(opcode),
        289: (player, opcode) => closeWidgetsEncoder(opcode),
        319: (player, opcode) => closeWidgetsEncoder(opcode),
    },
};
