/**
 * Referenced the color convert page from the RS Wiki
 * https://runescape.wiki/w/Module:Color_convert
 */

export enum JagexColor {
    RED = 63488,
    YELLOW = 65504,
    GREEN = 2016,
    CYAN = 2047,
    BLACK = 0,
    WHITE = 65535
}

export class ColorConverter {

  // TODO: Eventually add in some RGB -> HSB, HSB -> RBG, etc.

  public static rgbToJagex(red: number, green: number, blue: number): number {
      return ((red & 0x1f) << 11) | ((green & 0x3f) << 5) | (blue & 0x1f) << 0;
  }
}