import { buttonPacket } from './button-packet';
import { clickPacket } from './click-packet';
import { walkPacket } from './walk-packet';
import { InboundPacket } from '../packets';
import { commandPacket } from './command-packet';

const inboundPackets: InboundPacket[] = [
    buttonPacket,
    clickPacket,
    walkPacket,
    commandPacket,
];

export default inboundPackets;
