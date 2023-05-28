import { applyEncryptionMiddleware, clearAllTables, NON_INDEXED_FIELDS } from 'dexie-encrypted';
import Dexie, { PromiseExtended } from 'dexie';

class Database extends Dexie {
    contacts!: Dexie.Table<IContact, number>;
    constructor() {
        super('messenger')
        this.version(3).stores({
            contacts: '++id'
        });
    }
}
const db = new Database

export async function init(token: string): Promise<Dexie> {
    const ab = await window.crypto.subtle.digest('SHA-256', Buffer.from(token));
    const decrypted = new Uint8Array(ab);
    applyEncryptionMiddleware(db, decrypted, {
        contacts: NON_INDEXED_FIELDS
    }, clearAllTables);
    return await db.open();
}

export function add(contact: IContact): PromiseExtended<number> {
    return db.contacts.add(contact)
}
export function get(id: number): PromiseExtended<IContact | undefined> {
    return db.contacts.get(id)
}

interface IContact {
    id?: number,
    name: string,
    email: string
}

