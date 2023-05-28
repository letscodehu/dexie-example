import { decrypt, exportKey } from 'shared';
import { generateKey } from 'shared';
import { derToPem } from 'shared';
let privKey: CryptoKey;
export async function getToken(): Promise<string> {
    const key: CryptoKeyPair = await generateKey(window.crypto.subtle);
    privKey = key.privateKey;
    const ab: ArrayBuffer = await exportKey(window.crypto.subtle, key);
    const pubKey: string = derToPem(ab);
    const response = await fetch("http://localhost:8080/token", {
        "method": "POST",
        headers: {
            "Content-Type": "application/json"
        },
        "body": JSON.stringify({ key: pubKey })
    });
    const content = await response.json();
    const token: string = content.token;
    return await decrypt(window.crypto.subtle, privKey, token);
}
