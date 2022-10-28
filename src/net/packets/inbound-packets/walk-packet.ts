import { Coord } from '../../../world';

export interface WalkPacketData {
    totalSteps: number;
    forceRun: boolean;
    startX: number;
    startY: number;
    path: Coord[];
}
