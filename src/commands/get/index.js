import log from '../../logger/index.js'
import { GetPublicIP } from '../../ip/index.js'

export async function Get(request, getFn = GetPublicIP) {

    log("get", { request })

    const cluster = process.env.CLUSTER
    const service = process.env.SERVICE

    const ip = await getFn(cluster, service)

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
