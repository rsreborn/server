import { buttonPacket } from './button-packet';
import { clickPacket } from './click-packet';
import { InboundPacket } from '../packets';

const inboundPackets: InboundPacket[] = [
    buttonPacket,
    clickPacket,
];

export default inboundPackets;
