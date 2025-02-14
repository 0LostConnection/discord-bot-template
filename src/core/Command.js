import { SlashCommandBuilder } from 'discord.js';

export class Command {
    constructor() {
        if (this.constructor === Command) {
            throw new Error('A classe Command não pode ser instanciada diretamente.');
        }

        this.data = new SlashCommandBuilder();
    }

    execute(client, interaction) {
        throw new Error(`O método execute não foi implementado no comando: ${this.data.name}`);
    }
}
