import { Packet } from '../../packet';
import { OutboundPacket } from '../../packets';

// Todo: Actually come up with names for these lol...
interface UpdateCameraData {

}

export const updateCameraPacket: OutboundPacket<UpdateCameraData> = {
    name: 'updateCamera',
    opcodes: {
        254: 225,
    },
    encoders: {
        254: (player, opcode, data) => {
            const packet = new Packet(225);
            packet.put(2); // in and out
            packet.put(5); // Shake
            packet.put(120); // up and down
            packet.put(2); // Speed
            return packet;
        }
    },
};
