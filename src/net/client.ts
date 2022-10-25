import { Isaac } from './isaac';
import { Connection } from './connection';
import { InboundPacket } from './packets';

export interface Client {
    gameBuild: number;
    lowMemory: boolean;
    inCipher: Isaac;
    outCipher: Isaac;
    connection: Connection;
    outboundPacketQueue: Buffer[];
    outboundUpdateQueue: Buffer[];
    inboundPacket?: InboundPacket;
}
