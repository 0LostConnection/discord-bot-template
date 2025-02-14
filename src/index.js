import { GatewayIntentBits } from 'discord.js'
import { DiscordClient } from './core/DiscordClient'
import * as dotenv from 'dotenv'
dotenv.config()

const botInstance = new DiscordClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
})

botInstance.login(process.env.CLIENT_TOKEN)
