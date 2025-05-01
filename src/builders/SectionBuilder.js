import {
    ComponentType,
    TextDisplayComponent,
    ThumbnailBuilder,
    ActionRowBuilder,
    ButtonBuilder,
} from "discord.js";
import TextDisplayBuilder from "./TextDisplayBuilder";

/**
 * Builder para criar componentes do tipo Section para Discord.js.
 * Uma Section pode conter componentes TextDisplay e um acessório (Thumbnail ou ActionRow).
 *
 * @example
 * ```javascript
 * // Criar uma seção com texto e thumbnail
 * const section = new SectionBuilder()
 *    .addTextDisplay("Este é o título")
 *    .addTextDisplay("Este é o conteúdo")
 *    .addThumbnail({
 *        url: "https://example.com/image.png",
 *        description: "Exemplo de imagem"
 *    });
 *
 * // Criar uma seção com texto e botões
 * const buttons = new ActionRowBuilder()
 *    .addComponents(
 *        new ButtonBuilder().setCustomId('primary').setLabel('Clique aqui'),
 *        new ButtonBuilder().setCustomId('secondary').setLabel('Opção 2')
 *    );
 *
 * const section = new SectionBuilder()
 *    .addTextDisplay("Título com botões")
 *    .setAccessory(buttons);
 *
 * // Adicionar à um container
 * container.addComponent(section);
 * ```
 */
export default class SectionBuilder {
    /**
     * Cria uma nova instância do SectionBuilder.
     */
    constructor() {
        /**
         * @type {ComponentType.Section} O tipo do componente
         */
        this.type = ComponentType.Section;

        /**
         * @type {Array<TextDisplayComponent>} Array de componentes text display
         */
        this.components = [];

        /**
         * @type {?ThumbnailBuilder|ActionRowBuilder<ButtonBuilder>} O acessório da seção (ThumbnailBuilder ou ActionRowBuilder contendo ButtonBuilder)
         */
        this.accessory = null;

        // Propriedade que não aparece na serialização mas contém referência ao container
        Object.defineProperty(this, "section", {
            get: function () {
                return this;
            },
            enumerable: false, // Não aparece em for...in loops e não será serializado
        });
    }

    /**
     * Adiciona um componente TextDisplay à seção.
     *
     * @param {TextDisplayComponent|Array<TextDisplayComponent>} component - Um TextDisplay único ou array deles
     * @returns {SectionBuilder} Esta instância, para encadeamento de métodos
     * @throws {Error} Se o componente não for do tipo TextDisplay
     *
     * @example
     * ```javascript
     * section.addComponent(new TextDisplayBuilder("Texto"));
     * ```
     */
    addComponent(component) {
        if (Array.isArray(component)) {
            // Verifica se todos os componentes são TextDisplay
            for (const comp of component) {
                if (comp.type !== ComponentType.TextDisplay) {
                    throw new Error(
                        "Only TextDisplay components can be added to a SectionBuilder",
                    );
                }
            }
            // Se for um array, adiciona cada componente individualmente
            this.components.push(...component);
        } else {
            // Verifica se é um TextDisplay
            if (component.type !== ComponentType.TextDisplay) {
                throw new Error(
                    "Only TextDisplay components can be added to a SectionBuilder",
                );
            }
            // Se for um único componente, adiciona normalmente
            this.components.push(component);
        }
        return this;
    }

    /**
     * Adiciona múltiplos componentes TextDisplay à seção.
     *
     * @param {Array<TextDisplayComponent>} components - Array de componentes TextDisplay
     * @returns {SectionBuilder} Esta instância, para encadeamento de métodos
     * @throws {Error} Se não for um array ou se algum componente não for do tipo TextDisplay
     *
     * @example
     * ```javascript
     * section.addComponents([
     *    new TextDisplayBuilder("Título"),
     *    new TextDisplayBuilder("Subtítulo")
     * ]);
     * ```
     */
    addComponents(components) {
        if (!Array.isArray(components)) {
            components = [components]; // Transforma em array se não for
        }

        // Verifica se todos os componentes são TextDisplay
        for (const component of components) {
            if (component.type !== ComponentType.TextDisplay) {
                throw new Error(
                    "Only TextDisplay components can be added to a SectionBuilder",
                );
            }
        }

        this.components.push(...components);
        return this;
    }

    /**
     * Define o acessório da seção (Thumbnail ou ActionRow).
     *
     * @param {Object} accessory - Um componente Thumbnail ou ActionRow
     * @returns {SectionBuilder} Esta instância, para encadeamento de métodos
     * @throws {Error} Se o acessório não for do tipo Thumbnail ou ActionRow
     *
     * @example
     * ```javascript
     * const thumbnail = new ThumbnailBuilder().setURL("https://example.com/image.png");
     * section.setAccessory(thumbnail);
     * ```
     */
    setAccessory(accessory) {
        if (
            accessory.type !== ComponentType.Thumbnail &&
            accessory.type !== ComponentType.ActionRow
        ) {
            throw new Error(
                "Only Thumbnail or ActionRow components can be added as accessory to a SectionBuilder",
            );
        }

        // Se for ActionRow, verificar se contém apenas botões
        if (accessory.type === ComponentType.ActionRow) {
            if (!accessory.components || !accessory.components.length) {
                throw new Error(
                    "ActionRow must contain at least one Button component",
                );
            }

            for (const component of accessory.components) {
                if (component.type !== ComponentType.Button) {
                    throw new Error(
                        "ActionRow in a Section can only contain Button components",
                    );
                }
            }
        }

        this.accessory = accessory;
        return this;
    }

    /**
     * Adiciona um novo TextDisplay com o conteúdo especificado.
     * Método de conveniência que cria um TextDisplayBuilder internamente.
     *
     * @param {string} content - O texto a ser exibido
     * @returns {SectionBuilder} Esta instância, para encadeamento de métodos
     *
     * @example
     * ```javascript
     * section.addTextDisplay("Este é um texto de exemplo");
     * ```
     */
    addTextDisplay(content) {
        const textDisplayComponent = new TextDisplayBuilder(content);
        this.components.push(textDisplayComponent);
        return this;
    }

    /**
     * Adiciona um Thumbnail à seção como acessório.
     *
     * @param {Object} options - Opções do thumbnail
     * @param {string} options.url - URL da imagem
     * @param {string} [options.description] - Descrição opcional da imagem
     * @param {boolean} [options.spoiler=false] - Se a imagem deve ser tratada como spoiler
     * @returns {SectionBuilder} Esta instância, para encadeamento de métodos
     *
     * @example
     * ```javascript
     * section.addThumbnail({
     *    url: "https://example.com/image.png",
     *    description: "Uma imagem de exemplo",
     *    spoiler: false
     * });
     * ```
     */
    addThumbnail({ url, description, spoiler = false }) {
        const thumbnailComponent = new ThumbnailBuilder().setURL(url);

        if (description) {
            thumbnailComponent.setDescription(description);
        }

        if (spoiler) {
            thumbnailComponent.setSpoiler(spoiler);
        }

        this.accessory = thumbnailComponent;
        return this;
    }

    /**
     * Método que define como a classe deve ser serializada para JSON.
     * Garante que apenas as propriedades necessárias sejam incluídas na serialização.
     *
     * @returns {Object} O objeto Section pronto para ser serializado
     */
    toJSON() {
        return {
            type: this.type,
            components: this.components,
            accessory: this.accessory,
        };
    }
}
