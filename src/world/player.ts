import { Client } from '../net/client';
import { ByteBuffer, logger } from '@runejs/common';

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
}

export const handlePacket = (player: Player, opcode: number, data: ByteBuffer | null): void => {
    logger.info(`Packet ${opcode} received with size of ${data?.length ?? 0}.`);
};
