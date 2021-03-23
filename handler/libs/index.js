const AWS = require('aws-sdk')

module.exports.GetVars = function(env = process.env, ...keys) {
    return keys.map( key => {
        if ( !(key in env) ) { throw new Error(`missing env var ${ key }`) }
        return env[key]
    })
}

module.exports.ServiceUp = async function(cluster, service, ecs = new AWS.ECS(), ec2 = new AWS.EC2()) {
    await ecs.updateService({ cluster, service, desiredCount: 1 }).promise()
    await ecs.waitFor("servicesStable", { cluster, services: [service] }).promise()
    const task = await ecs.listTasks({ cluster, serviceName: service }).promise().then( res => {
        console.log("listTasks", JSON.stringify(res))
        return res.taskArns[0]
    })
    const eni = await ecs.waitFor("tasksRunning", { cluster, tasks: [task] }).promise().then( res => {
        console.log("waitFor", JSON.stringify(res))
        return res.tasks[0].attachments[0].details.filter( a => a.name == "networkInterfaceId" )[0].value
    })
    const ip = await ec2.describeNetworkInterfaces({ NetworkInterfaceIds: [eni] }).promise().then( res => {
        console.log("describeNetworkInterfaces", JSON.stringify(res))
        return res.NetworkInterfaces[0].Association.PublicIp
    })
    return ip
}

module.exports.ServiceDown = async function(ecs = new AWS.ECS(), cluster, service) {
    return ecs.updateService({ cluster, service, desiredCount: 0 }).promise().then( _ => null )
}

module.exports.GetPassword = async function(SecretId, secrets = new AWS.SecretsManager()) {
    return secrets.getSecretValue({ SecretId }).promise().then( res => {
        const value = res.SecretString
        const blob = JSON.parse( value )
        return blob["password"]
    })
}
