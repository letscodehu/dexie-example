
export function ab2str(buf: ArrayBuffer): string {
    return String.fromCharCode.apply(null, Array.from<number>(new Uint8Array(buf)));
}
export function str2ab(str: string): ArrayBuffer {
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
export function atob(binary: any): string {
    return Buffer.from(binary, 'binary').toString('base64')
}

/**
    * Base64 to binary
    * */
export function btoa(base64: string): string {
    return Buffer.from(base64, 'base64').toString('binary')
}

export function derToPem(exported: ArrayBuffer): string {
    const exportedAsString = ab2str(exported);
    const exportedAsBase64 = atob(exportedAsString);
    return `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
}
export function pemToDer(pem: string): ArrayBuffer {
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
