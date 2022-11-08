import { ByteBuffer } from '@runejs/common';
import { OutboundPacket, PacketEncoderMap, PacketOpcodeMap, PacketQueueType, PacketSize } from '../../packets';
import { Player, playerUpdateRequired } from '../../../../world/player';
import { playerSyncEncoders } from './player-sync-encoder';
import './builds/player-sync-319';
import './builds/player-sync-357';

const appendNewlyTrackedPlayers = (data: ByteBuffer) => {
    // @todo multiplayer support - Kat 3/Nov/22
};

const appendTrackedPlayers = (data: ByteBuffer) => {
    // @todo multiplayer support - Kat 3/Nov/22
    data.putBits(8, 0);
};

const appendUpdateMasks = (
    player: Player,
    data: ByteBuffer,
    forceAppearanceUpdate: boolean = false,
): void => {
    if (!playerUpdateRequired(player) && !forceAppearanceUpdate) {
        return;
    }

    playerSyncEncoders[String(player.client.connection.buildNumber)]?.updateMaskEncoder?.(player, data, forceAppearanceUpdate);
};

const appendMapRegionUpdate = (
    player: Player,
    data: ByteBuffer,
): void => playerSyncEncoders[String(player.client.connection.buildNumber)]?.mapRegionUpdateEncoder?.(player, data);

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
