export interface Appearance {
    bodyType: number;
    head: number;
    torso: number;
    arms: number;
    legs: number;
    hands: number;
    feet: number;
    facialHair: number;
    hairColor: number;
    torsoColor: number;
    legColor: number;
    feetColor: number;
    skinColor: number;
}

export const defaultAppearance = (): Appearance => {
    return {
        bodyType: 0,
        head: 0,
        torso: 18,
        arms: 26,
        legs: 36,
        hands: 33,
        feet: 42,
        facialHair: 10,
        hairColor: 0,
        torsoColor: 0,
        legColor: 0,
        feetColor: 0,
        skinColor: 0
    } as Appearance;
};
