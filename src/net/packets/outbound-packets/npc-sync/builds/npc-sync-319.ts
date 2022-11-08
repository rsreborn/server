import { npcSyncEncoders } from '../npc-sync-encoder';
import { npcUpdateRequired } from '../../../../../world/npc';

enum UpdateFlags {
    TRANSFORMED = 0x1,
    FORCE_CHAT = 0x2,
    FACE_ENTITY = 0x10,
    // @todo finish me - Kat 5/Nov/22
}

npcSyncEncoders[319] = {
    packetOpcode: 249,

    updateMaskEncoder: (npc, data) => {
        let flags = 0;

        // @todo append all flags - Kat 3/Nov/22
        const { transformed } = npc.sync;
        if (transformed) {
            flags |= UpdateFlags.TRANSFORMED;
        }

        data.put(flags);

        if (transformed) {
            data.put(npc.id, 'short');
        }
    },

    appendNewlyTrackedNpcs: (player, npc, data) => {
        const relativeX = npc.coords.x - player.coords.x;
        const relativeY = npc.coords.y - player.coords.y;
        const updateRequired = npcUpdateRequired(npc);

        data.putBits(14, npc.worldIndex);
        data.putBits(5, relativeX);
        data.putBits(1, updateRequired ? 1 : 0);
        data.putBits(5, relativeY);
        data.putBits(12, npc.id);
        data.putBits(1, 0);
    },
};
