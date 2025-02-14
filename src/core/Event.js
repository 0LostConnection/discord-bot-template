import { Client } from "discord.js"

export class Event {
    constructor(name) {
        this.name = name;
    }

    execute(client, ...args) {
        throw new Error(`Execute method not implemented in event: ${this.name}`);
    }
}