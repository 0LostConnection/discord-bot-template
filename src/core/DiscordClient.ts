import { Client, GatewayIntentBits } from 'discord.js'
import { Event } from './Event'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config()

export class DiscordClient {
    private client: Client

    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers
            ]
        })

        this.setupEvents();
    }

    private async setupEvents(): Promise<void> {
        const eventsPath = path.join(__dirname, '../events')
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts'))

        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file)
            const { default: eventClass } = await import(filePath);


            const eventInstance: Event = new eventClass()
            this.client.on(eventInstance.name, eventInstance.execute)


        }
    }

    public start(): void {
        this.client.login(process.env.CLIENT_TOKEN)
    }
}