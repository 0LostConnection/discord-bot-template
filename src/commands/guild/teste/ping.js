import { CommandInteraction } from "discord.js";
import { Command } from "../../../core/Command";

/**
 * Comando que responde com "Pong!".
 * @extends {Command}
 */
export default class PingCommand extends Command {
    /**
     * Cria uma nova instância do comando Ping.
     */
    constructor() {
        super();
        this.setName("ping");
        this.setDescription('Responde com "Pong!"');
        this.setGuildOnly(false);
        this.setDisabled(false);
    }

    /**
     * Executa o comando Ping.
     * @param {DiscordClient} client - A instância do cliente customizado do Discord.
     * @param {CommandInteraction} interaction - A interação que acionou o comando.
     */
    execute(client, interaction) {
        interaction.reply("Pong!");
    }
}
