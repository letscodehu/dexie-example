import { webcrypto } from 'node:crypto'
import { exportKey, generateKey } from './crypto'
import { atob, btoa, ab2str, str2ab, derToPem, pemToDer } from './util'

const subtle = webcrypto.subtle
test('base64 matching', () => {
    const string = 'valami'
    const encoded = atob(string)

    const decoded = btoa(encoded)
    expect(decoded).toBe(string)
})

test('array to string encoding', () => {
    const string = 'valami'
    const arrayBuffer = str2ab(string)
    const actual = ab2str(arrayBuffer)
    expect(actual).toBe(string)
})

test('der to pem back and forth', async () => {
    const key = await generateKey(subtle)
    const exported = await exportKey(subtle, key)
    const pem = derToPem(exported)
    const der = pemToDer(pem)
    expect(exported).toEqual(der)
})
