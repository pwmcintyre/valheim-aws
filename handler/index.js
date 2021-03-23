const AWS = require('aws-sdk')
const { GetVars, ServiceUp, ServiceDown, GetPassword } = require('./libs')
const ecs = new AWS.ECS()
const secrets = new AWS.SecretsManager()

// up handler
exports.up = async () => {

    // get env vars
    const [ CLUSTER, SERVICE, SECRET ] = GetVars(process.env, [
        "CLUSTER",
        "SERVICE",
        "SECRET",
    ])

    // start
    const ip = await ServiceUp(ecs, CLUSTER, SERVICE)

    // get password
    const password = await GetPassword(secrets, SECRET)

    // respond
    return { message: "done" , ip, password }

}

// down handler
exports.down = async () => {

    // get env vars
    const [ CLUSTER, SERVICE ] = GetVars(process.env, [
        "CLUSTER",
        "SERVICE",
    ])
    
    // stop
    await ServiceDown(ecs, CLUSTER, SERVICE)

    // respond
    return { message: "done" }

}
