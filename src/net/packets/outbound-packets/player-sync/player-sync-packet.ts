import { ByteBuffer } from '@runejs/common';
import { OutboundPacket, PacketEncoderMap, PacketOpcodeMap, PacketQueueType, PacketSize, sendUpdateMapRegionPacket } from '../../packets';
import { getBuildNumber, Player, playerUpdateRequired } from '../../../../world/player';
import { playerSyncEncoders } from './player-sync-encoder';
import { getLocalPlayerIds } from '../../../../world/region';
import { getWorld } from '../../../../world';
import './builds/player-sync-289';
import './builds/player-sync-319';
import './builds/player-sync-357';
import './builds/player-sync-410';

const appendUpdateMasks = (
    player: Player,
    buildNumber: string,
    data: ByteBuffer,
    forceAppearanceUpdate: boolean = false,
): void => {
    if (!playerUpdateRequired(player) && !forceAppearanceUpdate) {
        return;
    }

    playerSyncEncoders[buildNumber]?.updateMaskEncoder?.(player, data, forceAppearanceUpdate);
};

const appendMapRegionUpdate = (
    player: Player,
    buildNumber: string,
    data: ByteBuffer,
): void => playerSyncEncoders[buildNumber]?.mapRegionUpdateEncoder?.(player, data);

const appendNewlyTrackedPlayer = (
    player: Player,
    otherPlayer: Player,
    data: ByteBuffer,
): void => playerSyncEncoders[getBuildNumber(player)]?.appendNewlyTrackedPlayer?.(data, player, otherPlayer);

const appendMovement = (
    player: Player,
    data: ByteBuffer,
): void => {
    const updateBlockRequired = playerUpdateRequired(player);
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
    const buildNumber = getBuildNumber(player);

    packetData.openBitBuffer();

    const players = getLocalPlayerIds(player.coords).filter(index => index != player.worldIndex);

    if (player.sync.mapRegion || player.sync.teleporting) {
        appendMapRegionUpdate(player, buildNumber, packetData);
    } else {
        appendMovement(player, packetData);
    }

    appendUpdateMasks(player, buildNumber, updateMaskData);

    packetData.putBits(8, player.trackedPlayerIndexes.length);
    player.trackedPlayerIndexes.forEach(trackedPlayerIndex => {
        const otherPlayer = getWorld().players[trackedPlayerIndex];
        if (otherPlayer != null && players.includes(trackedPlayerIndex) && !otherPlayer.sync.teleporting) {
            appendMovement(otherPlayer, packetData);
            appendUpdateMasks(otherPlayer, buildNumber, updateMaskData);
        } else {
            player.trackedPlayerIndexes = player.trackedPlayerIndexes.filter(index => index != trackedPlayerIndex)
            packetData.putBits(1, 1);
            packetData.putBits(2, 3);
        }
    });

    for (let index of players)  {
        if (player.trackedPlayerIndexes.length >= 255) {
            break;
        }
        if (player.trackedPlayerIndexes.includes(index)) {
            continue;
        }
        const otherPlayer = getWorld().players[index];
        if (otherPlayer == null) {
            continue;
        }

        player.trackedPlayerIndexes.push(otherPlayer.worldIndex);
        appendNewlyTrackedPlayer?.(player, otherPlayer, packetData);
        appendUpdateMasks(otherPlayer, buildNumber, updateMaskData, true);
    }

    if (updateMaskData.writerIndex !== 0) {
        packetData.putBits(11, 2047);
        packetData.closeBitBuffer();
        packetData.putBytes(updateMaskData.flipWriter());
    } else {
        packetData.closeBitBuffer();
    }

    return packetData.flipWriter();
};

const opcodes: PacketOpcodeMap = {};
const encoders: PacketEncoderMap = {};

const buildNumbers = Object.keys(playerSyncEncoders);
for (const buildNumber of buildNumbers) {
    opcodes[buildNumber] = playerSyncEncoders[String(buildNumber)]?.packetOpcode;
    encoders[buildNumber] = constructPlayerSyncPacket;
}

export const playerSyncPacket: OutboundPacket = {
    name: 'playerSync',
    size: PacketSize.VAR_SHORT,
    queue: PacketQueueType.SYNC,
    opcodes,
    encoders,
};
