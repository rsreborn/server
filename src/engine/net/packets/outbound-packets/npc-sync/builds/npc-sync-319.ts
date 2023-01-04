import { npcSyncEncoders } from '../npc-sync-encoder';
import { npcUpdateRequired } from '../../../../../world/npc';
import { facePlayer } from '../npc-sync-face';
import { sendChatboxMessage } from '../../../packet-handler';

enum UpdateFlags {
    TRANSFORMED = 0x1,
    FORCE_CHAT = 0x2,
    FACE_ENTITY = 0x10,
    PLAY_ANIMATION = 0x4,
    DAMAGE_TYPE_1 = 0x40,
    DAMAGE_TYPE_2 = 0x20,
    GRAPHICS = 0x8,
    FACE_COORDS = 0x80,
}

npcSyncEncoders[319] = {
    packetOpcode: 249,

    updateMaskEncoder: (npc, player, data) => {
        let flags = 0;

        // @todo append all flags - Kat 3/Nov/22
        const { transformed, faceEntity } = npc.sync;
        if (transformed) {
            flags |= UpdateFlags.TRANSFORMED;
        }
        if (faceEntity) {
            flags |= UpdateFlags.FACE_ENTITY;
        }

        data.put(flags);

        if (transformed) {
            data.put(npc.id, 'short');
        }

        if (faceEntity) {
            console.log(`NPC index ${npc.worldIndex} will face Player ${npc.interactingEntity} updating for player ${player.worldIndex}`);
            data.put(npc.interactingEntity + 32768, 'short', 'le')
        }

        // console.log(npc);

    },

    appendNewlyTrackedNpcs: (player, npc, data) => {
        const relativeX = npc.coords.x - player.coords.x;
        const relativeY = npc.coords.y - player.coords.y;
        const updateRequired = npcUpdateRequired(npc);

        data.putBits(14, npc.worldIndex);
        data.putBits(5, relativeY);
        data.putBits(1, updateRequired ? 1 : 0);
        data.putBits(5, relativeX);
        data.putBits(12, npc.id);
        data.putBits(1, 0);
    },

    facePlayer: (npc, player, data) => {
       
    },
};
