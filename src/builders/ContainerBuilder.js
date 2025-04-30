import { ContainerBuilder, TextDisplayBuilder } from "discord.js";
import { hexToDecimal } from "@utils/hexToDecimal";

export default class t_ContainerBuilder {
    constructor() {
        this.container = new ContainerBuilder();
    }

    setColor(hexColor) {
        this.container.setAccentColor(hexToDecimal(hexColor));
        return this;
    }

    addTextDisplayComponent(text) {
        this.container.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(text),
        );
        return this;
    }

    build() {
        return this.container;
    }
}
