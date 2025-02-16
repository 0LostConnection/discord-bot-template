import { Client, Collection, REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";

/**
 * Classe que estende o cliente do Discord.js para adicionar funcionalidades específicas.
 * @extends {Client}
 */
export class DiscordClient extends Client {
    /**
     * Cria uma nova instância do DiscordClient.
     * @param {Object} options - As opções para configurar o cliente do Discord.
     */
    constructor(options) {
        super(options);

        /**
         * Coleção de comandos de barra (slash commands) do bot.
         * @type {Collection<string, Command>}
         */
        this.slashCommands = new Collection();

        this.setupEvents();
        this.setupSlashCommands();
    }

    /**
     * Configura os eventos do bot.
     * @async
     * @returns {Promise<void>}
     */
    async setupEvents() {
        const eventsPath = path.join(__dirname, "../events");
        const eventFiles = fs
            .readdirSync(eventsPath)
            .filter((file) => file.endsWith(".js"));

        if (!eventFiles) return;

        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file);
            const { default: EventClass } = await import(filePath);

            const eventInstance = new EventClass();

            this.on(eventInstance.name, (...args) =>
                eventInstance.execute(this, ...args),
            );
        }
    }

    /**
     * Configura os comandos de barra (slash commands) do bot.
     * @async
     * @returns {Promise<void>}
     */
    async setupSlashCommands() {
        const commandsPath = path.join(__dirname, "../commands");
        const categories = fs.readdirSync(commandsPath);

        for (const category of categories) {
            const categoryPath = path.join(commandsPath, category);
            const subcategories = fs.readdirSync(categoryPath);

            for (const subcategory of subcategories) {
                const subcategoryPath = path.join(categoryPath, subcategory);
                const commandFiles = fs
                    .readdirSync(subcategoryPath)
                    .filter((file) => file.endsWith(".js"));

                for (const file of commandFiles) {
                    const filePath = path.join(subcategoryPath, file);
                    const { default: CommandClass } = await import(filePath);

                    const commandInstance = new CommandClass();

                    if (commandInstance.disabled) continue;

                    commandInstance.category = category;
                    commandInstance.subcategory = subcategory;

                    this.slashCommands.set(
                        commandInstance.name,
                        commandInstance,
                    );
                }
            }
        }
    }

    /**
     * Registra os comandos de barra (slash commands) do bot.
     * @async
     * @returns {Promise<void>}
     */
    async registerSlashCommands() {
        /**
         * Função auxiliar para registrar comandos.
         * @async
         * @param {Array<Object>} commands - Os comandos a serem registrados.
         * @param {string} route - A rota para registrar os comandos (DEBUG, GUILD ou CLIENT).
         * @returns {Promise<void>}
         */
        async function putCommands(commands, route) {
            const rest = new REST({ version: "10" }).setToken(
                process.env.CLIENT_TOKEN,
            );

            const validRoutes = {
                DEBUG: Routes.applicationGuildCommands(
                    process.env.CLIENT_ID,
                    process.env.DEBUG_GUILD_ID,
                ),
                GUILD: Routes.applicationGuildCommands(
                    process.env.CLIENT_ID,
                    process.env.GUILD_ID,
                ),
                CLIENT: Routes.applicationCommands(process.env.CLIENT_ID),
            };

            try {
                await rest.put(validRoutes[route], { body: commands });
            } catch (error) {
                console.error(error);
            }
        }

        const debugSlashCommandsArray = this.slashCommands
            .filter((command) => command.debug)
            .toJSON();

        if (debugSlashCommandsArray.length) {
            await putCommands(debugSlashCommandsArray, "DEBUG");
        }

        const guildSlashCommandsArray = this.slashCommands
            .filter((command) => command.guildOnly)
            .toJSON();

        if (guildSlashCommandsArray.length) {
            await putCommands(guildSlashCommandsArray, "GUILD");
        }

        const globalSlashCommandsArray = this.slashCommands
            .filter((command) => !command.guildOnly)
            .toJSON();

        if (globalSlashCommandsArray.length) {
            await putCommands(globalSlashCommandsArray, "CLIENT");
        }
    }
}
