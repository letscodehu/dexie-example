import { decrypt, exportKey } from 'shared';
import { generateKey } from 'shared';
import { derToPem } from 'shared';
import { Buffer } from 'buffer'
import { applyEncryptionMiddleware, NON_INDEXED_FIELDS } from 'dexie-encrypted';
import Dexie from 'dexie';

// polyfilling the buffer
window.Buffer = Buffer
let privKey;

const db = new Dexie('messenger')
generateKey(window.crypto.subtle).
    then(key => {
        privKey = key.privateKey
        return exportKey(window.crypto.subtle, key)
    })
    .then(ab => derToPem(ab))
    .then((pubKey) =>
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
    .then(token => window.crypto.subtle.digest('SHA-256', Buffer.from(token)))
    .then(ab => new Uint8Array(ab))
    .then(decrypted => applyEncryptionMiddleware(db, decrypted, {
        contacts: NON_INDEXED_FIELDS
    }))
    .then(() => db.version(3).stores({
        contacts: '++id'
    }))
    .then(() => db.open())
    .then(() => db.contacts.add({
        name: 'Maple Joe',
        email: 'maple@joe.com'
    }))
    .then(() => db.contacts.get(1))
    .then(console.log)
    .catch(console.error);
