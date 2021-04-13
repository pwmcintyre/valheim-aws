import { ECS } from 'aws-sdk'
import { StandardLogger } from 'dexlog'

export async function Stop (cluster: string, service: string, {
        ecs = new ECS(),
        logger = StandardLogger,
    } = {}): Promise<void> {

    // get tasks
    const tasks = await ecs.listTasks({ cluster, serviceName: service }).promise()
        .then(res => res.taskArns || [])

    // stop
    await ecs.updateService({ cluster, service, desiredCount: 0 }).promise()
    logger.debug("stopping", { cluster, service })

    // wait until stopped
    await ecs.waitFor("tasksStopped", { cluster, tasks }).promise()
    logger.debug("service stopped", { cluster, service })

    // respond
    return

}