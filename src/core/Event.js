import { DiscordClient } from "./DiscordClient";

/**
 * Classe base para todos os eventos do bot.
 */
export class Event {
    /**
     * Cria uma nova instância de um evento.
     * @param {string} name - O nome do evento.
     */
    constructor(name) {
        /**
         * O nome do evento.
         * @type {string}
         */
        this.name = name;
    }

    /**
     * Método a ser implementado por cada evento específico.
     * @param {DiscordClient} client - A instância do cliente customizado do Discord.
     * @param {...any} args - Os argumentos passados para o evento.
     * @throws {Error} Se o método não for implementado no evento específico.
     */
    execute(client, ...args) {
        throw new Error(
            `Execute method not implemented in event: ${this.name}`,
        );
    }
}