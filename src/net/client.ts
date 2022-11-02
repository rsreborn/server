import { Isaac } from './isaac';
import { Connection } from './connection';
import { Packet } from './packets';

export interface Client {
    gameBuild: number;
    lowMemory: boolean;
    inCipher: Isaac;
    outCipher: Isaac;
    connection: Connection;
    buildNumber: number;
    outboundPacketQueue: Buffer[];
    outboundUpdateQueue: Buffer[];
    inboundPacket?: Packet;
}
