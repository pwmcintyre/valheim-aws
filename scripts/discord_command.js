const fetch = require('node-fetch')
async function main (api, config, token) {

    const body = JSON.stringify(config)
    console.log("posting", {api, body, token})
    const response = await fetch(api, {
        method: 'post',
        body,
        headers: {
            'Authorization': 'Bot ' + token,
            'Content-Type': 'application/json'
        }
    })
    const json = await response.json()

    console.log("response", JSON.stringify(json))
}

const token = process.env.DISCORD_TOKEN
const application_id = process.env.DISCORD_APPLICATION_ID
const guild = process.env.DISCORD_GUILD
const api = `https://discord.com/api/v8/applications/${ application_id }/guilds/${ guild }/commands`

const config = {
    "name": "valheim",
    "description": "control your server",
    "options": [
        {
            "name": "start",
            "description": "Start server",
            "type": 1 // 1 is type SUB_COMMAND
        },
        {
            "name": "stop",
            "description": "Stop server",
            "type": 1
        },
        {
            "name": "describe",
            "description": "Describe server",
            "type": 1
        }
    ]
}

main(api, config, token)
