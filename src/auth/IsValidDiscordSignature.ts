// https://discord.com/developers/docs/interactions/slash-commands#security-and-authorization
import nacl = require('tweetnacl')

export function IsValidDiscordSignature (key: string, signature: string, timestamp: string, body: string) {

    return nacl.sign.detached.verify(
        Buffer.from(timestamp + body),
        Buffer.from(signature, 'hex'),
        Buffer.from(key, 'hex')
    )

}
