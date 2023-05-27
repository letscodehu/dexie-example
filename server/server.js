import express, { json } from 'express'
import { webcrypto } from 'node:crypto'
const { subtle } = webcrypto
import cors from 'cors'
import parser from 'body-parser'
import { encrypt, importRsaKey, pemToDer } from 'shared'

const app = express()

app.use(json())
app.use(parser.json())
app.use(cors({
    credentials: true,
    methods: 'OPTIONS,POST'
}))
app.post('/token', async (req, res) => {
    const key = await importRsaKey(subtle, pemToDer(req.body.key))
    const encrypted = await encrypt(subtle, key, "token")
    res.send({
        token: encrypted
    })
})
app.listen(8080)
