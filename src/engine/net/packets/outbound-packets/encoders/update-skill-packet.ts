import { ByteBuffer } from '@runejs/common';
import { Packet } from '../../packet';
import { OutboundPacket } from '../../packets';

interface UpdateSkillData {
    skillId: number;
    skillLevel: number;
    skillExperience: number;
}

export const updateSkillPacket: OutboundPacket<UpdateSkillData> = {
    name: 'updateSkill',
    opcodes: {
        254: 136,
        289: 154,
        319: 211,
        357: 200,
    },
    encoders: {
        254: (player, opcode, data) => {
            const packet = new Packet(136);
            packet.put(data.skillId, 'byte');
            packet.put(data.skillExperience, 'int');
            packet.put(data.skillLevel, 'byte');

            return packet;
        },
        289: (player, opcode, data) => {
            const packet = new Packet(154);
            packet.put(data.skillId, 'byte');
            packet.put(data.skillExperience, 'int');
            packet.put(data.skillLevel, 'byte');

            return packet;
        },
        319: (player, opcode, data) => {
            const packet = new Packet(211);
            packet.put(data.skillExperience, 'int');
            packet.put(data.skillLevel, 'byte');
            packet.put(data.skillId, 'byte');
            return packet;
        },
        357: (player, opcode, data) => {
            const packet = new Packet(200);
            packet.put(data.skillId, 'byte');
            packet.put(data.skillLevel, 'byte');
            packet.put(data.skillExperience, 'int', 'le');
            return packet;
        },        
    },
};
