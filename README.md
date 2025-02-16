# Discord Bot Template

Este é um template para criar bots do Discord usando a biblioteca `discord.js`. Ele inclui uma estrutura básica para comandos de barra (slash commands), eventos e configuração de comandos específicos de guilds.

## Requisitos

- Bun ou Node.js

## Instalação

1. Clone este repositório:

   ```bash
   git clone https://github.com/0LostConnection/discord-bot-template.git
   cd discord-bot-template
   ```

2. Instale as dependências:

   ```bash
   bun install
   ```

3. Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis de ambiente:

   ```env
   # Bot
   CLIENT_TOKEN=seu_token_do_discord
   CLIENT_ID=seu_id_do_cliente
   
   # Comandos
   DEBUG_GUILD_ID=id_da_guild_de_debug
   GUILD_ID=id_da_guild_especifica
   ```

## Estrutura do Projeto

```plaintext
discord-bot-template/
├── src/
│   ├── commands/
│   │   ├── debug/
│   │   │   └── teste/
│   │   │       └── pong.js
│   │   ├── guild/
│   │   │   └── teste/
│   │   │       └── ping.js
│   │   ├── global/
│   │   │   └── teste/
│   │   │       └── example.js
│   ├── core/
│   │   ├── Command.js
│   │   ├── DiscordClient.js
│   │   └── Event.js
│   ├── events/
│   │   ├── InteractionCreateEvent.js
│   │   └── ReadyEvent.js
│   └── index.js
├── .env
├── package.json
└── README.md
```

## Uso

### Comandos

Os comandos são definidos na pasta `src/commands`. Cada comando é uma classe que estende a classe base `Command`. Os comandos são organizados em três categorias: `debug`, `guild` e `global`.

#### Categorias de Comandos

- **Debug**: Comandos que são registrados apenas na guild de debug especificada no arquivo `.env` (`DEBUG_GUILD_ID`). Esses comandos são úteis para testes e desenvolvimento.
- **Guild**: Comandos que são registrados apenas em uma guild específica, cujo ID é especificado no arquivo `.env` (`GUILD_ID`). Esses comandos são úteis para funcionalidades específicas de uma guild.
- **Global**: Comandos que são registrados globalmente e estão disponíveis em todas as guilds onde o bot está presente.

#### Exemplo de Comando `ping` (global)

```js
import { CommandInteraction } from "discord.js";
import { Command } from "../../../core/Command";

/**
 * Comando que responde com "Pong!".
 * @extends {Command}
 */
export default class PingCommand extends Command {
    /**
     * Cria uma nova instância do comando Ping.
     */
    constructor() {
        super();
        this.setName("ping");
        this.setDescription('Responde com "Pong!"');
        this.setGuildOnly(false);
        this.setDisabled(false);
    }

    /**
     * Executa o comando Ping.
     * @param {DiscordClient} client - A instância do cliente customizado do Discord.
     * @param {CommandInteraction} interaction - A interação que acionou o comando.
     */
    execute(client, interaction) {
        interaction.reply("Pong!");
    }
}
```

#### Exemplo de Comando `pong` (debug)

```js
import { CommandInteraction } from "discord.js";
import { Command } from "../../../core/Command";

/**
 * Comando que responde com "Ping!".
 * @extends {Command}
 */
export default class PongCommand extends Command {
    /**
     * Cria uma nova instância do comando Pong.
     */
    constructor() {
        super();
        this.setName("pong");
        this.setDescription('Responde com "Ping!"');
        this.setGuildOnly(true);
        this.setDebug(true);
        this.setDisabled(false);
    }

    /**
     * Executa o comando Pong.
     * @param {DiscordClient} client - A instância do cliente customizado do Discord.
     * @param {CommandInteraction} interaction - A interação que acionou o comando.
     */
    execute(client, interaction) {
        interaction.reply("Ping!");
    }
}
```

### Eventos

Os eventos são definidos na pasta `src/events`. Cada evento é uma classe que estende a classe base `Event`. O nome do evento é definido no construtor da classe, passando o nome do evento para o super construtor da classe `Event`.

#### Exemplo de Evento `ready`

```js
import { Event } from "../core/Event";
import { DiscordClient } from "../core/DiscordClient";

/**
 * Evento que é acionado quando o bot está pronto.
 * @extends {Event}
 */
export default class ReadyEvent extends Event {
    /**
     * Cria uma nova instância do evento ReadyEvent.
     */
    constructor() {
        super("ready");
    }

    /**
     * Executa o evento quando o bot está pronto.
     * @param {DiscordClient} client - A instância do cliente customizado do Discord.
     * @returns {Promise<void>}
     */
    async execute(client) {
        await client.registerSlashCommands();
        console.log(`${client.user?.tag} is ready!`);
    }
}
```

### Definindo o Nome do Evento

Para definir o nome do evento, passe o nome do evento como uma string para o super construtor da classe `Event` no construtor da sua classe de evento. Por exemplo, para definir o nome do evento como `ready`, use `super("ready")` no construtor da sua classe de evento.

## Executando o Bot

Para iniciar o bot, use o seguinte comando:

```bash
bun start
```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.