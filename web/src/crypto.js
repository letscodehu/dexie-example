import { atob, btoa, ab2str, str2ab, pemToDer } from './util'

export function generateKey(subtle) {
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

export function exportKey(subtle, key) {
    return subtle.exportKey('spki', key.publicKey)
}
export function importRsaKey(subtle, binaryDer) {

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

export async function encrypt(subtle, key, plainText) {
    const encrypted = await subtle.encrypt({
        name: "RSA-OAEP"
    }, key,
        Buffer.from(plainText)
    )
    return atob(encrypted);
}

export function decrypt(subtle, privKey, token) {
    const buffer = str2ab(btoa(token))
    return subtle.decrypt({
        name: "RSA-OAEP",
    }
        , privKey, buffer)
    .then(r => ab2str(r))
}
