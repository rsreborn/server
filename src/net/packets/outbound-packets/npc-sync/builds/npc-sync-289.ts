import { npcSyncEncoders } from '../npc-sync-encoder';
import { npcUpdateRequired } from '../../../../../world/npc';

enum UpdateFlags {
    TRANSFORMED = 0x1,
    FORCE_CHAT = 0x2,
    FACE_ENTITY = 0x10,
    // @todo finish me - Kat 5/Nov/22
}

npcSyncEncoders[289] = {
    packetOpcode: 65,

    updateMaskEncoder: (npc, player, data) => {
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
        const relativeX = npc.coords.x - (player?.coords?.x ?? 0);
        const relativeY = npc.coords.y - (player?.coords?.y ?? 0);
        const updateRequired = npcUpdateRequired(npc);

        data.putBits(14, npc.worldIndex + 1);
        data.putBits(11, npc.id);
        data.putBits(5, relativeX);
        data.putBits(5, relativeY);
        data.putBits(1, updateRequired ? 1 : 0);
        data.putBits(1, 0);
    },

    facePlayer: (npc, player, data) => {
        // npc.sync.faceEntity = true;
        // data.put(player.worldIndex, 'short', 'le')
    },
};
