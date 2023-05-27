import { applyEncryptionMiddleware, NON_INDEXED_FIELDS } from 'dexie-encrypted';
import Dexie from 'dexie';

const db = new Dexie('messenger')

export async function init(token) {
    const ab = await window.crypto.subtle.digest('SHA-256', Buffer.from(token));
    const decrypted = new Uint8Array(ab);
    applyEncryptionMiddleware(db, decrypted, {
        contacts: NON_INDEXED_FIELDS
    });
    db.version(3).stores({
        contacts: '++id'
    });
    return await db.open();
}

export function add(contact) {
    return db.contacts.add(contact)
}
export function get(id) {
    return db.contacts.get(id)
}
