import { CommandInteraction } from "discord.js";
import { Command } from "@core/Command";

/**
 * Comando que responde com "Ping!".
 * @extends {Command}
 */
export default class PongCommand extends Command {
    /**
     * Cria uma nova instância do comando Pong.
     */
    constructor() {
        super();
        this.setName("pong");
        this.setDescription('Responde com "Ping!"');
        this.setDebug(true);
        this.setDisabled(false);
    }

    /**
     * Executa o comando Pong.
     * @param {DiscordClient} client - A instância do cliente customizado do Discord.
     * @param {CommandInteraction} interaction - A interação que acionou o comando.
     */
    execute(client, interaction) {
        interaction.reply("Ping!");
    }
}
