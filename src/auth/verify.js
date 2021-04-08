// https://discord.com/developers/docs/interactions/slash-commands#security-and-authorization
const nacl = require('tweetnacl');

exports.verify = (key, signature, timestamp, body) => {

    return nacl.sign.detached.verify(
        Buffer.from(timestamp + body),
        Buffer.from(signature, 'hex'),
        Buffer.from(key, 'hex')
    )

}
