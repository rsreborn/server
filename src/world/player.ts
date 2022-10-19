import { Client } from '../net/client';
import { Coord } from './coord';
import { sendUpdateMapRegionPacket } from '../net/packets';

export enum PlayerRights {
    USER = 0,
    MOD = 1,
    JMOD = 2,
}

export interface Player {
    uid: number;
    username: string;
    password: string;
    rights: PlayerRights;
    client: Client;
    position?: Coord;
}

export const playerLogin = (player: Player): void => {
    player.position = {
        x: 3222,
        y: 3222,
        plane: 0,
    };

    sendUpdateMapRegionPacket(player); // @todo move to player sync when available - Kat 18/Oct/22
};
