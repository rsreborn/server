import { buttonPacket } from './button-packet';
import { clickPacket } from './click-packet';
import { walkPacket } from './walk-packet';
import { InboundPacket } from '../packets';
import { updateRegionPacket } from './update-region-packet';
import { commandPacket } from './command-packet';
import { npcClickPacket } from './click-npc-packet';

const inboundPackets: InboundPacket[] = [
    buttonPacket,
    clickPacket,
    walkPacket,
    updateRegionPacket,
    commandPacket,
    npcClickPacket,
];

export default inboundPackets;
