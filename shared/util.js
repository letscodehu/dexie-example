
export function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}
export function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}


/**
    * Binary to base64
    * */
export function atob(string) {
    return Buffer.from(string, 'binary').toString('base64')
}

/**
    * Base64 to binary
    * */
export function btoa(string) {
    return Buffer.from(string, 'base64').toString('binary')
}

export function derToPem(exported) {
    const exportedAsString = ab2str(exported);
    const exportedAsBase64 = atob(exportedAsString);
    return `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
}
export function pemToDer(pem) {
    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY-----";
    const pemContents = pem.substring(
        pemHeader.length,
        pem.length - pemFooter.length
    );
    // base64 decode the string to get the binary data
    const binaryDerString = btoa(pemContents);
    // convert from a binary string to an ArrayBuffer
    return str2ab(binaryDerString);
}
