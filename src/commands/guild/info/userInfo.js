import {
    ActionRowBuilder,
    CommandInteraction,
    ContainerBuilder,
    SectionBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    ButtonBuilder,
    ButtonStyle,
    User,
    TextDisplayBuilder,
    ThumbnailBuilder,
} from "discord.js";

import { DiscordClient } from "@core/DiscordClient";
import { Command } from "@core/Command";
/**
 * Comando que responde um informações do usuário.
 * extends {Command}
 */
export default class UserInfo extends Command {
    constructor() {
        super();
        this.setName("user-info");
        this.setDescription("Informações do usuário.");
        this.setDebug(true);
        this.addUserOption((option) =>
            option
                .setName("usuario")
                .setDescription(
                    "O usuário para o qual você deseja obter informações.",
                )
                .setRequired(false),
        );
    }

    /**
     * Executa o comando UserInfo.
     * @param {DiscordClient} client - A instância do cliente customizado do Discord.
     * @param {CommandInteraction} interaction - A interação que acionou o comando.
     */
    execute(client, interaction) {
        /**
         * Obtém o usuário da interação e lida com os dois tipos possíveis: User ou GuildMember
         * @type {User} - Usuário
         */
        const user = interaction.options.getUser("usuario") || interaction.user;

        // Obtém a data de criação da conta do usuário
        const accountCreatedAt = new Date(
            user.createdTimestamp,
        ).toLocaleDateString("pt-BR");

        // Obtém a data de entrada do usuário no servidor
        const memberJoinedAt = new Date(
            interaction.guild.members.cache.get(user.id).joinedTimestamp,
        ).toLocaleDateString("pt-BR");

        // Cria a sessão com informações do usuário
        const section = new SectionBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    `### Informações do usuário ${user}`,
                ),
                new TextDisplayBuilder().setContent(
                    `**ID:** \`${user.id}\`\n**Conta Criada:** \`${accountCreatedAt}\`\n**Entrou em:** \`${memberJoinedAt}\``,
                ),
            )
            .setThumbnailAccessory(
                new ThumbnailBuilder().setURL(
                    user.displayAvatarURL({ size: 1024, extension: "png" }),
                ),
            );

        // Cria um separador
        const separator = new SeparatorBuilder()
            .setDivider(true)
            .setSpacing(SeparatorSpacingSize.Small);

        // Botões com a imagem e o perfil do usuário
        const actionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("Imagem do usuário")
                .setURL(user.displayAvatarURL({ size: 1024, extension: "png" }))
                .setStyle(ButtonStyle.Link),

            new ButtonBuilder()
                .setLabel("Abrir Perfil")
                .setURL(`https://discord.com/users/${user.id}`)
                .setStyle(ButtonStyle.Link),
        );

        // Cria um container para os componentes
        const container = new ContainerBuilder({
            accent_color: 16711680,
            components: [section, separator, actionRow],
        });

        interaction.reply({
            flags: ["IsComponentsV2", "Ephemeral"],
            components: [container],
        });
    }
}
