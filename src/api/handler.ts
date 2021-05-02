import { StandardLogger } from 'dexlog'
import { IsValidDiscordSignature } from '../auth/IsValidDiscordSignature'
import * as commands from '../commands/commands'
import { Context } from 'aws-lambda'
import { Invoke } from '../commands/invoke'

// waiting for new release ... this type is only on master :(
// https://github.com/discordjs/discord.js/blob/master/typings/index.d.ts#L2259
// import { APIRawMessage } from 'discord.js'
// import * as discord from 'discord.js'

export async function handler (event: any, lambdacontext: Context) {

    const context = { awsRequestId: lambdacontext.awsRequestId }
    const logger = StandardLogger.with({ context })
    logger.debug("api handler", { event })

    // verify signature
    const key = process.env.DISCORD_PUBLIC_KEY
    const signature = event.headers['x-signature-ed25519']
    const timestamp = event.headers['x-signature-timestamp']
    if ( !IsValidDiscordSignature(key, signature, timestamp, event.body) ) {
        logger.info("unverified", { signature, timestamp, body: event.body })
        return { statusCode: 401 }
    }

    // handle discord ping
    const body = JSON.parse(event.body)
    if (body.type == 1) {
        logger.info("ping")
        return { type: 1 }
    }

    // handle server commands
    if ( body.type == 2 && body.data.name === 'valheim' ) {
        logger.debug("invoking command", { body })
        await Invoke(body)
        return { "type": 5 } as any
    }

    logger.info("unknown")
    return { statusCode: 404 }

}
