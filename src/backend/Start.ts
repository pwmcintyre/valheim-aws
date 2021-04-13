import { EC2Client, DescribeNetworkInterfacesCommand } from "@aws-sdk/client-ec2";
import { ECSClient, ListTasksCommand, DescribeTasksCommand, waitForTasksRunning, UpdateServiceCommand } from "@aws-sdk/client-ecs";
import { StandardLogger } from 'dexlog'

export const ErrNotRunning = new Error("not running")

async function sleep(ms:number){
    return new Promise(resolve => setTimeout(resolve, ms))
}

export async function Start (cluster: string, service: string, {
        ecs = new ECSClient({}),
        ec2 = new EC2Client({}),
        logger = StandardLogger,
    } = {}) {

    // start
    await ecs.send(new UpdateServiceCommand({ cluster, service, desiredCount: 1 }))
    logger.debug("started", { cluster, service })

    // get tasks
    let tasks: string[] = []
    while ( tasks.length === 0 ) {
        await sleep(1000)
        tasks = await ecs
            .send(new ListTasksCommand({ cluster, serviceName: service }))
            .then( res => res.taskArns )
    }

    // wait until task stable
    await waitForTasksRunning({client: ecs, maxWaitTime: 120 }, { cluster, tasks })

    // get ENI
    const eni = await ecs.send(new DescribeTasksCommand({ cluster, tasks }))
        .then( res => {
            return res.tasks[0].attachments[0].details
                .filter( a => a.name == "networkInterfaceId" )[0].value
        })

    // get PublicIP
    const ip = await ec2
        .send( new DescribeNetworkInterfacesCommand({ NetworkInterfaceIds: [eni] }) )
        .then( res => res.NetworkInterfaces[0].Association.PublicIp )

    // respond
    return ip

}