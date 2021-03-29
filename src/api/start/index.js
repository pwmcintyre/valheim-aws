const auth = require('../../auth')
const logger = require('../../logger')

exports.handler = async (event, context) => {

    logger.log("event", { event })

    // verify signature
    const key = process.env.DISCORD_PUBLIC_KEY
    const signature = event.headers['x-signature-ed25519']
    const timestamp = event.headers['x-signature-timestamp']
    if ( !auth.verify(key, signature, timestamp, event.body) ) {
        logger.log("unverified", { signature, timestamp, body })
        return { statusCode: 401 }
    }

    // handle discord ping
    const body = JSON.parse(event.body)
    if (body.type == 1) {
        logger.log("ping", { body })
        return { type: 1 }
    }

    // handle other
    logger.log("default", { event, body })
    return {
        "type": 4,
        "data": {
            "tts": false,
            "content": "Congrats on sending your command!",
            "embeds": [],
            "allowed_mentions": { "parse": [] }
        }
    }

}
