import { decrypt, exportKey } from 'shared';
import { generateKey } from 'shared';
import { derToPem } from 'shared';
let privKey;
export function getToken() {
    return generateKey(window.crypto.subtle).
        then(key => {
            privKey = key.privateKey
            return exportKey(window.crypto.subtle, key)
        })
        .then(ab => derToPem(ab))
        .then(pubKey =>
            fetch("http://localhost:8080/token", {
                "method": "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                "body": JSON.stringify({ key: pubKey })
            }))
        .then(r => r.json())
        .then(content => content.token)
        .then(token => decrypt(window.crypto.subtle, privKey, token))
}
