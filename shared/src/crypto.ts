import { atob, btoa, ab2str, str2ab } from './util'

export function generateKey(subtle: SubtleCrypto): Promise<CryptoKeyPair> {
    return subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
    )
}

export function exportKey(subtle: SubtleCrypto, key: CryptoKeyPair): Promise<ArrayBuffer> {
    return subtle.exportKey('spki', key.publicKey)
}
export function importRsaKey(subtle: SubtleCrypto, binaryDer: ArrayBuffer | Uint8Array): Promise<CryptoKey> {
    return subtle.importKey(
        "spki",
        binaryDer,
        {
            hash: "SHA-256",
            name: "RSA-OAEP"
        },
        false,
        ["encrypt"]
    );
}

export async function encrypt(subtle: SubtleCrypto, key: CryptoKey, plainText: string): Promise<string> {
    const encrypted = await subtle.encrypt({
        name: "RSA-OAEP"
    }, key,
        Buffer.from(plainText)
    )
    return atob(encrypted);
}

export async function decrypt(subtle: SubtleCrypto, privKey: CryptoKey, token: string): Promise<string> {
    const buffer = str2ab(btoa(token))
    const r = await subtle.decrypt({
        name: "RSA-OAEP",
    },
        privKey, buffer);
    return ab2str(r);
}
