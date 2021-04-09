import { StandardLogger } from 'dexlog'
import { GetPublicIP } from '../backend/GetPublicIP.js'
import { Start as StartServer } from '../backend/Start.js'

export async function Start(request, {
        start = StartServer,
        logger = StandardLogger,
    } = {}) {

    logger.debug("CMD: Start", { request })
    
    const cluster = process.env.CLUSTER
    const service = process.env.SERVICE

    const ip = await start(cluster, service)

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

export async function Stop(request, {
        stop = () => { throw new Error("not implemented") },
        logger = StandardLogger,
    } = {}) {

    logger.debug("CMD: Stop", { request })
    
    const cluster = process.env.CLUSTER
    const service = process.env.SERVICE

    await stop(cluster, service)

    return {
        "type": 4,
        "data": {
            "tts": false,
            "content": `it is done`,
            "embeds": [],
            "allowed_mentions": { "parse": [] }
        }
    }
}

export async function Get(request, {
        getIP = GetPublicIP,
        logger = StandardLogger,
    } = {}) {

    logger.debug("CMD: Get", { request })
    
    const cluster = process.env.CLUSTER
    const service = process.env.SERVICE

    const ip = await getIP(cluster, service)

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
