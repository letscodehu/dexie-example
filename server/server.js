const express = require('express')
const { subtle } = require('node:crypto').webcrypto
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()

app.use(express.json())
app.use(bodyParser.json())
app.use(cors({
    credentials: true,
    methods: 'OPTIONS,POST'
}))
app.post('/token', (req, res) => {
    const key = req.body.key
    console.log(key)

    res.send({
        token: encryptText(key, "token")
    })
})
async function encryptText(pem, plainText) {
    const key = await importRsaKey(pem)
    const encrypted = await subtle.encrypt({
        name: "RSA-OAEP"
    }, key,
        Buffer.from(plainText)
    )
    return Buffer.from(encrypted).toString('base64');

}
app.listen(8080)
