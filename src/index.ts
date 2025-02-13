import { Client, GatewayIntentBits } from 'discord.js'
import * as dotenv from 'dotenv'

dotenv.config()

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
    ]
})

client.once('ready', () => {
    console.log(`Bot está online como ${client.user?.tag}`)
})

client.login(process.env.CLIENT_TOKEN)