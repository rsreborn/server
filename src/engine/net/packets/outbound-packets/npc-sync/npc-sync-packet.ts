import { ByteBuffer } from '@runejs/common';
import { Player } from '../../../../world/player';
import { getWorld, isWithinDistance } from '../../../../world';
import { Npc, npcUpdateRequired } from '../../../../world/npc';
import { npcSyncEncoders } from './npc-sync-encoder';
import './builds/npc-sync-254';
import './builds/npc-sync-289';
import './builds/npc-sync-319';
import './builds/npc-sync-357';
import './builds/npc-sync-498';
import { getLocalNpcIds } from '../../../../world/region/chunk-manager';
import { OutboundPacket, PacketEncoderMap, PacketOpcodeMap, PacketQueueType } from '../../packets';
import { Packet, PacketType } from '../../packet';

const appendNewlyTrackedNpcs = (
    player: Player,
    npc: Npc,
    packet: Packet,
): void => {
    npcSyncEncoders[String(player.client.connection.buildNumber)]?.appendNewlyTrackedNpcs(player, npc, packet);
};

const appendUpdateMasks = (
    player: Player,
    npc: Npc,
    data: ByteBuffer,
): void => {
    if (!npcUpdateRequired(npc)) {
        return;
    }

    npcSyncEncoders[String(player.client.connection.buildNumber)]?.updateMaskEncoder(npc, player, data);
};

const appendMovement = (npc: Npc, packet: Packet): void => {
    const updateBlockRequired = npcUpdateRequired(npc);

    if (npc.sync.walkDir === -1) {
        if (updateBlockRequired) {
            packet.putBits(1, 1);
            packet.putBits(2, 0);
        } else {
            packet.putBits(1, 0);
        }
    } else {
        // @todo support for running - Kat 6/Nov/22
        packet.putBits(1, 1);
        packet.putBits(2, 1);
        packet.putBits(3, npc.sync.walkDir);
        packet.putBits(1, updateBlockRequired ? 1 : 0);
    }
};

const constructNpcSyncPacket = (player: Player): ByteBuffer => {
    const packetData = new Packet(npcSyncEncoders[String(player.client.connection.buildNumber)]?.packetOpcode, PacketType.VAR_SHORT);
    const updateMaskData = new ByteBuffer(5000);

    packetData.openBitBuffer();

    const npcs = getLocalNpcIds(player.coords);

    packetData.putBits(8, player.trackedNpcIndexes.length);
    player.trackedNpcIndexes.forEach(trackedNpcIndex =>  {
        const npc = getWorld().npcs[trackedNpcIndex]
        if (npcs.includes(trackedNpcIndex) && !npc.sync.teleporting) {
            appendMovement(npc, packetData);
            appendUpdateMasks(player, npc, updateMaskData);
        } else {
            player.trackedNpcIndexes = player.trackedNpcIndexes.filter(index => index != trackedNpcIndex);
            packetData.putBits(1, 1);
            packetData.putBits(2, 3);
        }
    });

    for (let index of npcs)  {
        if (player.trackedNpcIndexes.length >= 255) {
            break;
        }
        if (player.trackedNpcIndexes.includes(index)) {
            continue;
        }
        const npc = getWorld().npcs[index];
        if (npc == null) {
            continue;
        }
        
        player.trackedNpcIndexes.push(npc.worldIndex);
        appendNewlyTrackedNpcs(player, npc, packetData);
        appendUpdateMasks(player, npc, updateMaskData);
    }

    if (updateMaskData.writerIndex !== 0) {

        var bitsToSend = player.client.connection.buildNumber > 490 ? 15 : 14;
        var bitValue = player.client.connection.buildNumber > 400 ? 32768 : 16383;
        packetData.putBits(bitsToSend, bitValue); // double on higher 32768
        packetData.closeBitBuffer();
        packetData.putBytes(updateMaskData.flipWriter());
    } else {
        packetData.closeBitBuffer();
    }

    return packetData;
};

const opcodes: PacketOpcodeMap = {};
const encoders: PacketEncoderMap = {};

const buildNumbers = Object.keys(npcSyncEncoders);
for (const buildNumber of buildNumbers) {
    opcodes[buildNumber] = npcSyncEncoders[String(buildNumber)]?.packetOpcode;
    encoders[buildNumber] = constructNpcSyncPacket;
}

export const npcSyncPacket: OutboundPacket = {
    name: 'npcSync',
    type: PacketType.VAR_SHORT,
    queue: PacketQueueType.SYNC,
    opcodes,
    encoders,
};
