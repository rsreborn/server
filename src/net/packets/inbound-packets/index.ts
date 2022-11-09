import { buttonPacket } from './button-packet';
import { clickPacket } from './click-packet';
import { walkPacket } from './walk-packet';
import { InboundPacket } from '../packets';
import { updateRegionPacket } from './update-region-packet';

const inboundPackets: InboundPacket[] = [
    buttonPacket,
    clickPacket,
    walkPacket,
    updateRegionPacket,
];

export default inboundPackets;
