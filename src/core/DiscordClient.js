import { Client, Collection, REST, Routes } from 'discord.js'
import fs from 'fs'
import path from 'path'

export class DiscordClient extends Client {

    constructor(options) {
        super(options)
        this.slashCommands = new Collection()
        this.setupEvents()
        this.setupSlashCommands()
    }

    async setupEvents() {
        const eventsPath = path.join(__dirname, '../events')
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'))

        if (!eventFiles) return

        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file)
            const { default: EventClass } = await import(filePath)
            console.log(EventClass)
            const eventInstance = new EventClass()

            this.on(eventInstance.name, (...args) => eventInstance.execute(this, ...args))
        }
    }

    async setupSlashCommands() {
        const commandsPath = path.join(__dirname, '../commands')
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
        console.log(commandFiles)

        if (!commandFiles) return

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file)
            console.log(filePath)
            const { default: CommandClass } = await import(filePath)

            console.log(CommandClass)
            break

            const commandInstance = new CommandClass()

            this.slashCommands.set(commandInstance.name, commandInstance)
        }
    }

    async registerSlashCommands() {
        async function putCommands(commands, route) {
            const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN)

            const validRoutes = {
                "GUILD": Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.DEBUG_GUILD_ID),
                "CLIENT": Routes.applicationCommands(process.env.CLIENT_ID),
            }

            try {
                await rest.put(validRoutes[route], { body: commands })
            } catch (error) {
                console.error(error)
            }
        }

        const debugSlashCommandsArray = this.slashCommands.filter(command => command.debug).toJSON()

        if (debugSlashCommandsArray.length) {

            for (let debugCommand of debugSlashCommandsArray) {
                let { client, debug, disable, run, ...debugCommandData } = debugCommand
                
            }

            await putCommands(debugSlashCommandsArray, "GUILD")
        }
    }


}