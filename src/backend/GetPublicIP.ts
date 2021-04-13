import { EC2Client, DescribeNetworkInterfacesCommand } from "@aws-sdk/client-ec2";
import { ECSClient, ListTasksCommand, DescribeTasksCommand, waitForTasksRunning } from "@aws-sdk/client-ecs";

export const ErrNotRunning = new Error("not running")

export async function GetPublicIP (cluster: string, service: string, {
    ecs = new ECSClient({}),
    ec2 = new EC2Client({}),
} = {}) {

    const tasks = await ecs
        .send(new ListTasksCommand({ cluster, serviceName: service }))
        .then( res => res.taskArns )

    if ( tasks.length === 0 ) throw ErrNotRunning
    
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

    return ip

}
