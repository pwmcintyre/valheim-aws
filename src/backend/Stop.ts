import { ECS } from 'aws-sdk'
import { StandardLogger } from 'dexlog'

export async function Stop (cluster: string, service: string, {
    ecs = new ECS(),
    logger = StandardLogger,
} = {}): Promise<void> {

// start
await ecs.updateService({ cluster, service, desiredCount: 0 }).promise()
logger.debug("stopping", { cluster, service })

// get task
const tasks = await ecs.listTasks({ cluster, serviceName: service }).promise()
    .then(res => res.taskArns)

// wait until stable
if ( tasks.length > 0 ) {
    await ecs.waitFor("tasksStopped", { cluster, tasks }).promise()
}
logger.debug("tasks stopped", { cluster, tasks })

// respond
return

}