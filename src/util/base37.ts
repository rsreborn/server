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
