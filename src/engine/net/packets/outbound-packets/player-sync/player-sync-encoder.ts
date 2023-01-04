import { ByteBuffer } from '@runejs/common';
import { Player } from '../../../../world/player';

export interface PlayerSyncEncoder {
    packetOpcode: number;
    updateMaskEncoder: (player: Player, data: ByteBuffer, forceAppearanceUpdate: boolean) => void;
    mapRegionUpdateEncoder: (player: Player, data: ByteBuffer) => void;
    appendNewlyTrackedPlayer: (data: ByteBuffer, player: Player, otherPlayer: Player) => void;
}

export const playerSyncEncoders: { [key: number]: PlayerSyncEncoder } = {};
