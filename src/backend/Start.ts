import { ECS, EC2 } from 'aws-sdk'
import { StandardLogger } from 'dexlog'

// up handler
export async function Start (cluster: string, service: string, {
        ecs = new ECS(),
        ec2 = new EC2(),
        logger = StandardLogger,
    } = {}) {

    // start
    await ecs.updateService({ cluster, service, desiredCount: 1 }).promise()
    logger.debug("started", { cluster, service })

    // wait until stable
    await ecs.waitFor("servicesStable", { cluster, services: [service] }).promise()
    logger.debug("service stable", { cluster, service })

    // get task
    const task = await ecs.listTasks({ cluster, serviceName: service }).promise()
        .then(res => res.taskArns[0])

    // wait until task stable / get ENI
    const eni = await ecs.waitFor("tasksRunning", { cluster, tasks: [task] }).promise()
        .then(res => res.tasks[0].attachments[0].details.filter(a => a.name == "networkInterfaceId")[0].value)
    logger.debug("task stable", { cluster, service, task })

    // get PublicIP
    const ip = await ec2.describeNetworkInterfaces({ NetworkInterfaceIds: [eni] }).promise()
        .then(res => res.NetworkInterfaces[0].Association.PublicIp)

    // respond
    return ip

}