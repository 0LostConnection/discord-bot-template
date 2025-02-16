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
         * Indica se o comando é específico de uma guild.
         * @type {boolean}
         */
        this.guildOnly = false;

        /**
         * Indica se o comando está desabilitado.
         * @type {boolean}
         */
        this.disabled = false;
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
     * Define se o comando é específico de uma guild.
     * @param {boolean} boolean - Valor booleano indicando se o comando é específico de uma guild.
     * @returns {Command} A instância atual do comando para encadeamento de métodos.
     */
    setGuildOnly(boolean) {
        this.guildOnly = boolean;
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
