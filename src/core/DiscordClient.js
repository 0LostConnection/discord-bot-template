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
         * @param {string} route - A rota para registrar os comandos (DEBUG ou CLIENT).
         * @param {string|null} guildId - ID opcional da guild para registrar comandos.
         * @returns {Promise<void>}
         */
        async function putCommands(commands, route, guildId) {
            if (commands.length === 0) return;

            const rest = new REST({ version: "10" }).setToken(
                process.env.CLIENT_TOKEN,
            );

            let routePath;

            if (route === "DEBUG") {
                routePath = Routes.applicationGuildCommands(
                    process.env.CLIENT_ID,
                    process.env.DEBUG_GUILD_ID,
                );
            } else if (route === "GUILD") {
                routePath = Routes.applicationGuildCommands(
                    process.env.CLIENT_ID,
                    guildId,
                );
            } else if (route === "CLIENT") {
                routePath = Routes.applicationCommands(process.env.CLIENT_ID);
            }

            try {
                await rest.put(routePath, { body: commands });
                console.log(
                    `Registrados ${commands.length} comandos para ${route}${guildId ? ` (Guild ID: ${guildId})` : ""}`,
                );
            } catch (error) {
                console.error(
                    `Erro ao registrar comandos para ${route}${guildId ? ` (Guild ID: ${guildId})` : ""}:`,
                    error,
                );
            }
        }

        // Comandos de debug - enviados para a guild de debug
        const debugSlashCommands = this.slashCommands
            .filter((command) => command.debug)
            .toJSON();

        // Verificar se o bot está na guild Debug
        const debugGuild = this.guilds.cache.get(process.env.DEBUG_GUILD_ID);
        if (!debugGuild) {
            console.warn(
                `Comandos de debug não serão registrados: Bot não está na guild Debug (ID: ${process.env.DEBUG_GUILD_ID})`,
            );
        } else {
            await putCommands(debugSlashCommands, "DEBUG");
        }

        // Comandos específicos de guild - agrupados por guildId
        const guildSpecificCommands = new Collection();

        // Agrupar comandos por guildId
        this.slashCommands.forEach((command) => {
            if (!command.debug && command.guildId) {
                // Para cada guildId no array de guildIds do comando
                for (const guildId of command.guildId) {
                    // Verificar se o bot está na guild
                    const guild = this.guilds.cache.get(guildId);

                    if (!guild) {
                        console.warn(
                            `Comando "${command.name}" não será registrado: Bot não está na guild ${guildId}`,
                        );
                        continue;
                    }

                    if (!guildSpecificCommands.has(guildId)) {
                        guildSpecificCommands.set(guildId, []);
                    }
                    guildSpecificCommands.get(guildId).push(command);
                }
            }
        });

        // Registrar comandos para cada guild específica
        for (const [guildId, commands] of guildSpecificCommands.entries()) {
            await putCommands(commands, "GUILD", guildId);
        }

        // Comandos globais - disponíveis em todas as guilds
        const globalSlashCommands = this.slashCommands
            .filter((command) => !command.debug && !command.guildId)
            .toJSON();

        await putCommands(globalSlashCommands, "CLIENT");

        // Verificar guilds que o bot está mas não tem comandos registrados
        // Limpar esses comandos enviando um array vazio
        const rest = new REST({ version: "10" }).setToken(
            process.env.CLIENT_TOKEN
        );

        for (const guild of this.guilds.cache.values()) {
            // Pular guilds que já têm comandos específicos ou a guild de debug
            if (guildSpecificCommands.has(guild.id) || guild.id === process.env.DEBUG_GUILD_ID) {
                continue;
            }

            try {
                const routePath = Routes.applicationGuildCommands(
                    process.env.CLIENT_ID,
                    guild.id
                );
                await rest.put(routePath, { body: [] });
                console.log(`Limpados comandos para guild sem registros específicos (Guild ID: ${guild.id})`);
            } catch (error) {
                console.error(
                    `Erro ao limpar comandos para guild (ID: ${guild.id}):`,
                    error
                );
            }
        }
    }
}
