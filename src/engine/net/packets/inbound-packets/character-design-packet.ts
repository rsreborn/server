import { Appearance } from '@engine/world/player/appearance';
import { ByteBuffer, logger } from '@runejs/common';
import { Player } from '../../../world/player';
import { InboundPacket } from '../packets';

interface CharacterDesignData {
    bodyType: number;
    headModel: number;
    jawModel: number;
    torsoModel: number;
    armsModel: number;
    handsModel: number;
    legsModel: number;
    feetModel: number;
    hairColor: number;
    torsoColor: number;
    legsColor: number;
    feetColor: number;
    skinColor: number;
}

export const characterDesignPacket: InboundPacket<CharacterDesignData> = {
    name: 'character-design',
    handler: (
        player: Player,
        data: CharacterDesignData,
    ): void => {
        try {
            player.appearance = {
                bodyType: data.bodyType,
                head: data.headModel,
                torso: data.torsoModel,
                arms: data.armsModel,
                legs: data.legsModel,
                hands: data.handsModel,
                feet: data.feetModel,
                facialHair: data.jawModel,
                hairColor: data.hairColor,
                torsoColor: data.torsoColor,
                legColor: data.legsColor,
                feetColor: data.feetColor,
                skinColor: data.skinColor,                
            } as Appearance;
            player.sync.appearanceUpdate = true;
        } catch (e) {
            logger.error(e);
        }
    },
    opcodes: {
        254: 13,

    },
    decoders: {
        254: (opcode: number, data: ByteBuffer) => {
            const bodyType = data.get('byte');

            const headModel = data.get('byte');
            const jawModel = data.get('byte');
            const torsoModel = data.get('byte');
            const armsModel = data.get('byte');
            const handsModel = data.get('byte');
            const legsModel = data.get('byte');
            const feetModel = data.get('byte');
            
            const hairColor = data.get('byte');
            const torsoColor = data.get('byte');
            const legsColor = data.get('byte');
            const feetColor = data.get('byte');
            const skinColor = data.get('byte');

            return { bodyType, headModel, jawModel, torsoModel, armsModel, handsModel, legsModel, feetModel, 
                hairColor, torsoColor, legsColor, feetColor, skinColor };
        },
    },
};
