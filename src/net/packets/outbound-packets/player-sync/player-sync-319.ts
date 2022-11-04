import { playerSyncEncoders } from './player-sync-encoder';
import { appendAppearanceData } from './player-appearance-data';
import { getLocalCoord } from '../../../../world';
import { playerUpdateRequired } from '../../../../world/player';

enum UpdateFlags {
    FACE_COORDS = 0x1,
    APPEARANCE_UPDATE = 0x2,
    PLAY_ANIMATION = 0x4,
    FACE_ENTITY = 0x8,
    FORCE_CHAT = 0x10,
    DAMAGE_TYPE_1 = 0x20,
    CHAT = 0x80,
    FORCE_MOVEMENT = 0x100,
    DAMAGE_TYPE_2 = 0x200,
    PLAY_SPOT_ANIMATION = 0x400,
}

playerSyncEncoders[319] = {
    packetOpcode: 76,

    updateMaskEncoder: (player, data, forceAppearanceUpdate = false) => {
        let flags = 0;

        // @todo append all flags - Kat 3/Nov/22
        const { appearanceUpdate } = player.sync;
        if (appearanceUpdate) {
            flags |= UpdateFlags.APPEARANCE_UPDATE;
        }

        if (flags >= 0x100) {
            flags |= 0x40;
            data.put(flags & 0xff);
            data.put(flags >> 8);
        } else {
            data.put(flags);
        }

        if (appearanceUpdate || forceAppearanceUpdate) {
            appendAppearanceData(player, data);
        }
    },

    mapRegionUpdateEncoder: (player, data) => {
        const localCoord = getLocalCoord(player.coords);

        // Map region update required
        data.putBits(1, 1);
        // Map region changed (movement type - 0=none, 1=walk, 2=run, 3=mapchange
        data.putBits(2, 3);

        // Local X coord
        data.putBits(7, localCoord.x);
        // Local plane coord
        data.putBits(2, localCoord.plane);
        // Local Y coord
        data.putBits(7, localCoord.y);
        // Whether the client should discard the current walking queue (1 if teleporting, 0 if not)
        data.putBits(1, player.sync.teleporting ? 1 : 0);
        // Whether an update flag block follows
        data.putBits(1, playerUpdateRequired(player) ? 1 : 0);
    },
};
