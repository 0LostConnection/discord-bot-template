import { Command } from "../../../core/Command";

export default class PingCommand extends Command {
    constructor() {
        super();
        this.setName("ping");
        this.setDescription('Responde com "Pong!"');
        this.setGuildOnly(false);
        this.setDisabled(false);
    }

    execute(client, interaction) {
        interaction.reply("Pong!");
    }
}
