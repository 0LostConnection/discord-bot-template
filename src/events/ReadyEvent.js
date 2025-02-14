import { Event } from "../core/Event";

export default class ReadyEvent extends Event {
    constructor() {
        super('ready');
    }

    async execute(client) {
        await client.registerSlashCommands("1014555852469964920")
        console.log(`${client.user?.tag} is ready!`);
    }
}