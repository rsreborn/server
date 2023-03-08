import { ByteBuffer } from "@runejs/common";
import { Isaac } from "../isaac";

export enum PacketType {
    FIXED = 0,
    VAR_BYTE = 1,
    VAR_SHORT = 2,
}

export class Packet extends ByteBuffer {

    private readonly _packetId: number;
    private readonly _packetType: PacketType =  PacketType.FIXED;
    
    public constructor(packetId: number, size: PacketType = PacketType.FIXED, allocatedSize: number = 5000) {
        super(allocatedSize);
        this._packetId = packetId;
        this._packetType = size;
    }

    public toBuffer(cipher: Isaac): Buffer {

        const packetSize = this.writerIndex;
        let bufferSize = packetSize + 1;

        if (this._packetType !== PacketType.FIXED) {
            bufferSize += this._packetType;
        }
    
        const buffer = new ByteBuffer(bufferSize);
        buffer.put((this.packetId + cipher.rand()) & 0xff, 'byte');
    
        let copyStart = 1;
    
        if (this._packetType === PacketType.VAR_BYTE) {
            buffer.put(packetSize, 'byte');
            copyStart = 2;
        } else if (this._packetType === PacketType.VAR_SHORT) {
            buffer.put(packetSize, 'short');
            copyStart = 3;
        }
    
        this.copy(buffer, copyStart, 0, packetSize);

        return Buffer.from(buffer);
    }

    public get packetId(): number {
        return this._packetId;
    }

    public get packetType(): PacketType {
        return this._packetType;
    }
}
