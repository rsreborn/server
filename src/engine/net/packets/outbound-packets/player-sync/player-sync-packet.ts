import { ByteBuffer } from '@runejs/common';
import { getBuildNumber, Player, playerUpdateRequired } from '../../../../world/player';
import { playerSyncEncoders } from './player-sync-encoder';
import { getLocalPlayerIds } from '../../../../world/region';
import { getWorld } from '../../../../world';
import { OutboundPacket, PacketEncoderMap, PacketOpcodeMap, PacketQueueType } from '../../packets';
import './builds/player-sync-254';
import './builds/player-sync-289';
import './builds/player-sync-319';
import './builds/player-sync-357';
import './builds/player-sync-414';
import './builds/player-sync-498';
import { Packet, PacketType } from '../../packet';

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
    packet: Packet,
): void => playerSyncEncoders[buildNumber]?.mapRegionUpdateEncoder?.(player, packet);

const appendNewlyTrackedPlayer = (
    player: Player,
    otherPlayer: Player,
    packet: Packet,
): void => playerSyncEncoders[getBuildNumber(player)]?.appendNewlyTrackedPlayer?.(packet, player, otherPlayer);

const appendMovement = (
    player: Player,
    packet: Packet,
): void => {
    const updateBlockRequired = playerUpdateRequired(player);
    if (player.sync.walkDir !== -1) {
        // Player is walking/running
        packet.putBits(1, 1); // Update required
        if (player.sync.runDir === -1) {
            // Player is walking
            packet.putBits(2, 1); // Player walking
            packet.putBits(3, player.sync.walkDir);
        } else {
            // Player is running
            packet.putBits(2, 2); // Player running
            packet.putBits(3, player.sync.walkDir);
            packet.putBits(3, player.sync.runDir);
        }
        packet.putBits(1, updateBlockRequired ? 1 : 0); // Whether an update flag block follows
    } else {
        // Did not move
        if (updateBlockRequired) {
            packet.putBits(1, 1); // Update required
            packet.putBits(2, 0); // Signify the player did not move
        } else {
            packet.putBits(1, 0); // No update required
        }
    }
};

const constructPlayerSyncPacket = (player: Player): ByteBuffer => {
    const buildNumber = getBuildNumber(player);
    const packet = new Packet(playerSyncEncoders[String(buildNumber)]?.packetOpcode, PacketType.VAR_SHORT);
    const updateMaskData = new ByteBuffer(5000);

    packet.openBitBuffer();

    const players = getLocalPlayerIds(player.coords).filter(index => index != player.worldIndex);

    if (player.sync.mapRegion || player.sync.teleporting) {
        appendMapRegionUpdate(player, buildNumber, packet);
    } else {
        appendMovement(player, packet);
    }

    appendUpdateMasks(player, buildNumber, updateMaskData);

    packet.putBits(8, player.trackedPlayerIndexes.length);
    player.trackedPlayerIndexes.forEach(trackedPlayerIndex => {
        const otherPlayer = getWorld().players[trackedPlayerIndex];
        if (otherPlayer != null && players.includes(trackedPlayerIndex) && !otherPlayer.sync.teleporting) {
            appendMovement(otherPlayer, packet);
            appendUpdateMasks(otherPlayer, buildNumber, updateMaskData);
        } else {
            player.trackedPlayerIndexes = player.trackedPlayerIndexes.filter(index => index != trackedPlayerIndex)
            packet.putBits(1, 1);
            packet.putBits(2, 3);
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
        appendNewlyTrackedPlayer?.(player, otherPlayer, packet);
        appendUpdateMasks(otherPlayer, buildNumber, updateMaskData, true);
    }

    if (updateMaskData.writerIndex !== 0) {
        packet.putBits(11, 2047);
        packet.closeBitBuffer();
        packet.putBytes(updateMaskData.flipWriter());
    } else {
        packet.closeBitBuffer();
    }
    return packet;
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
    type: PacketType.VAR_SHORT,
    queue: PacketQueueType.SYNC,
    opcodes,
    encoders,
};
