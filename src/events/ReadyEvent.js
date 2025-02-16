import { Event } from "../core/Event";
import { DiscordClient } from "../core/DiscordClient";

/**
 * Evento que é acionado quando o bot está pronto.
 * @extends {Event}
 */
export default class ReadyEvent extends Event {
    /**
     * Cria uma nova instância do evento ReadyEvent.
     */
    constructor() {
        super("ready");
    }

    /**
     * Executa o evento quando o bot está pronto.
     * @param {DiscordClient} client - A instância do cliente customizado do Discord.
     * @returns {Promise<void>}
     */
    async execute(client) {
        await client.registerSlashCommands();
        console.log(`${client.user?.tag} is ready!`);
    }
}