import { REST, Routes } from "discord.js";
import * as dotenv from "dotenv";
dotenv.config();

const TOKEN = process.env.CLIENT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const rest = new REST({ version: "10" }).setToken(TOKEN);

async function clearCommands() {
    try {
        // Obter argumentos da linha de comando
        const args = process.argv.slice(2);

        // Verificar se é para limpar comandos de uma guild específica ou globalmente
        if (args[0] === "guild" && args[1]) {
            const guildId = args[1];

            console.log(`Iniciando limpeza de comandos na guild ${guildId}...`);

            // Limpar comandos de uma guild específica
            await rest.put(
                Routes.applicationGuildCommands(CLIENT_ID, guildId),
                { body: [] },
            );

            console.log(
                `Comandos da guild ${guildId} foram resetados com sucesso!`,
            );
        } else if (args[0] === "global") {
            console.log("Iniciando limpeza de comandos globais...");

            // Limpar comandos globais
            await rest.put(Routes.applicationCommands(CLIENT_ID), { body: [] });

            console.log("Comandos globais foram resetados com sucesso!");
        } else {
            console.log("Uso incorreto. Utilize:");
            console.log(
                "node clearCommands.js guild <GUILD_ID> - Para limpar comandos de uma guild específica",
            );
            console.log(
                "node clearCommands.js global - Para limpar comandos globais",
            );
        }
    } catch (error) {
        console.error("Ocorreu um erro ao tentar limpar os comandos:");
        console.error(error);
    }
}

clearCommands();
