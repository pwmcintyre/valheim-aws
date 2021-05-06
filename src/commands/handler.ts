import { StandardLogger } from 'dexlog'
import * as commands from '../commands/commands'
import { Context } from 'aws-lambda'
import fetch from 'node-fetch'

// waiting for new release ... this type is only on master :(
// https://github.com/discordjs/discord.js/blob/master/typings/index.d.ts#L2259
// import { APIRawMessage } from 'discord.js'
// import * as discord from 'discord.js'

export async function handler (event: any, lambdacontext: Context) {

    const context = { awsRequestId: lambdacontext.awsRequestId }
    const logger = StandardLogger.with({ context })
    logger.debug("command handler", { event })

    // setup updater func
    const url = `https://discord.com/api/webhooks/${ event.application_id }/${ event.token }/messages/@original`
    const updateFn = async function(message: any) {
        const body = JSON.stringify({ "content": message })
        return fetch(url, {
            method: 'patch',
            headers: { 'Content-Type': 'application/json' },
            body,
        }).then( result => {
            logger.debug("interation updated", { result, url, body })
        }).catch( error => {
            logger.error("failed to update interation", { error, url, body })
        })
    }

    // handle server commands
    if ( event.type == 2 && event.data.name === 'valheim' ) {
        logger.info("cmd: server")
        try {
            await command(event, updateFn)
            return
        } catch (error: unknown) {
            await updateFn(`command failure, try again later? 🤷‍♀️`)
            throw error
        }
    }

    throw new Error("unknown command")

}

export type UpdateMessageFn = (body: string) => Promise<void>;
export type Command = (request: any, fn: UpdateMessageFn) => Promise<void>;
export const ErrUnknownCommand = new Error("command not implemented")
async function command (
    request: any, // TODO: APIRawMessage
    update: UpdateMessageFn,
) {

    const subcommand = request.data.options[0].name

    switch (subcommand) {

        case 'start':
            return commands.Start(request, update)

        case 'stop':
            return commands.Stop(request, update)

        case 'describe':
            return commands.Get(request, update)

        default:
            throw ErrUnknownCommand

    }

}
