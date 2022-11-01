import { ByteBuffer } from "@runejs/common";
import { Player } from "../player";
import { getWorld } from "../world";
import { PacketSize, queuePacket } from '../../net/packets';
import { Npc } from "./npc";
import { isWithinDistance } from "../coord";

export enum SyncFlags {
    APPEARANCE = 1,
    FOCE_CHAT = 2,
    FACE_ENTITY = 0x10,
}

export interface NpcSyncState {
    flags: number;
    walkDir: number;
    runDir: number;
    teleporting: boolean;
}

export const createNpcSyncState = (): NpcSyncState => {
    return {
        flags: 0,
        walkDir: -1,
        runDir: -1,
        teleporting: false
    };
};

const appendUpdateMasks = (npc: Npc, data: ByteBuffer): void => {
    if (npc.sync.flags === 0) {
        return;
    }
    data.put(npc.sync.flags, 'byte');
}

const appendMovement = (npc: Npc, data: ByteBuffer): void => {
    const updateBlockRequired = npc.sync.flags !== 0;

    if (npc.sync.walkDir === -1) {
        if (updateBlockRequired) {
            data.putBits(1, 1);
            data.putBits(2, 0);
        } else {
            data.putBits(1, 0);
        }
    } else {
        data.putBits(1, 1);
        data.putBits(2, 1);
        data.putBits(3, npc.sync.walkDir);
        data.putBits(1, updateBlockRequired ? 1 : 0);
    }
}

const appendAddTrackedNpc = (npc: Npc, index: number, player: Player, data: ByteBuffer): void => {
    const x = npc.coords.x - player.coords.x;
    const y = npc.coords.y - player.coords.y;
    const updateRequired = npc.sync.flags !== 0;

    data.putBits(14, index + 1);
    data.putBits(5, x);
    data.putBits(1, updateRequired ? 1 : 0);
    data.putBits(5, y);
    data.putBits(12, npc.id);
    data.putBits(1, 0);
}

export const constructNpcSyncPacket = (player: Player): ByteBuffer => {
    const packetData = new ByteBuffer(5000);
    const updateMaskData = new ByteBuffer(5000);

    packetData.openBitBuffer();

    const npcs = getWorld().npcs;
    const trackedNpcs = player.trackedNpcs;

    packetData.putBits(8, trackedNpcs.length);

    trackedNpcs.forEach(npc => {
        if (npcs.includes(npc) && !npc.sync.teleporting && isWithinDistance(npc.coords, player?.coords)) {
            appendMovement(npc, packetData);
            appendUpdateMasks(npc, updateMaskData);
        } else {
            packetData.putBits(1, 1);
            packetData.putBits(2, 3);
        }
    });
    
    if (player.trackedNpcs.length < 255) {
        npcs.forEach((npc, idx) => {

            if (player.trackedNpcs.includes(npc)
                || !isWithinDistance(player?.coords, npc.coords)) {
                return;
            }
           
            player.trackedNpcs.push(npc);
    
            if (npc) {
                appendAddTrackedNpc(npc, idx, player, packetData);
                appendUpdateMasks(npc, updateMaskData);
            }
        });
    }
   
    if (updateMaskData.writerIndex !== 0) {
        packetData.putBits(14, 16383);
        packetData.closeBitBuffer();
        packetData.putBytes(updateMaskData.flipWriter());
    } else {
        packetData.closeBitBuffer();
    }
    return packetData.flipWriter();
}

export const npcSync = async (player: Player): Promise<void> => {
    return new Promise<void>(resolve => {
        const packetData = constructNpcSyncPacket(player);
        queuePacket(player, 249, packetData, PacketSize.VAR_SHORT, 'update');
        resolve();
    });
}
