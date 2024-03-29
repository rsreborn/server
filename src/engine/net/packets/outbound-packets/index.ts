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
import { updateWidgetStringDisabledColorPacket } from './encoders/update-widget-string-disabled-color-packet';
import { resetCameraPacket } from './encoders/reset-camera-packet';
import { updateCameraPacket } from './encoders/update-camera-packet';
import { updatePlayerOptionPacket } from './encoders/update-player-option';
import { configLowPacket } from './encoders/config-low-packet';
import { configHighPacket } from './encoders/config-high-packet';
import { updateWidgetPositionPacket } from './encoders/update-widget-position-packet';
import { updateActiveSidebarPacket } from './encoders/update-active-sidebar-packet';
import { showMultiwayIconPacket } from './encoders/show-multiway-icon-packet';
import { updateRunEnergyPacket } from './encoders/update-run-energy-packet';
import { updateScrollbarPositionPacket } from './encoders/update-scrollbar-position-packet';
import { updateWeightPacket } from './encoders/update-weight-packet';
import { clearItemContainerPacket } from './encoders/clear-item-container-packet';
import { resetButtonStatePacket } from './encoders/reset-button-state-packet';
import { hideWidgetComponentPacket } from './encoders/hide-widget-component-packet';
import { updateChatSettingsPacket } from './encoders/update-chat-settings-packet';
import { updateCoordsPacket } from './encoders/update-coords-packet';
import { addGroundItemPacket } from './encoders/add-ground-item-packet';
import { removeGroundItemPacket } from './encoders/remove-ground-item-packet';
import { addObjectPacket } from './encoders/add-object-packet';
import { animateObjectPacket } from './encoders/animate-object-packet';
import { projectilePacket } from './encoders/projectile-packet';
import { stationaryGraphic } from './encoders/stationary-graphic-pacaket';
import { walkableWidgetPacket } from './encoders/show-walkable-widget';
import { removeObjectPacket } from './encoders/remove-object-packet';

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
    updateWidgetStringDisabledColorPacket,
    resetCameraPacket,
    updateCameraPacket,
    updatePlayerOptionPacket,
    configLowPacket,
    configHighPacket,
    updateWidgetPositionPacket,
    updateActiveSidebarPacket,
    showMultiwayIconPacket,
    updateRunEnergyPacket,
    updateScrollbarPositionPacket,
    updateWeightPacket,
    clearItemContainerPacket,
    resetButtonStatePacket,
    hideWidgetComponentPacket,
    updateChatSettingsPacket,
    updateCoordsPacket,
    addGroundItemPacket,
    removeGroundItemPacket,
    addObjectPacket,
    animateObjectPacket,
    projectilePacket,
    stationaryGraphic,
    walkableWidgetPacket,
    removeObjectPacket,
    justTestingPacket,
];

export default outboundPackets;
