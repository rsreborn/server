import { Npc } from "engine/world/npc";
import { Player } from "engine/world/player";

export const facePlayer = (player: Player, npc: Npc): void => {
    npc.interactingEntity = player.worldIndex;
    npc.sync.faceEntity = true;
    console.log(player.worldIndex)
};
