import { StandardLogger } from 'dexlog'
import * as commands from '../commands/commands'
import { Context } from 'aws-lambda'
import fetch from 'node-fetch'

// TODO: this is not required; the same as event.application_id
const application_id = process.env.DISCORD_APPLICATION_ID

// waiting for new release ... this type is only on master :(
// https://github.com/discordjs/discord.js/blob/master/typings/index.d.ts#L2259
// import { APIRawMessage } from 'discord.js'
// import * as discord from 'discord.js'

export async function handler (event: any, lambdacontext: Context) {

    const context = { awsRequestId: lambdacontext.awsRequestId }
    const logger = StandardLogger.with({ context })
    logger.debug("command handler", { event })

    // handle server commands
    if ( event.type == 2 && event.data.name === 'server' ) {
        logger.info("cmd: server")
        const response = command(event)

        // respond
        // https://discord.com/developers/docs/interactions/slash-commands#followup-messages
        // PATCH /webhooks/<application_id>/<interaction_token>/messages/@original to edit your initial response to an Interaction
        // DELETE /webhooks/<application_id>/<interaction_token>/messages/@original to delete your initial response to an Interaction
        // POST /webhooks/<application_id>/<interaction_token> to send a new followup message
        // PATCH /webhooks/<application_id>/<interaction_token>/messages/<message_id> to edit a message sent with that token
        // const url = `https://discord.com/api/v8/interactions/${ event.id }/${ event.token }/callback`
        const url = `https://discord.com/webhooks/${ application_id }/${ event.token }/messages/@original`
        const body = JSON.stringify(response)
        try {
            const result = await fetch(url, {
                method: 'patch',
                body:    JSON.stringify(response),
                headers: { 'Content-Type': 'application/json' },
            })
            logger.info("success", { result: result.json() })
            return
        } catch (error: unknown) {
            logger.error("failed to update interation", { error, url, body })
            throw new Error("failed to update interation")
        }
    }

    logger.info("unknown")
    throw new Error("unknown command")

}

function command (request: any /* TODO: APIRawMessage  */ ) {

    const subcommand = request.data.options[0].name

    switch (subcommand) {

        case 'start':
            return commands.Start(request)

        case 'stop':
            return commands.Stop(request)

        case 'get':
            return commands.Get(request)

        default:
            return {
                "type": 4,
                "data": {
                    "content": "unknown command",
                }
            } as any // TODO: what is this type??

    }

}
