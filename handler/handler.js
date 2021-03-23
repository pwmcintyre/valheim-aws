const AWS = require('aws-sdk')
const ecs = new AWS.ECS()
const secrets = new AWS.SecretsManager()
const ec2 = new AWS.EC2()

// up handler
exports.handler = async () => {

    // get env vars
    const cluster = process.env.CLUSTER
    const service = process.env.SERVICE
    const SecretId = process.env.SECRET

    // start
    await ecs.updateService({ cluster, service, desiredCount: 1 }).promise()

    // wait until stable
    await ecs.waitFor("servicesStable", { cluster, services: [service] }).promise()
    
    // get task
    const task = await ecs.listTasks({ cluster, serviceName: service }).promise()
        .then( res => res.taskArns[0] )
    
    // wait until task stable / get ENI
    const eni = await ecs.waitFor("tasksRunning", { cluster, tasks: [task] }).promise()
        .then( res => res.tasks[0].attachments[0].details.filter( a => a.name == "networkInterfaceId" )[0].value )
    
    // get PublicIP
    const ip = await ec2.describeNetworkInterfaces({ NetworkInterfaceIds: [eni] }).promise()
        .then( res => res.NetworkInterfaces[0].Association.PublicIp )

    // get password
    const password = await secrets.getSecretValue({ SecretId }).promise()
        .then( res => {
            const value = res.SecretString
            const blob = JSON.parse( value )
            return blob["password"]
        })

    // respond
    return { message: "done" , ip, password }

}
