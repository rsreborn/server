import { ByteBuffer } from '@runejs/common';
import { Player } from '../../../world/player';
import { InboundPacket, sendChatboxMessage, sendWidget } from '../packets';
import { getChunkByCoords, getRegionCoords, getChunkCoordByCoords } from '../../../world/region/';
import { getWorld } from '../../../world';
import { facePlayer } from '../outbound-packets/npc-sync/npc-sync-face';

interface CommandPacketData {
    input: string;
}

export const commandPacket: InboundPacket<CommandPacketData> = {
    name: 'command',
    handler: (
        player: Player,
        data: CommandPacketData,
    ): void => {
        console.log(`command packet handler ${data.input}`);

        if (!data.input || data.input.length === 0) {
            return;
        }

        const args = data.input.trim().split(' ');
        const command = args[0];

        if (command === 'widget') {
            sendWidget(player, parseInt(args[1]));
        } else if (command === 'chunks') {
            console.log('Chunks:', getWorld().chunkManager.activeChunks)
            console.log('Player Chunk:', getChunkByCoords(player.coords))
            console.log('Player Region Coords:', getRegionCoords(player.coords))
        } else if (command === 'coords') {
            sendChatboxMessage(player, `Coords: ${player.coords.x}, ${player.coords.y}, ${player.coords.plane}`);
            const chunkData = getChunkCoordByCoords(player.coords);
            sendChatboxMessage(player, `World index: ${player.worldIndex}`);
            sendChatboxMessage(player, `Region: ${chunkData.regionId}, ${chunkData.regionX}, ${chunkData.regionY}`);
            sendChatboxMessage(player, `Chunk: ${chunkData.chunkId}, ${chunkData.regionChunkLocalX}, ${chunkData.regionChunkLocalY}`);
        } else if (command === 'face') {
            facePlayer(player, getWorld().npcs[590]);
        }

    },
    opcodes: {
        319: 192,
    },
    decoders: {
        319: (opcode: number, data: ByteBuffer) => {
            const input = data.getString(10);
            return { input };
        }
    },
};
