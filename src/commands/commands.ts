import { StandardLogger } from 'dexlog'
import { GetPublicIP } from '../backend/GetPublicIP'
import { Start as StartServer } from '../backend/Start'

export async function Start(request: any, {
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
    } as any
}

export async function Stop(request: any, {
        stop = (..._: any) => { throw new Error("not implemented") },
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
    } as any
}

export async function Get(request: any, {
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
    } as any

}