const auth = require('../auth')
const logger = require('../logger')
const { getPublicIP } = require('../ip')
const aws = require('aws-sdk')
const lambda = new aws.Lambda()

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
    if ( body.type == 2 && body.data.name === 'server' ) {
        return command(body)
    }
    
    return { statusCode: 404 }

}

function command (request) {

    logger.log("command", { request })

    const subcommand = request.data.options[0].name

    switch (subcommand) {
        case 'get':
            return get(req)
    }

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

function get(request) {

    logger.log("get", { request })

    const cluster = process.env.CLUSTER
    const service = process.env.SERVICE

    const ip = getPublicIP(cluster, service)

    return {
        "type": 4,
        "data": {
            "tts": false,
            "content": `${ ip }`,
            "embeds": [],
            "allowed_mentions": { "parse": [] }
        }
    }
}
