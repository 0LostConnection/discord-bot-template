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
     * Adiciona um TextDisplay à seção.
     *
     * @param {string|TextDisplayComponent|TextDisplayBuilder} content - O texto a ser exibido ou um componente TextDisplay/builder
     * @returns {SectionBuilder} Esta instância, para encadeamento de métodos
     * @throws {Error} Se o componente não for do tipo TextDisplay
     *
     * @example
     * ```javascript
     * // Usando uma string simples
     * section.addTextDisplay("Este é um texto de exemplo");
     * 
     * // Usando um builder
     * section.addTextDisplay(new TextDisplayBuilder("Texto formatado"));
     * 
     * // Usando um objeto JSON
     * section.addTextDisplay({
     *   type: ComponentType.TextDisplay,
     *   content: "Texto via objeto"
     * });
     * ```
     */
    addTextDisplay(content) {
        let component;
        
        // Se for uma string, cria um TextDisplayBuilder
        if (typeof content === 'string') {
            component = new TextDisplayBuilder(content);
        } 
        // Se for um builder, usa seus dados
        else if (content.data) {
            component = content.data;
        } 
        // Caso contrário, assume que é um objeto JSON direto
        else {
            component = content;
        }
        
        // Verifica se é um TextDisplay
        if (component.type !== ComponentType.TextDisplay) {
            throw new Error("Only TextDisplay components can be added to a SectionBuilder");
        }
        
        // Adiciona o componente
        this.components.push(component);
        return this;
    }

    /**
     * Define o acessório da seção (Thumbnail ou Button).
     *
     * @param {Object|ThumbnailBuilder|ButtonBuilder} accessory - Um componente Thumbnail ou Button, ou um objeto JSON com os dados
     * @returns {SectionBuilder} Esta instância, para encadeamento de métodos
     * @throws {Error} Se o acessório não for do tipo Thumbnail ou Button
     *
     * @example
     * ```javascript
     * // Usando um builder
     * const thumbnail = new ThumbnailBuilder().setURL("https://example.com/image.png");
     * section.setAccessory(thumbnail);
     *
     * // Usando um objeto JSON
     * section.setAccessory({
     *   type: ComponentType.Thumbnail,
     *   url: "https://example.com/image.png"
     * });
     * ```
     */
    setAccessory(accessory) {
        // Se for um builder, pegamos os dados do builder
        if (accessory.data) {
            this.accessory = accessory.data;
            return this;
        }

        // Se for um objeto JSON diretamente
        if (
            !accessory.type ||
            (accessory.type !== ComponentType.Thumbnail &&
                accessory.type !== ComponentType.Button)
        ) {
            throw new Error(
                "Only Thumbnail or Button components can be added as accessory to a SectionBuilder",
            );
        }

        this.accessory = accessory;
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