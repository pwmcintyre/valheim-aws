import { StandardLogger } from 'dexlog'
import { GetPublicIP } from '../ip/getPublicIP.js'

export async function Get(request, {getFn = GetPublicIP, logger = StandardLogger } = {}) {

    logger.debug("Get Command", { request })
    
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
