import { Client } from '../../net/client';
import { coord, Coord } from '../coord';
import { sendAnimateWidget, sendChatboxMessage, sendChatboxWidget, sendChatboxWidgetOnly, sendConfig, sendEnterAmount, sendFlashSidebarIcon, sendFriendsList, sendFullscreenWidget, sendGameScreenAndSidebarWidget, sendHideWidgetComponent, sendHintIcon, sendLogout, sendMultiwayIcon, sendResetButtonState, sendSideBarWidget, sendSkill, sendSystemUpdate, sendTestPacket, sendUpdateActiveSidebar, sendUpdateMapRegionPacket, sendUpdatePlayerOption, sendUpdateRunEnergy, sendUpdateScrollbarPosition, sendUpdateWeight, sendUpdateWidgetPosition, sendWelcomeScreen, sendWidget, sendWidgetNpcHead, sendWidgetPlayerHead, sendWidgetString, sendWidgetStringColor, sendWindowPane, writePackets } from '../../net/packets';
import { addPlayer, removePlayer } from '../world';
import { createPlayerSyncState, PlayerSyncState, resetPlayerSyncState } from './player-sync';
import { Appearance, defaultAppearance } from './appearance';
import { createMovementQueue, MovementQueue, movementTick } from '../movement-queue';
import { updatePlayerChunk } from '../region';
import { HintType } from '@engine/net/packets/outbound-packets/encoders/show-hint-icon-packet';
import { updateWidgetStringDisabledColorPacket } from '@engine/net/packets/outbound-packets/encoders/update-widget-string-disabled-color-packet';
import {ColorConverter, JagexColor} from '../../util/color';
import { showMultiwayIconPacket } from '@engine/net/packets/outbound-packets/encoders/show-multiway-icon-packet';
import { updateScrollbarPositionPacket } from '@engine/net/packets/outbound-packets/encoders/update-scrollbar-position-packet';
export enum PlayerRights {
    USER = 0,
    MOD = 1,
    JMOD = 2,
}

export interface WidgetState {
    sideBarData: number[];
}

export interface Player {
    uid: number;
    username: string;
    password: string;
    rights: PlayerRights;
    client: Client;
    coords?: Coord;
    worldIndex?: number;
    hasMembership?: boolean;
    widgetState?: WidgetState;
    sync?: PlayerSyncState;
    appearance?: Appearance;
    movementQueue?: MovementQueue;
    trackedPlayerIndexes?: number[];
    trackedNpcIndexes?: number[];
    lastChunkId?: number;
    running?: boolean;
}

export const playerTick = async (player: Player): Promise<void> => {
    // We wrap this in a promise so that all player ticks can be run
    // in parallel using Promise.all()
    return new Promise<void>(resolve => {
        movementTick(player);
        updatePlayerChunk(player);

        if (player.sync.mapRegion) {
            sendUpdateMapRegionPacket(player);
        }

        resolve();
    });
};

export const playerTickCleanup = async (player: Player): Promise<void> => {
    // We wrap this in a promise so that all player tick cleanups can be run
    // in parallel using Promise.all()
    return new Promise<void>(resolve => {
        resetPlayerSyncState(player);
        writePackets(player);
        resolve();
    });
};

export const playerLogin = (player: Player): boolean => {
    player.sync = createPlayerSyncState();
    player.appearance = defaultAppearance();

    player.movementQueue = createMovementQueue();

    player.trackedPlayerIndexes = [];
    player.trackedNpcIndexes = [];

    player.hasMembership = true;

    player.coords = player.movementQueue.lastMapRegionUpdateCoords = {
        x: 3222,
        y: 3222,
        plane: 0,
    };

    if ((player?.client?.connection?.buildNumber ?? 0) < 400) {
        player.widgetState = {
            sideBarData: [ 2423, 3917, 638, 3213, 1644, 5608, 1151, 65535, 5065, 5715, 2449, 904, 147, 962 ]
        };
    } else {
        player.widgetState = {
            sideBarData: [ 92, 320, 274, 149, 387, 271, 192, 65535, 131, 148, 182, 261, 262, 239 ]
        };
    }

    sendUpdateMapRegionPacket(player); // @todo move to player sync when available - Kat 18/Oct/22
    
    sendWindowPane(player, 548);
    
    player.widgetState.sideBarData.forEach((id, index) => {
        sendSideBarWidget(player, index, id);
    });

    sendChatboxMessage(player, `Welcome to RS-Reborn ${player.client.connection.buildNumber}!`);
    sendFriendsList(player, 2);
    for (let i = 0; i < 21; i++) {
        if (i === 3) {
            sendSkill(player, i, 10, 1154);
        } else {
            sendSkill(player, i, 1, 0);
        }
    }

    // let hintCoord: Coord = coord(3222, 3223, 0);
    // sendHintIcon(player, HintType.NPC, 462 + 32768);

    // sendChatboxWidget(player, 4882);
    // sendWidgetNpcHead(player, 4883, 13);
    // sendAnimateWidget(player, 4883, 595);
    // sendWidgetString(player, 4884, "Wizard")
    // sendWidgetString(player, 4885, "We've got some text here!");

    //  sendChatboxWidget(player, 968);
    //  sendWidgetPlayerHead(player, 969);
    //  sendAnimateWidget(player, 969, 591);
    //  sendWidgetString(player, 970, "Brian")
    //  sendWidgetString(player, 971, "We've got some text here!");
    
    //sendWelcomeScreen(player);
    // sendFullscreenWidget(player, 15244, 5993);
    //sendEnterAmount(player);
    //sendGameScreenAndSidebarWidget(player, 0, 1151)
     sendWidget(player, 6575);
    //sendUpdateScrollbarPosition(player, 8143, 600)
    // sendUpdateWidgetPosition(player, 154, 10, 10);
    sendConfig(player, 286, 1);
   sendTestPacket(player);


    // sendWidgetStringColor(player, 7332, JagexColor.RED);
    // sendWidgetStringColor(player, 7333, JagexColor.YELLOW);
    // sendWidgetStringColor(player, 7334, JagexColor.GREEN);
    // sendWidgetStringColor(player, 7336, JagexColor.CYAN);
    // sendWidgetStringColor(player, 7383, JagexColor.BLACK);
    // sendWidgetStringColor(player, 7339, JagexColor.WHITE);
    // sendChatboxMessage(player, `Color: ${ColorConverter.rgbToJagex(255, 255, 255)}`);

    //sendUpdatePlayerOption(player, 2, "Follow", true);
    //sendWidget(player, 0);
    //sendChatboxWidget(player, 0)
    //sendChatboxWidgetOnly(player, 147);


    return addPlayer(player);
};

export const playerLogout = (player: Player): void => {
    // @todo logout packet - Kat 19/Oct/22
    sendLogout(player);
    removePlayer(player);
};

export const getBuildNumber = (player: Player): string => {
    return String(player.client.connection.buildNumber);
};
