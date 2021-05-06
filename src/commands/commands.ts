import { GetPublicIP } from '../backend/GetPublicIP'
import { Start as StartServer } from '../backend/Start'
import { Stop as StopServer } from '../backend/Stop'
import { UpdateMessageFn } from './handler'

export async function Start(request: any, update: UpdateMessageFn, {
        start = StartServer,
    } = {}): Promise<any> {
    await update("starting server ...")
    const cluster = process.env.CLUSTER
    const service = process.env.SERVICE
    const ip = await start(cluster, service)
    await update(`IP: ${ ip }`)
}

export async function Stop(request: any, update: UpdateMessageFn, {
        stop = StopServer,
    } = {}): Promise<any> {
    await update("stopping server ...")
    const cluster = process.env.CLUSTER
    const service = process.env.SERVICE
    await stop(cluster, service)
    await update("server stopped")
}

export async function Get(request: any, update: UpdateMessageFn, {
        getIP = GetPublicIP,
    } = {}): Promise<void> {
    await update("fetching details ...")
    const cluster = process.env.CLUSTER
    const service = process.env.SERVICE
    const ip = await getIP(cluster, service)
    await update(`IP: ${ ip }`)

}
