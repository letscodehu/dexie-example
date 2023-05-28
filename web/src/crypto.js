import { decrypt, exportKey } from 'shared';
import { generateKey } from 'shared';
import { derToPem } from 'shared';
let privKey;
export async function getToken() {
    const key = await generateKey(window.crypto.subtle);
    privKey = key.privateKey;
    const ab = await exportKey(window.crypto.subtle, key);
    const pubKey = derToPem(ab);
    const r = await fetch("http://localhost:8080/token", {
        "method": "POST",
        headers: {
            "Content-Type": "application/json"
        },
        "body": JSON.stringify({ key: pubKey })
    });
    const content = await r.json();
    const token = content.token;
    return await decrypt(window.crypto.subtle, privKey, token);
}
