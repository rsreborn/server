import { ByteBuffer } from '@runejs/common';
import { Player } from './player';
import { handleOutboundPacket } from '../../net/packets';

export interface PlayerSyncState {
    faceCoords: boolean;
    appearanceUpdate: boolean;
    playAnimation: boolean;
    faceEntity: boolean;
    forceChat: boolean;
    damageType1: boolean;
    damageType2: boolean;
    chat: boolean;
    forceMovement: boolean;
    playSpotAnimation: boolean;
    mapRegion: boolean;
    walkDir: number;
    runDir: number;
    teleporting: boolean;
    appearanceData?: ByteBuffer;
}

export const playerUpdateRequired = (player: Player): boolean => {
    const {
        faceCoords,
        appearanceUpdate,
        playAnimation,
        faceEntity,
        forceChat,
        damageType1,
        damageType2,
        chat,
        forceMovement,
        playSpotAnimation
    } = player.sync;

    return faceCoords ||
        appearanceUpdate ||
        playAnimation ||
        faceEntity ||
        forceChat ||
        damageType1 ||
        damageType2 ||
        chat ||
        forceMovement ||
        playSpotAnimation;
};

export const createPlayerSyncState = (): PlayerSyncState => {
    return {
        faceCoords: false,
        appearanceUpdate: true,
        playAnimation: false,
        faceEntity: false,
        forceChat: false,
        damageType1: false,
        damageType2: false,
        chat: false,
        forceMovement: false,
        playSpotAnimation: false,
        mapRegion: true,
        walkDir: -1,
        runDir: -1,
        teleporting: false,
    };
};

export const resetPlayerSyncState = (player: Player): void => {
    player.sync = {
        faceCoords: false,
        appearanceUpdate: false,
        playAnimation: false,
        faceEntity: false,
        forceChat: false,
        damageType1: false,
        damageType2: false,
        chat: false,
        forceMovement: false,
        playSpotAnimation: false,
        mapRegion: false,
        walkDir: -1,
        runDir: -1,
        teleporting: false,
    };
};

export const playerSync = async (player: Player): Promise<void> => {
    // We wrap this in a promise so that all player syncs can be run
    // in parallel using Promise.all()
    // @todo this also needs to run NPC syncs specific to this Player - Kat 19/Oct/22
    // 76 is the opcode for the player sync packet
    return new Promise<void>(resolve => {
        handleOutboundPacket(player, 'playerSync', {});
        // const packetData = constructPlayerSyncPacket(player);
        // queuePacket(player, 76, packetData, PacketSize.VAR_SHORT, PacketQueueType.SYNC);
        resolve();
    });
};
