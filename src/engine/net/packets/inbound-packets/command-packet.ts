import { ByteBuffer } from '@runejs/common';
import { Player } from '../../../world/player';
import { sendAnimateObject, sendChatboxMessage, sendProjectile, sendStationaryGraphic, sendTestPacket, sendUpdatePlayerOption, sendWidget } from '../packet-handler';
import { getChunkByCoords, getRegionCoords, getChunkCoordByCoords } from '../../../world/region';
import { coord, getWorld } from '../../../world';
import { facePlayer } from '../outbound-packets/npc-sync/npc-sync-face';
import { InboundPacket } from '../packets';

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
        } else if (command === 'tele') {
            const x =  parseInt(args[1]);
            const y = parseInt(args[2]);
            const plane = parseInt(args[3]) ?? 0;

            player.coords.x = x;
            player.coords.y = y;
            player.coords.plane = plane;
            player.sync.mapRegion = true;
        } else if (command === 'objanim') {
            sendAnimateObject(player, coord(3219, 3222), 521, 10, 3, 0);
        } else if (command === 'proj') {
            sendProjectile(player);
        } else if (command === 'sgraphic') {
            const graphicId =  parseInt(args[1]);
            sendStationaryGraphic(player, 
                coord(player.coords.x + 1, player.coords.y, player.coords.plane), 
                graphicId, 64, 0);
        } else if (command === 'test') {
            sendTestPacket(player);
        } else if (command === 'pindex') {
            sendChatboxMessage(player, `Your Index is: ${player.worldIndex}`);
        }
    },
    opcodes: {
        254: 86,
        319: 192,
    },
    decoders: {
        254: (opcode: number, data: ByteBuffer) => {
            const input = data.getString(10);
            return { input };
        },
        319: (opcode: number, data: ByteBuffer) => {
            const input = data.getString(10);
            return { input };
        }
    },
};
