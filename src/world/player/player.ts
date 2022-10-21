import { Client } from '../../net/client';
import { Coord } from '../coord';
import { sendChatboxMessage, sendSideBarWidget, sendSystemUpdate, sendUpdateMapRegionPacket } from '../../net/packets';
import { addPlayer, removePlayer } from '../world';

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
    position?: Coord;
    worldIndex?: number;
    widgetState?: WidgetState;
}

export const playerTick = async (player: Player): Promise<void> => {
    // We wrap this in a promise so that all player ticks can be run
    // in parallel using Promise.all()
    return new Promise<void>(resolve => {
        // @todo - Kat 19/Oct/22
        resolve();
    });
};

export const playerSync = async (player: Player): Promise<void> => {
    // We wrap this in a promise so that all player syncs can be run
    // in parallel using Promise.all()
    // @todo this also needs to run NPC syncs specific to this Player - Kat 19/Oct/22
    return new Promise<void>(resolve => {
        // @todo - Kat 19/Oct/22
        resolve();
    });
};

export const playerTickCleanup = async (player: Player): Promise<void> => {
    // We wrap this in a promise so that all player tick cleanups can be run
    // in parallel using Promise.all()
    return new Promise<void>(resolve => {
        // @todo - Kat 19/Oct/22
        // @todo send queued outgoing packets - Kat 19/Oct/22
        resolve();
    });
};

export const playerLogin = (player: Player): boolean => {
    player.position = {
        x: 3222,
        y: 3222,
        plane: 0,
    };

    player.widgetState = {
        sideBarData: [ 2423, 3917, 638, 3213, 1644, 5608, 1151, 65535, 5065, 5715, 2449, 904, 147, 962 ]
    };

    sendUpdateMapRegionPacket(player); // @todo move to player sync when available - Kat 18/Oct/22
    sendSystemUpdate(player, 100);
    
    player.widgetState.sideBarData.forEach((id, index) => {
        sendSideBarWidget(player, index, id);
    });

    sendChatboxMessage(player, "Welcome to Funscape 319!");

    return addPlayer(player);
};

export const playerLogout = (player: Player): boolean => {
    // @todo logout packet - Kat 19/Oct/22
    return removePlayer(player);
};
