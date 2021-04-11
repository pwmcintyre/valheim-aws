import { ECS } from 'aws-sdk'
import { StandardLogger } from 'dexlog'

export async function Stop (cluster: string, service: string, {
    ecs = new ECS(),
    logger = StandardLogger,
} = {}): Promise<void> {

// start
await ecs.updateService({ cluster, service, desiredCount: 0 }).promise()
logger.debug("stopping", { cluster, service })

// wait until stable
await ecs.waitFor("servicesInactive", { cluster, services: [service] }).promise()
logger.debug("service inactive", { cluster, service })

// respond
return

}