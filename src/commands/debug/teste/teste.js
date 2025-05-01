import { CommandInteraction } from "discord.js";
import { DiscordClient } from "@core/DiscordClient";
import { Command } from "@core/Command";
import {
    ContainerBuilder,
    SectionBuilder,
    TextDisplayBuilder,
} from "@builders";

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
        const embedV2 = new ContainerBuilder()
            .setColor("#921AC5")
            .addComponent([
                new TextDisplayBuilder("# Teste\n## Teste\n### Teste"),
                new SectionBuilder()
                    .addTextDisplay(`${interaction.user}`)
                    .addThumbnail({
                        url: interaction.user.displayAvatarURL(),
                        description: `Foto de ${interaction.user.username}`,
                        spoiler: true,
                    }),
            ]);

        interaction.reply({
            flags: ["IsComponentsV2", "Ephemeral"],
            components: [embedV2],
        });
    }
}
