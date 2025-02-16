import { Command } from "../../../core/Command";

export default class PongCommand extends Command {
    constructor() {
        super();
        this.setName("pong");
        this.setDescription('Responde com "Ping!"');
        this.setGuildOnly(true);
        this.setDebug(false);
        this.setDisabled(false);
    }

    execute(client, interaction) {
        interaction.reply("Ping!");
    }
}
