import { Event } from "../core/Event";
import { DiscordClient } from "../core/DiscordClient";
import { CommandInteraction } from "discord.js";

/**
 * Evento que é acionado quando uma interação é criada.
 * @extends {Event}
 */
export default class InteractionCreateEvent extends Event {
    /**
     * Cria uma nova instância do evento InteractionCreateEvent.
     */
    constructor() {
        super("interactionCreate");
    }

    /**
     * Executa o evento quando uma interação é criada.
     * @param {DiscordClient} client - A instância do cliente customizado do Discord.
     * @param {CommandInteraction} interaction - A interação que foi criada.
     * @returns {Promise<void>}
     */
    async execute(client, interaction) {
        if (!interaction.isCommand()) return;

        const command = client.slashCommands.get(interaction.commandName);

        if (!command) return;

        command.execute(client, interaction);
    }
}
