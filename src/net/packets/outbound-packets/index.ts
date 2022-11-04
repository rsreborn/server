import { OutboundPacket } from '../packets';
import { chatboxMessagePacket } from './chatbox-message-packet';
import { sidebarWidgetPacket } from './sidebar-widget-packet';
import { updateMapRegionPacket } from './update-map-region-packet';
import { logoutPacket } from './logout-packet';
import { welcomeScreenPacket } from './welcome-screen-packet';
import { friendsListPacket } from './friends-list-packet';
import { updateSkillPacket } from './update-skill-packet';
import { playerSyncPacket } from './player-sync/player-sync-packet';

const outboundPackets: OutboundPacket[] = [
    chatboxMessagePacket,
    sidebarWidgetPacket,
    updateMapRegionPacket,
    logoutPacket,
    welcomeScreenPacket,
    friendsListPacket,
    updateSkillPacket,
    playerSyncPacket,
];

export default outboundPackets;
