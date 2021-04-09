import { StandardLogger } from 'dexlog'
import IsValidDiscordSignature from './IsValidDiscordSignature.js'
import * as commands from '../commands/commands.js'

exports.handler = async function (event, context) {

    context = { awsRequestId: context.awsRequestId }
    const logger = StandardLogger.With({ context })
    logger.debug("api handler", { event })

    // verify signature
    const key = process.env.DISCORD_PUBLIC_KEY
    const signature = event.headers['x-signature-ed25519']
    const timestamp = event.headers['x-signature-timestamp']
    if ( !IsValidDiscordSignature(key, signature, timestamp, event.body) ) {
        logger.info("unverified", { signature, timestamp, body })
        return { statusCode: 401 }
    }

    // handle discord ping
    const body = JSON.parse(event.body)
    if (body.type == 1) {
        logger.info("ping")
        return { type: 1 }
    }

    // handle server commands
    if ( body.type == 2 && body.data.name === 'server' ) {
        logger.info("cmd: server")
        return command(body)
    }

    logger.info("unknown")
    return { statusCode: 404 }

}

function command (request) {

    const subcommand = request.data.options[0].name

    switch (subcommand) {

        case 'start':
            return commands.Start(req)

        case 'stop':
            return commands.Stop(req)

        case 'get':
            return commands.Get(req)

        default:
            return {
                "type": 4,
                "data": {
                    "tts": false,
                    "content": "unknown command",
                    "embeds": [],
                    "allowed_mentions": { "parse": [] }
                }
            }

    }

}
