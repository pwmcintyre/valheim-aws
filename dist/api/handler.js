"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const dexlog_1 = require("dexlog");
const IsValidDiscordSignature_1 = require("./IsValidDiscordSignature");
const commands = require("../commands/commands");
// waiting for new release ... this type is only on master :(
// https://github.com/discordjs/discord.js/blob/master/typings/index.d.ts#L2259
// import { APIRawMessage } from 'discord.js'
// import * as discord from 'discord.js'
async function handler(event, lambdacontext) {
    const context = { awsRequestId: lambdacontext.awsRequestId };
    const logger = dexlog_1.StandardLogger.with({ context });
    logger.debug("api handler", { event });
    // verify signature
    const key = process.env.DISCORD_PUBLIC_KEY;
    const signature = event.headers['x-signature-ed25519'];
    const timestamp = event.headers['x-signature-timestamp'];
    if (!IsValidDiscordSignature_1.IsValidDiscordSignature(key, signature, timestamp, event.body)) {
        logger.info("unverified", { signature, timestamp, body: event.body });
        return { statusCode: 401 };
    }
    // handle discord ping
    const body = JSON.parse(event.body);
    if (body.type == 1) {
        logger.info("ping");
        return { type: 1 };
    }
    // handle server commands
    if (body.type == 2 && body.data.name === 'server') {
        logger.info("cmd: server");
        return command(body);
    }
    logger.info("unknown");
    return { statusCode: 404 };
}
exports.handler = handler;
function command(request /* TODO: APIRawMessage  */) {
    const subcommand = request.data.options[0].name;
    switch (subcommand) {
        case 'start':
            return commands.Start(request);
        case 'stop':
            return commands.Stop(request);
        case 'get':
            return commands.Get(request);
        default:
            return {
                "type": 4,
                "data": {
                    "tts": false,
                    "content": "unknown command",
                    "embeds": [],
                    "allowed_mentions": { "parse": [] }
                }
            }; // TODO: what is this type??
    }
}
//# sourceMappingURL=handler.js.map