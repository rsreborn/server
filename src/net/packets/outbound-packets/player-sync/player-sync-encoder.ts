import { Player } from '../../../../world/player';
import { ByteBuffer } from '@runejs/common';

export interface PlayerSyncEncoder {
    packetOpcode: number;
    updateMaskEncoder: (player: Player, data: ByteBuffer, forceAppearanceUpdate: boolean) => void;
    mapRegionUpdateEncoder: (player: Player, data: ByteBuffer) => void;
}

export const playerSyncEncoders: { [key: number]: PlayerSyncEncoder } = {};
