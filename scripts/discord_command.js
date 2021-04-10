const fetch = require('node-fetch')
async function main (api, config, token) {

    const body = JSON.stringify(config)
    console.log("posting", {api, body})
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
    "name": "server",
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
            "name": "get",
            "description": "Get details",
            "type": 2, // 2 is type SUB_COMMAND_GROUP
            "options": [
                {
                    "name": "ip",
                    "description": "Get public IP",
                    "type": 1
                }
            ]
        }
    ]
}

const config2 = {
  "name": "penguin",
  "description": "Send a GIF of a penguin",
  "options": [
      {
          "name": "breed",
          "description": "The breed of penguin",
          "type": 3,
          "required": true,
          "choices": [
              {
                  "name": "Magellanic",
                  "value": "magellanic"
              },
              {
                  "name": "Emperor",
                  "value": "emperor"
              },
              {
                  "name": "Chinstrap",
                  "value": "chinstrap"
              },
              {
                  "name": "Gentoo",
                  "value": "gentoo"
              }
          ]
      },
      {
          "name": "stickers",
          "description": "Whether to show only stickers",
          "type": 5,
          "required": false
      }
  ]
}


main(api, config, token)
