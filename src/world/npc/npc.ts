import { Coord } from "world/coord";
import { npcSyncState } from "./npc-sync";

export interface Npc {
    id: number;
    coords: Coord;
    sync: npcSyncState;
}