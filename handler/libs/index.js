const AWS = require('aws-sdk')

module.exports.GetVars = function(env = process.env, ...keys) {
    return keys.map( key => {
        if ( !(key in env) ) { throw new Error(`missing env var ${ key }`) }
        return env[key]
    })
}

module.exports.ServiceUp = async function(ecs = new AWS.ECS(), cluster, service) {
    await ecs.updateService({ cluster, service, desiredCount: 1 }).promise()
    return ecs.waitFor("servicesStable", { cluster, service }).promise().then( res => {
        return res.tasks[0].attachments[0].details.filter( a => a.name == "networkInterfaceId" )[0].value
    })
}

module.exports.ServiceDown = async function(ecs = new AWS.ECS(), cluster, service) {
    return ecs.updateService({ cluster, service, desiredCount: 0 }).promise().then( _ => null )
}

module.exports.GetPassword = async function(secrets = new AWS.SecretsManager(), secret) {
    return secrets.getSecretValue({ SecretId: process.env.SECRET }).promise().then( res => {
        const value = res.SecretString
        const blob = JSON.parse( value )
        return blob["password"]
    })
}
