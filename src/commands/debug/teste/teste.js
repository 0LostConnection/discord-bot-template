import { CommandInteraction } from "discord.js";

import { DiscordClient } from "@core/DiscordClient";
import { Command } from "@core/Command";
import t_ContainerBuilder from "@builders/ContainerBuilder";

/**
 * Comando de teste do builder de container
 * extends {Command}
 */
export default class Teste extends Command {
    constructor() {
        super();
        this.setName("teste");
        this.setDescription("DEBUG: Teste Container Builder");
        this.setDebug(true);
    }

    /**
     * Executa o comando UserInfo.
     * @param {DiscordClient} client - A instância do cliente customizado do Discord.
     * @param {CommandInteraction} interaction - A interação que acionou o comando.
     */
    execute(client, interaction) {
        const container = new t_ContainerBuilder();

        container.setColor("#34d2eb").addTextDisplayComponent("Teste");

        interaction.reply({
            flags: ["IsComponentsV2", "Ephemeral"],
            components: [container.build()],
        });
    }
}
