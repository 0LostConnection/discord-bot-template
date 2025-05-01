import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    CommandInteraction,
    MediaGalleryBuilder,
    MediaGalleryItemBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    TextDisplayBuilder,
} from "discord.js";
import { DiscordClient } from "@core/DiscordClient";
import { Command } from "@core/Command";
import {
    ContainerBuilder_,
    SectionBuilder_,
    TextDisplayBuilder_,
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
        const componentsArray = [
            new TextDisplayBuilder_("# Teste\n## Teste\n### Teste"),
            new SectionBuilder_()
                .addTextDisplay(`${interaction.user}\nTeste\nTeste\nTeste00`)
                .addTextDisplay(`Teste 1`)
                .addTextDisplay(`Teste 2`)
                .addThumbnail({
                    url: interaction.user.displayAvatarURL(),
                    description: `Foto de ${interaction.user.username}`,
                    spoiler: true,
                }),
            new SectionBuilder_()
                .addTextDisplay(`${interaction.user}\nTeste\nTeste\nTeste00`)
                .addTextDisplay(new TextDisplayBuilder_("teste1"))
                .addTextDisplay(new TextDisplayBuilder().setContent("Teste2"))
                .setAccessory(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setEmoji("✴")
                        .setLabel("Imagem do Usuário")
                        .setURL(
                            interaction.user.displayAvatarURL({
                                extension: "png",
                                size: 1024,
                            }),
                        ),
                ),

            new MediaGalleryBuilder().addItems(
                new MediaGalleryItemBuilder()
                    .setURL(
                        "https://previews.123rf.com/images/imagecatalogue/imagecatalogue1611/imagecatalogue161116759/66637610-test-text-rubber-seal-stamp-watermark-tag-inside-rounded-rectangular-banner-with-grunge-design-and.jpg",
                    )
                    .setDescription("Teste"),
            ),
            new TextDisplayBuilder_("### Lorem ipsum dolor sit amet"),
            new SeparatorBuilder({
                divider: true,
                spacing: SeparatorSpacingSize.Large,
            }),
        ];

        const embedV2 = new ContainerBuilder_()
            .setColor("#921AC5")
            .addComponents(componentsArray);

        interaction.reply({
            flags: ["IsComponentsV2", "Ephemeral"],
            components: [embedV2, ...componentsArray],
        });
    }
}
