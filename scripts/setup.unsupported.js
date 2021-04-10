const Discord = require('discord');
const client = new Discord.Client();

const token = process.env.DISCORD_TOKEN
const guild = process.env.DISCORD_GUILD

// https://discord.com/developers/docs/interactions/slash-commands#subcommands-and-subcommand-groups
const config = {
    "name": "server",
    "description": "Get or edit permissions for a user or a role",
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

client.on('ready', () => {
    console.log('before')
    client.api.applications(client.user.id).commands.post({ data: config });
    console.log('after')
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(token);
