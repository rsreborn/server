import { ByteBuffer } from '@runejs/common';
import { OutboundPacket, PacketEncoderMap, PacketOpcodeMap, PacketQueueType, PacketSize } from '../../packets';
import { Player } from '../../../../world/player';
import { getWorld, isWithinDistance } from '../../../../world';
import { Npc, npcUpdateRequired } from '../../../../world/npc';
import { npcSyncEncoders } from './npc-sync-encoder';
import './builds/npc-sync-319';
import './builds/npc-sync-357';
import { getLocalNpcIds } from '../../../../world/region/chunk-manager';

const appendNewlyTrackedNpcs = (
    player: Player,
    npc: Npc,
    data: ByteBuffer,
): void => {
    npcSyncEncoders[String(player.client.connection.buildNumber)]?.appendNewlyTrackedNpcs(player, npc, data);
};

const appendUpdateMasks = (
    player: Player,
    npc: Npc,
    data: ByteBuffer,
): void => {
    if (!npcUpdateRequired(npc)) {
        return;
    }

    npcSyncEncoders[String(player.client.connection.buildNumber)]?.updateMaskEncoder(npc, data);
};

const appendMovement = (npc: Npc, data: ByteBuffer): void => {
    const updateBlockRequired = npcUpdateRequired(npc);

    if (npc.sync.walkDir === -1) {
        if (updateBlockRequired) {
            data.putBits(1, 1);
            data.putBits(2, 0);
        } else {
            data.putBits(1, 0);
        }
    } else {
        // @todo support for running - Kat 6/Nov/22
        data.putBits(1, 1);
        data.putBits(2, 1);
        data.putBits(3, npc.sync.walkDir);
        data.putBits(1, updateBlockRequired ? 1 : 0);
    }
};

const constructNpcSyncPacket = (player: Player): ByteBuffer => {
    const packetData = new ByteBuffer(5000);
    const updateMaskData = new ByteBuffer(5000);

    packetData.openBitBuffer();

    const npcs = getLocalNpcIds(player.coords)
    const trackedNpcs = player.trackedNpcIndexes;

    packetData.putBits(8, trackedNpcs.length);

    trackedNpcs.forEach(trackedNpcIndex =>  {
        const npc = getWorld().npcs[trackedNpcIndex]
        if (npcs.includes(trackedNpcIndex) && !npc.sync.teleporting && isWithinDistance(npc.coords, player?.coords)) {
            appendMovement(npc, packetData);
            appendUpdateMasks(player, npc, updateMaskData);
        } else {
            packetData.putBits(1, 1);
            packetData.putBits(2, 3);

            // player.trackedNpcIndexes.filter(index => index !== trackedNpcIndex)
        }
    })

    // trackedNpcs.forEach(npc => {
    //     if (npcs.includes(npc) && !npc.sync.teleporting && isWithinDistance(npc.coords, player?.coords)) {
    //         appendMovement(npc, packetData);
    //         appendUpdateMasks(player, npc, updateMaskData);
    //     } else { 
    //         packetData.putBits(1, 1);
    //         packetData.putBits(2, 3);
    //     }
    // });

    // for (const npcIndex of npcs) {
    for (let i = 0; i < npcs.length; i++)  {
        //console.log(player.trackedNpcs?.length)
        if (player.trackedNpcIndexes.length === 255) {
            break;
        }
        if (trackedNpcs.includes(npcs[i])) {
            continue;
        }

        const npc = getWorld().npcs[i];
        if (!isWithinDistance(player?.coords, npc.coords)) {
            continue;
        }
        
        console.log(npcs[i])
        // console.log("Do we get down to npcs push?");
        player.trackedNpcIndexes.push(npcs[i]);

        if (npc) {
            appendNewlyTrackedNpcs(player, npc, packetData);
            appendUpdateMasks(player, npc, updateMaskData);
        }
    };

    if (updateMaskData.writerIndex !== 0) {
        packetData.putBits(14, 16383);
        packetData.closeBitBuffer();
        packetData.putBytes(updateMaskData.flipWriter());
    } else {
        packetData.closeBitBuffer();
    }

    return packetData.flipWriter();
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
    size: PacketSize.VAR_SHORT,
    queue: PacketQueueType.SYNC,
    opcodes,
    encoders,
};
