import { Player } from '../../../../world/player';
import { ByteBuffer } from '@runejs/common';
import { encodeBase37Username } from '../../../../util/base37';

export const appendAppearanceData = (
    player: Player,
    buildNumber: number,
    data: ByteBuffer,
): void => {
    // @todo fix this by making it build-specific - Kat 25/Nov/22
    // if (!player.sync.appearanceData) {
        const appearanceData = new ByteBuffer(500);

        appearanceData.put(player.appearance.bodyType); // Body type
        appearanceData.put(buildNumber >= 357 ? -1 : 0); // @todo head icons - Kat 25/Oct/22

        if (buildNumber >= 357) {
            appearanceData.put(-1); // @todo skull icons for later revisions - Kat 3/Nov/22
        }

        // @todo NPC transformation - Kat 25/Oct/22

        // @todo worn equipment - Kat 25/Oct/22

        appearanceData.put(0); // head item
        appearanceData.put(0); // back item
        appearanceData.put(0); // neck item
        appearanceData.put(0); // main hand item
        appearanceData.put(0x100 + player.appearance.torso, 'short'); // torso

        appearanceData.put(0); // off-hand item
        appearanceData.put(0x100 + player.appearance.arms, 'short'); // arms
        appearanceData.put(0x100 + player.appearance.legs, 'short'); // legs
        appearanceData.put(0x100 + player.appearance.head, 'short'); // head
        appearanceData.put(0x100 + player.appearance.hands, 'short'); // hands
        appearanceData.put(0x100 + player.appearance.feet, 'short'); // feet
        appearanceData.put(0x100 + player.appearance.facialHair, 'short'); // facial hair

        [
            player.appearance.hairColor,
            player.appearance.torsoColor,
            player.appearance.legColor,
            player.appearance.feetColor,
            player.appearance.skinColor,
        ].forEach(color => appearanceData.put(color));

        [
            0x328, // stand
            0x337, // stand turn
            0x333, // walk
            0x334, // turn around
            0x335, // turn right
            0x336, // turn left
            0x338, // run
        ].forEach(animation => appearanceData.put(animation, 'short'));

        appearanceData.put(encodeBase37Username(player.username), 'long'); // Username
        appearanceData.put(3); // @todo Combat Level - Kat 25/Oct/22
        appearanceData.put(0, 'short'); // @todo Skill Level - Kat 25/Oct/22

        player.sync.appearanceData = appearanceData.flipWriter();
    // }

    data.put(player.sync.appearanceData.length);
    data.putBytes(player.sync.appearanceData);
};
