const BASE_37_CHARS = ['_', 'a', 'b', 'c', 'd',
    'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q',
    'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3',
    '4', '5', '6', '7', '8', '9', '!', '@', '#', '$', '%', '^', '&',
    '*', '(', ')', '-', '+', '=', ':', ';', '.', '>', '<', ',', '"',
    '[', ']', '|', '?', '/', '`'];

export const encodeBase37Username = (username: string): bigint => {
    let l: bigint = BigInt(0);

    for (let i = 0; i < username.length && i < 12; i++) {
        const c = username.charAt(i);
        const cc = username.charCodeAt(i);
        l *= BigInt(37);
        if (c >= 'A' && c <= 'Z') l += BigInt((1 + cc) - 65);
        else if (c >= 'a' && c <= 'z') l += BigInt((1 + cc) - 97);
        else if (c >= '0' && c <= '9') l += BigInt((27 + cc) - 48);
    }
    while (l % BigInt(37) == BigInt(0) && l != BigInt(0)) l /= BigInt(37);
    return l;
};

export const decodeBase37Username = (nameLong: BigInt): string => {
    let ac: string = '';
    while(nameLong !== BigInt(0)) {
        const l1 = nameLong;
        nameLong = BigInt(nameLong as any) / BigInt(37);
        ac += BASE_37_CHARS[parseInt(l1.toString()) - parseInt(nameLong.toString()) * 37];
    }

    return ac.split('').reverse().join('');
};
