import { Buffer } from 'buffer'
import { getToken } from "./crypto.js";
import { add, get, init } from './db.js';

// polyfilling the buffer
window.Buffer = Buffer

getToken()
    .then((token) => init(token))
    .then(() => add({
        name: 'Maple Joe',
        email: 'maple@joe.com'
    }))
    .then(() => get(1))
    .then(console.log)
    .catch(console.error);
