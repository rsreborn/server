import { playerSyncEncoders } from './player-sync-encoder';
import { appendAppearanceData } from './player-appearance-data';
import { getLocalCoord } from '../../../../world';
import { playerUpdateRequired } from '../../../../world/player';

// @todo finish update flag enum - Kat 3/Nov/22
enum UpdateFlags {
    APPEARANCE_UPDATE = 0x80,
}

playerSyncEncoders[357] = {
    packetOpcode: 166,

    updateMaskEncoder: (player, data, forceAppearanceUpdate = false) => {
        let flags = 0;

        // @todo append all flags - Kat 3/Nov/22
        const { appearanceUpdate } = player.sync;
        if (appearanceUpdate) {
            flags |= UpdateFlags.APPEARANCE_UPDATE;
        }

        if (flags >= 0x100) {
            flags |= 0x20;
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

        // Local plane coord
        data.putBits(2, localCoord.plane);

        // Local Y coord
        data.putBits(7, localCoord.y);

        // Whether an update flag block follows
        data.putBits(1, playerUpdateRequired(player) ? 1 : 0);

        // Local X coord
        data.putBits(7, localCoord.x);

        // Whether the client should discard the current walking queue (1 if teleporting, 0 if not)
        data.putBits(1, player.sync.teleporting ? 1 : 0);
    },
};

