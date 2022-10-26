import { ByteBuffer } from "@runejs/common";
import { Player } from "../player";
import { getWorld } from "../world";
import { PacketSize, queuePacket } from '../../net/packets';
import { Npc } from "./npc";
import { isWithinDistance } from "../coord";

export enum SyncFlags {
    FOCE_CHAT = 2,
    FACE_ENTITY = 0x10
}

export interface npcSyncState {
    flags: number;
    walkDir: number;
    runDir: number;
    teleporting: boolean;
}

export const createNpcSyncState = (): npcSyncState => {
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
    console.log("Pretty sure nothing should happen here...");
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

const appendAddNpc = (npc: Npc, index: number, player: Player, data: ByteBuffer): void => {
    const x = npc.coords.x - player.coords.x;
    const y = npc.coords.y - player.coords.y;
    const updateRequired = npc.sync.flags !== 0;

    data.putBits(14, index);
    data.putBits(5, y);
    data.putBits(1, updateRequired ? 1 : 0);
    data.putBits(5, x);
    data.putBits(12, npc.id);
    data.putBits(1, 0);
}

export const constructNpcSyncPacket = (player: Player): ByteBuffer => {
    const packetData = new ByteBuffer(5000);
    const updateMaskData = new ByteBuffer(5000);

    packetData.openBitBuffer();

    const npcs = getWorld().npcs;
    console.log(npcs.length, JSON.stringify(npcs[0]));
    packetData.putBits(8, npcs.length); // Using the count of npcs causes a T2.

    npcs.forEach(npc => {
        if (npc && !npc.sync.teleporting && isWithinDistance(npc.coords, player?.coords)) {
            appendMovement(npc, packetData);
            appendUpdateMasks(npc, updateMaskData);
        } else {
            packetData.putBits(1, 1);
            packetData.putBits(2, 3);
        }
    });
       
    npcs.forEach((npc, idx) => {
        console.log(idx);
        if (npcs.length >= 255) {
            return;
        }

        if (npc) {
            appendAddNpc(npc, idx, player, packetData);
            appendUpdateMasks(npc, updateMaskData);
        }
    });
   
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