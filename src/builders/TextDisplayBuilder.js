import { ComponentType } from "discord.js";

/**
 * Builder para criar componentes do tipo TextDisplay para Discord.js.
 * 
 * @example
 * ```javascript
 * // Criar com conteúdo diretamente no construtor
 * const text = new TextDisplayBuilder("Olá Mundo!");
 * 
 * // Ou criar vazio e definir depois
 * const text = new TextDisplayBuilder()
 *    .setContent("Olá Mundo!");
 * 
 * // Usar diretamente em um container
 * container.addComponent(text);
 * ```
 */
export default class TextDisplayBuilder {
    /**
     * Cria uma nova instância do TextDisplayBuilder.
     * 
     * @param {string} [content] - Conteúdo opcional para o TextDisplay. 
     * Se não fornecido, será necessário chamar setContent() depois.
     */
    constructor(content) {
        /**
         * @type {ComponentType.TextDisplay} O tipo do componente
         */
        this.type = ComponentType.TextDisplay;
        
        /**
         * @type {string|undefined} O conteúdo de texto a ser exibido
         */
        this.content = content;
        
        // Propriedade que não aparece na serialização mas contém referência ao container
        Object.defineProperty(this, "textdisplay", {
            get: function () {
                return this;
            },
            enumerable: false, // Não aparece em for...in loops e não será serializado
        });
    }

    /**
     * Define o conteúdo do TextDisplay.
     * 
     * @param {string} content - O texto a ser exibido no componente
     * @returns {TextDisplayBuilder} Esta instância, para encadeamento de métodos
     * 
     * @example
     * ```javascript
     * textDisplay.setContent("Este é um texto de exemplo");
     * ```
     */
    setContent(content) {
        this.content = content;
        return this;
    }

    /**
     * Método que define como a classe deve ser serializada para JSON.
     * Garante que apenas as propriedades necessárias sejam incluídas na serialização.
     * 
     * @returns {Object} O objeto TextDisplay pronto para ser serializado
     */
    toJSON() {
        return {
            type: this.type,
            content: this.content,
        };
    }
}