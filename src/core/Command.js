import { SlashCommandBuilder } from "discord.js";

/**
 * Classe base para todos os comandos do bot.
 * @extends {SlashCommandBuilder}
 */
export class Command extends SlashCommandBuilder {
    /**
     * Cria uma nova instância de um comando.
     * @throws {Error} Se a classe Command for instanciada diretamente.
     */
    constructor() {
        super();
        if (this.constructor === Command) {
            throw new Error(
                "A classe Command não pode ser instanciada diretamente.",
            );
        }

        /**
         * Indica se o comando está em modo de depuração.
         * @type {boolean}
         */
        this.debug = false;

        /**
         * ID específico da guild onde o comando deve ser registrado.
         * Se definido, o comando só será disponível nesta guild.
         * @type {string|null}
         */
        this.guildId = null;

        /**
         * Indica se o comando está desabilitado.
         * @type {boolean}
         */
        this.disabled = false;
    }

    /**
     * Define o(s) ID(s) da(s) guild(s) específica(s) para este comando.
     * @param {string|string[]} id - ID ou array de IDs das guilds onde o comando deve ser registrado.
     * @returns {Command} A instância atual do comando para encadeamento de métodos.
     */
    setGuildId(id) {
        // Converter um único ID para array
        if (typeof id === "string") {
            this.guildId = [id];
        }
        // Se for um array, usar diretamente
        else if (Array.isArray(id)) {
            this.guildId = id;
        }
        // Se não for string nem array, definir como null
        else {
            this.guildId = null;
        }

        // Se algum guildId for definido, o comando automaticamente se torna guildOnly
        if (this.guildId && this.guildId.length > 0) {
            this.guildOnly = true;
        }

        return this;
    }

    /**
     * Define se o comando está em modo de depuração.
     * @param {boolean} boolean - Valor booleano indicando o modo de depuração.
     * @returns {Command} A instância atual do comando para encadeamento de métodos.
     */
    setDebug(boolean) {
        this.debug = boolean;
        return this; // Permite encadeamento de métodos
    }

    /**
     * Define se o comando está desabilitado.
     * @param {boolean} boolean - Valor booleano indicando se o comando está desabilitado.
     * @returns {Command} A instância atual do comando para encadeamento de métodos.
     */
    setDisabled(boolean) {
        this.disabled = boolean;
        return this; // Permite encadeamento de métodos
    }

    /**
     * Método a ser implementado por cada comando específico.
     * @param {Client} client - A instância do cliente do Discord.
     * @param {Interaction} interaction - A interação que acionou o comando.
     * @throws {Error} Se o método não for implementado no comando específico.
     */
    execute(client, interaction) {
        throw new Error(
            `O método execute não foi implementado no comando: ${this.name}`,
        );
    }
}
