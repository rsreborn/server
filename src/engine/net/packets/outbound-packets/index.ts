import { chatboxMessagePacket } from './encoders/chatbox-message-packet';
import { sidebarWidgetPacket } from './encoders/sidebar-widget-packet';
import { updateMapRegionPacket } from './encoders/update-map-region-packet';
import { logoutPacket } from './encoders/logout-packet';
import { welcomeScreenPacket } from './encoders/welcome-screen-packet';
import { friendsListPacket } from './encoders/friends-list-packet';
import { updateSkillPacket } from './encoders/update-skill-packet';
import { playerSyncPacket } from './player-sync/player-sync-packet';
import { npcSyncPacket } from './npc-sync/npc-sync-packet';
import { showWidgetPacket } from './encoders/show-widget-packet';
import { showChatboxWidgetOnlyPacket } from './encoders/show-chatbox-widget-only-packet';
import { animateWidgetPacket } from './encoders/animate-widget-packet';
import { showWidgetPlayerHeadPacket } from './encoders/show-widget-player-head-packet';
import { showWidgetNpcHeadPacket } from './encoders/show-widget-npc-head-packet';
import { flashSidebarIconPacket } from './encoders/flash-sidebar-icon-packet';
import { closeWidgetsPacket } from './encoders/close-widgets-packet';
import { updateWidgetString } from './encoders/update-widget-string-packet';
import { systemUpdatePacket } from './encoders/system-update-packet';
import { sidebarWidgetWithDisabledTabsPacket } from './encoders/sidebar-widget-with-disabled-tabs';
import { showFullscreenWidget } from './encoders/fullscreen-widget-packet';
import { playerDetailsPacket } from './encoders/player-details-packet';
import { windowPanePacket } from './encoders/window-pane-packet';
import { OutboundPacket } from '../packets';
import { showHintIconPacket } from './encoders/show-hint-icon-packet';
import { justTestingPacket } from './encoders/just-testing-packet';
import { showWidgetItemPacket } from './encoders/show-widget-item-packet';
import { gameScreenAndSidebarPacket } from './encoders/show-game-screen-and-sidebar-widget-packet';
import { enterAmountPacket } from './encoders/enter-amount-packet';
import { showChatboxWidgetPacket } from './encoders/show-chatbox-widget-packet';

const outboundPackets: OutboundPacket[] = [
    chatboxMessagePacket,
    sidebarWidgetPacket,
    updateMapRegionPacket,
    logoutPacket,
    welcomeScreenPacket,
    friendsListPacket,
    updateSkillPacket,
    playerSyncPacket,
    npcSyncPacket,
    showWidgetPacket,
    showChatboxWidgetOnlyPacket,
    animateWidgetPacket,
    showWidgetPlayerHeadPacket,
    showWidgetNpcHeadPacket,
    flashSidebarIconPacket,
    closeWidgetsPacket,
    updateWidgetString,
    systemUpdatePacket,
    sidebarWidgetWithDisabledTabsPacket,
    showFullscreenWidget,
    playerDetailsPacket,
    windowPanePacket,
    showHintIconPacket,
    showWidgetItemPacket,
    gameScreenAndSidebarPacket,
    enterAmountPacket,
    showChatboxWidgetPacket,
    justTestingPacket,
];

export default outboundPackets;
