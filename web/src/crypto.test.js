import { webcrypto } from 'node:crypto'
import { decrypt, encrypt, exportKey, generateKey, importRsaKey } from './crypto'
import { derToPem, pemToDer } from './util'
const subtle = webcrypto.subtle
test('generate - export - import', async () => {
    const encryptable = 'token'
    const key = await generateKey(subtle)
    expect(key.publicKey).toBeDefined()
    expect(key.privateKey).toBeDefined()
    const exported = await exportKey(subtle, key)
    const pem = derToPem(exported)
    const der = pemToDer(pem)
    expect(der).toEqual(exported)
    const imported = await importRsaKey(subtle, der);
    const encrypted = await encrypt(subtle, imported, encryptable)
    console.log(encrypted)
    const decrypted = await decrypt(subtle, key.privateKey, encrypted)
    console.log('decrypted', decrypted)
})
