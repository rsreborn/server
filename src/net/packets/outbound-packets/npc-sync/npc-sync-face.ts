import { Npc } from "world/npc";
import { Player } from "world/player";

export const facePlayer = (player: Player, npc: Npc): void => {
    npc.interactingEntity = player.worldIndex;
    npc.sync.faceEntity = true;
    console.log(player.worldIndex)
};