import { Client } from "discord.js"
import { Event } from "../core/Event"

export class ReadyEvent implements Event {
    name = "ready"
    execute(client: Client): void {
        console.log("Ok")
    }
}