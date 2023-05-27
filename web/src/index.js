let privKey;
window.crypto.subtle.generateKey(
    {
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
)
    .then(function(key) {
        privKey = key.privateKey;
        return window.crypto.subtle.exportKey('spki', key.publicKey)
    })
    .then(function(exported) {
        const exportedAsString = ab2str(exported);
        const exportedAsBase64 = window.btoa(exportedAsString);
        return `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
    })
    .then(function(pubKey) {
        return fetch("http://localhost:8080/token", {
            "method": "POST",
            headers: {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({ key: pubKey })
        }).then(r => r.json())
            .then(content => content.token)
            .then(token => {
                const buffer = new TextEncoder().encode(window.atob(token))
                return window.crypto.subtle.decrypt({
                    name: "RSA-OAEP",
                    modulusLength: 4096,
                    publicExponent: new Uint8Array([1, 0, 1]),
                    hash: "SHA-256",
                }
                    , privKey, buffer)
            })
            .then(console.log)
    })
    .catch(function(err) {
        console.error(err);
    });
