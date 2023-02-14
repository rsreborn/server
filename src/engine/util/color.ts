/**
 * Referenced the color convert page from the RS Wiki
 * https://runescape.wiki/w/Module:Color_convert
 */

export enum JagexColor {
    RED = 16711680,
    YELLOW = 16776960,
    GREEN = 65280,
    CYAN = 65535
}

export class ColorConverter {

    public static rgbToJagex(red: number, green: number, blue: number): number {

        // const args = this.rgbToHsb(red, green, blue);
        // let hue = (args[0]);
        // let sat = (args[1]);
        // let lum = (args[2]);

        // let encode_hue = hue * 63;
        // let encode_sat = sat * 7;
        // let encode_lum = lum * 127;

    //     let r = (red >> 1) & 0x1f; 
    //    let g =  (green >> 1) & 0x1f; 
    //    let b = (blue >> 1) & 0x1f;

        // return (encode_hue << 10) | (encode_sat << 7) | (encode_lum);
        //return ((r << 10) | (g << 5) | b);
        return ((red & 0x1f) << 11) | ((green & 0x3f) << 5) | (blue & 0x1f) << 0;
    }

    public static getHsl(hue: number, saturation: number, lightness: number) {
        return hue << 10 | saturation << 7 | lightness;
    }

    private static rgbToHsb(r, g, b) {
        r /= 256;
        g /= 256;
        b /= 256;
        const v = Math.max(r, g, b),
          n = v - Math.min(r, g, b);
        const h =
          n === 0 ? 0 : n && v === r ? (g - b) / n : v === g ? 2 + (b - r) / n : 4 + (r - g) / n;
        return [60 * (h < 0 ? h + 6 : h), v && (n / v) * 100, v * 100];
      };
      
}