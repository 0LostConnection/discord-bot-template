import { Client } from "discord.js"

export interface Event {
    name: string;
    execute(client: Client): void
}