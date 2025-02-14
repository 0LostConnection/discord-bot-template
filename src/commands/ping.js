import { Command } from '../core/Command';

export default class PingCommand extends Command {
    constructor() {
        super();
        this.data
            .setName('ping')
            .setDescription('Responde com "Pong!"');
    }

    execute(client, interaction) {
        interaction.reply('Pong!');
    }
}
