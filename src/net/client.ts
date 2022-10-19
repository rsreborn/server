import { Isaac } from './isaac';
import { Connection } from './connection';

export interface Client {
    gameBuild: number;
    lowMemory: boolean;
    inCipher: Isaac;
    outCipher: Isaac;
    connection: Connection;
}
