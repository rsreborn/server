import { buttonPacket } from './button-packet';
import { clickPacket } from './click-packet';
import { walkPacket } from './walk-packet';
import { InboundPacket } from '../packets';

const inboundPackets: InboundPacket[] = [
    buttonPacket,
    clickPacket,
    walkPacket,
];

export default inboundPackets;
