// https://discord.com/developers/docs/interactions/slash-commands#security-and-authorization
import nacl from 'tweetnacl'

export function IsValidDiscordSignature (key, signature, timestamp, body) {

    return nacl.sign.detached.verify(
        Buffer.from(timestamp + body),
        Buffer.from(signature, 'hex'),
        Buffer.from(key, 'hex')
    )

}
