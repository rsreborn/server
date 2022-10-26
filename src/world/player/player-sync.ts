import { ByteBuffer } from '@runejs/common';
import { Player } from './player';
import { getLocalCoord } from '../coord';
import { PacketSize, queuePacket } from '../../net/packets';
import { encodeBase37Username } from '../../util/base37';

export enum SyncFlags {
    FACE_COORDS = 0x1,
    APPEARANCE_UPDATE = 0x2,
    PLAY_ANIMATION = 0x4,
    FACE_ENTITY = 0x8,
    FORCE_CHAT = 0x10,
    DAMAGE_TYPE_1 = 0x20,
    CHAT = 0x80,
    FORCED_MOVEMENT = 0x100,
    DAMAGE_TYPE_2 = 0x200,
    PLAY_SPOT_ANIM = 0x400,
}

export interface PlayerSyncState {
    flags: number;
    mapRegion: boolean;
    walkDir: number;
    runDir: number;
    teleporting: boolean;
    appearanceData?: ByteBuffer;
}

export const createPlayerSyncState = (): PlayerSyncState => {
    return {
        flags: 0,
        mapRegion: true,
        walkDir: -1,
        runDir: -1,
        teleporting: false,
    };
};

const appendNewlyTrackedPlayers = (data: ByteBuffer) => {
    // @todo multiplayer support - Kat 25/Oct/22
};

const appendTrackedPlayers = (data: ByteBuffer) => {
    // @todo multiplayer support - Kat 25/Oct/22
    data.putBits(8, 0);
};

const appendAppearanceData = (
    player: Player,
    data: ByteBuffer,
): void => {
    console.log('appearance update required');

    if (!player.sync.appearanceData) {
        const appearanceData = new ByteBuffer(500);

        appearanceData.put(player.appearance.bodyType); // Body type
        appearanceData.put(0); // @todo head icons - Kat 25/Oct/22

        // @todo NPC transformation - Kat 25/Oct/22

        // @todo worn equipment - Kat 25/Oct/22

        appearanceData.put(0); // head item
        appearanceData.put(0); // back item
        appearanceData.put(0); // neck item
        appearanceData.put(0); // main hand item
        appearanceData.put(0x100 + player.appearance.torso, 'short'); // torso
        appearanceData.put(0); // off-hand item
        appearanceData.put(0x100 + player.appearance.arms, 'short'); // arms
        appearanceData.put(0x100 + player.appearance.legs, 'short'); // legs
        appearanceData.put(0x100 + player.appearance.head, 'short'); // head
        appearanceData.put(0x100 + player.appearance.hands, 'short'); // hands
        appearanceData.put(0x100 + player.appearance.feet, 'short'); // feet
        appearanceData.put(0x100 + player.appearance.facialHair, 'short'); // facial hair

        [
            player.appearance.hairColor,
            player.appearance.torsoColor,
            player.appearance.legColor,
            player.appearance.feetColor,
            player.appearance.skinColor,
        ].forEach(color => appearanceData.put(color));

        [
            0x328, // stand
            0x337, // stand turn
            0x333, // walk
            0x334, // turn around
            0x335, // turn right
            0x336, // turn left
            0x338, // run
        ].forEach(animation => appearanceData.put(animation, 'short'));

        appearanceData.put(encodeBase37Username(player.username), 'long'); // Username
        appearanceData.put(3); // @todo Combat Level - Kat 25/Oct/22
        appearanceData.put(0, 'short'); // @todo Skill Level - Kat 25/Oct/22

        player.sync.appearanceData = appearanceData.flipWriter();
    }

    data.put(player.sync.appearanceData.length);
    data.putBytes(player.sync.appearanceData);
};

const appendUpdateMasks = (
    player: Player,
    data: ByteBuffer,
    forceAppearanceUpdate?: boolean,
): void => {
    let flags = player.sync.flags;

    if (player.sync.flags === 0 && !forceAppearanceUpdate) {
        return;
    }

    if(flags >= 0x100) {
        flags |= 0x40;
        data.put(flags & 0xff);
        data.put(flags >> 8);
    } else {
        data.put(flags);
    }

    if (flags & SyncFlags.APPEARANCE_UPDATE || forceAppearanceUpdate) {
        appendAppearanceData(player, data);
    }
};

const appendMapRegionUpdate = (
    player: Player,
    data: ByteBuffer,
): void => {
    const localCoord = getLocalCoord(player.coords);

    // Map region update required
    data.putBits(1, 1);
    // Map region changed (movement type - 0=none, 1=walk, 2=run, 3=mapchange
    data.putBits(2, 3);

    // Local X coord
    data.putBits(7, localCoord.x);
    // Local plane coord
    data.putBits(2, localCoord.plane);
    // Local Y coord
    data.putBits(7, localCoord.y);
    // Whether the client should discard the current walking queue (1 if teleporting, 0 if not)
    data.putBits(1, player.sync.teleporting ? 1 : 0);
    // Whether an update flag block follows
    data.putBits(1, player.sync.flags !== 0 ? 1 : 0);
};

const appendMovement = (
    player: Player,
    data: ByteBuffer,
): void => {
    const updateBlockRequired = player.sync.flags !== 0;

    if (player.sync.walkDir !== -1) {
        // Player is walking/running
        data.putBits(1, 1); // Update required

        if (player.sync.runDir === -1) {
            // Player is walking
            data.putBits(2, 1); // Player walking
            data.putBits(3, player.sync.walkDir);
        } else {
            // Player is running
            data.putBits(2, 2); // Player running
            data.putBits(3, player.sync.walkDir);
            data.putBits(3, player.sync.runDir);
        }

        data.putBits(1, updateBlockRequired ? 1 : 0); // Whether an update flag block follows
    } else {
        // Did not move
        if (updateBlockRequired) {
            data.putBits(1, 1); // Update required
            data.putBits(2, 0); // Signify the player did not move
        } else {
            data.putBits(1, 0); // No update required
        }
    }
};

const constructPlayerSyncPacket = (player: Player): ByteBuffer => {
    const packetData = new ByteBuffer(5000);
    const updateMaskData = new ByteBuffer(5000);

    packetData.openBitBuffer();

    if (player.sync.mapRegion || player.sync.teleporting) {
        appendMapRegionUpdate(player, packetData);
    } else {
        appendMovement(player, packetData);
    }

    appendUpdateMasks(player, updateMaskData);

    appendTrackedPlayers(packetData);
    appendNewlyTrackedPlayers(packetData);

    if (updateMaskData.writerIndex !== 0) {
        packetData.putBits(11, 2047);
        packetData.closeBitBuffer();
        packetData.putBytes(updateMaskData.flipWriter());
    } else {
        packetData.closeBitBuffer();
    }

    return packetData.flipWriter();
};

export const playerSync = async (player: Player): Promise<void> => {
    // We wrap this in a promise so that all player syncs can be run
    // in parallel using Promise.all()
    // @todo this also needs to run NPC syncs specific to this Player - Kat 19/Oct/22
    // 76 is the opcode for the player sync packet
    return new Promise<void>(resolve => {
        const packetData = constructPlayerSyncPacket(player);
        queuePacket(player, 76, packetData, PacketSize.VAR_SHORT, 'update');
        resolve();
    });
};
