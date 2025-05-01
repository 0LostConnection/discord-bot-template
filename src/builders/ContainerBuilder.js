import { ComponentType, ContainerComponent } from "discord.js";
import { hexToDecimal } from "@utils/hexToDecimal";

/**
 * Builder para criar componentes do tipo Container para Discord.js.
 * Este builder atua como o próprio objeto container, eliminando a necessidade de um método build().
 * 
 * @example
 * ```javascript
 * const container = new ContainerBuilder()
 *    .setColor("#34d2eb")
 *    .addComponent(new TextDisplayBuilder().setContent("Texto"));
 * 
 * interaction.reply({
 *    flags: ["IsComponentsV2", "Ephemeral"],
 *    components: [container] // Usa o builder diretamente
 * });
 * ```
 */
export default class ContainerBuilder {
    /**
     * Cria uma nova instância do ContainerBuilder.
     * O construtor inicializa o container com valores padrão.
     */
    constructor() {
        /**
         * @type {ComponentType.Container} O tipo do componente
         */
        this.type = ComponentType.Container;
        
        /**
         * @type {number|null} A cor do container em formato decimal
         */
        this.accent_color = null;
        
        /**
         * @type {boolean} Indica se o container deve ser exibido como spoiler
         */
        this.spoiler = false;
        
        /**
         * @type {Array<any>} Array de componentes dentro do container
         */
        this.components = [];
        
        // Propriedade que não aparece na serialização mas contém referência ao container
        Object.defineProperty(this, 'container', {
            get: function() {
                return this;
            },
            enumerable: false // Não aparece em for...in loops e não será serializado
        });
    }

    /**
     * Define a cor de destaque do container.
     * 
     * @param {string} color - Cor em formato hexadecimal (ex: "#34d2eb")
     * @returns {ContainerBuilder} Esta instância, para encadeamento de métodos
     */
    setColor(color) {
        this.accent_color = hexToDecimal(color);
        return this;
    }

    /**
     * Define se o container deve ser exibido como spoiler.
     * 
     * @param {boolean} boolean - True para ativar o modo spoiler, false para desativar
     * @returns {ContainerBuilder} Esta instância, para encadeamento de métodos
     */
    setSpoiler(boolean) {
        this.spoiler = spoiler;
        return this;
    }

    /**
     * Adiciona um ou mais componentes ao container.
     * Aceita tanto um único componente quanto um array de componentes.
     * 
     * @param {any|Array<any>} component - Um componente único ou um array de componentes para adicionar
     * @returns {ContainerBuilder} Esta instância, para encadeamento de métodos
     * 
     * @example
     * ```javascript
     * // Adicionar um único componente
     * container.addComponent(new TextDisplayBuilder().setContent("Texto"));
     * 
     * // Adicionar vários componentes de uma vez
     * container.addComponent([
     *    new TextDisplayBuilder().setContent("Texto 1"),
     *    new TextDisplayBuilder().setContent("Texto 2")
     * ]);
     * ```
     */
    addComponent(component) {
        if (Array.isArray(component)) {
            // Se for um array, adiciona cada componente individualmente
            this.components.push(...component);
        } else {
            // Se for um único componente, adiciona normalmente
            this.components.push(component);
        }
        return this;
    }
    
    /**
     * Método alternativo com nome mais explícito para adicionar múltiplos componentes.
     * 
     * @param {any|Array<any>} components - Um componente ou array de componentes para adicionar
     * @returns {ContainerBuilder} Esta instância, para encadeamento de métodos
     * 
     * @example
     * ```javascript
     * container.addComponents([
     *    new TextDisplayBuilder().setContent("Texto 1"),
     *    new TextDisplayBuilder().setContent("Texto 2")
     * ]);
     * ```
     */
    addComponents(components) {
        if (!Array.isArray(components)) {
            components = [components]; // Transforma em array se não for
        }
        this.components.push(...components);
        return this;
    }
    
    /**
     * Método que define como a classe deve ser serializada para JSON.
     * Garante que apenas as propriedades necessárias sejam incluídas na serialização.
     * 
     * @returns {ContainerComponent} O objeto container pronto para ser serializado
     */
    toJSON() {
        return {
            type: this.type,
            accent_color: this.accent_color,
            spoiler: this.spoiler,
            components: this.components
        };
    }
}