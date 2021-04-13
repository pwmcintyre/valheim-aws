import { ECSClient, ListTasksCommand, waitForTasksStopped, UpdateServiceCommand } from "@aws-sdk/client-ecs";
import { StandardLogger } from 'dexlog'

export async function Stop (cluster: string, service: string, {
        ecs = new ECSClient({}),
        logger = StandardLogger,
    } = {}): Promise<void> {

    // get tasks
    const tasks = await ecs
        .send(new ListTasksCommand({ cluster, serviceName: service }))
        .then( res => res.taskArns )
    logger.debug("tasks running", { cluster, service, tasks })

    // stop
    await ecs.send(new UpdateServiceCommand({ cluster, service, desiredCount: 0 }))
    logger.debug("stopping", { cluster, service })

    // wait until stopped
    await waitForTasksStopped({client: ecs, maxWaitTime: 120 }, { cluster, tasks })
    logger.debug("service stopped", { cluster, service })

    // respond
    return

}