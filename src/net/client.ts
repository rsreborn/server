import { Isaac } from './isaac';
import { Connection } from './connection';
import { Packet } from './packets';

export interface Client {
    lowMemory: boolean;
    inCipher: Isaac;
    outCipher: Isaac;
    connection: Connection;
    outboundPacketQueue: Buffer[];
    outboundSyncQueue: Buffer[];
    inboundPacket?: Packet;
}
