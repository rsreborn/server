import { npcSyncEncoders } from '../npc-sync-encoder';
import { npcUpdateRequired } from '../../../../../world/npc';

enum UpdateFlags {
    // @todo finish me - Kat 5/Nov/22
}

npcSyncEncoders[498] = {
    packetOpcode: 87,

    updateMaskEncoder: (npc, player, data) => {
        let flags = 0;

        data.put(flags);
    },

    appendNewlyTrackedNpcs: (player, npc, data) => {
        const relativeX = npc.coords.x - player.coords.x;
        const relativeY = npc.coords.y - player.coords.y;
        const updateRequired = npcUpdateRequired(npc);

        data.putBits(15, npc.worldIndex + 1);
        data.putBits(3, 6);
        data.putBits(1, 0);
        data.putBits(1, updateRequired ? 1 : 0);
        data.putBits(14, npc.id);
        data.putBits(5, relativeX);
        data.putBits(5, relativeY);
    },

    facePlayer: (npc, player, data) => {
        // npc.sync.faceEntity = true;
        // data.put(player.worldIndex, 'short', 'le')
    },
};
