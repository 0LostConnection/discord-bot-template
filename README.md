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
│   │   │   └── info/
│   │   │       └── userInfo.js
│   │   ├── global/
│   │   │   └── teste/
│   │   │       └── ping.js
│   ├── core/
│   │   ├── Command.js
│   │   ├── DiscordClient.js
│   │   └── Event.js
│   ├── events/
│   │   ├── InteractionCreateEvent.js
│   │   └── ReadyEvent.js
│   └── index.js
├── .env
├── clearCommands.js
├── package.json
└── README.md
```

## Uso

### Comandos

Os comandos são definidos na pasta `src/commands`. Cada comando é uma classe que estende a classe base `Command`. Os comandos são organizados em três categorias: `debug`, `guild` e `global`.

#### Categorias de Comandos

- **Debug**: Comandos que são registrados apenas na guild de debug especificada no arquivo `.env` (`DEBUG_GUILD_ID`). Esses comandos são úteis para testes e desenvolvimento.
- **Guild**: Comandos que são registrados em guilds específicas definidas para cada comando. Esses comandos são úteis para funcionalidades específicas de determinadas guilds.
- **Global**: Comandos que são registrados globalmente e estão disponíveis em todas as guilds onde o bot está presente.

#### Configuração de Guilds para Comandos

Cada comando pode especificar em quais guilds deve ser registrado usando o método `setGuildId()`:

```js
// Registrar em uma única guild
this.setGuildId("123456789012345678");

// Registrar em múltiplas guilds
this.setGuildId(["123456789012345678", "987654321098765432"]);
```

Se você não chamar o método `setGuildId()`, o comando será registrado globalmente.

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
        // Não chamar setGuildId() faz com que o comando seja global
        this.setDisabled(false);  // Define que o comando está habilitado, por padrão é false, então é obselto deixa-lo no código.
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
        this.setDebug(true);      // Define que o comando é para debug e será registrado na guild de Debug
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

#### Exemplo de Comando para Múltiplas Guilds

```js
import { CommandInteraction } from "discord.js";
import { Command } from "../../../core/Command";

/**
 * Comando que responde com informações da guild.
 * @extends {Command}
 */
export default class GuildInfoCommand extends Command {
    /**
     * Cria uma nova instância do comando GuildInfo.
     */
    constructor() {
        super();
        this.setName("guildinfo");
        this.setDescription("Mostra informações sobre a guild atual");
        // Registra o comando em múltiplas guilds específicas
        this.setGuildId(["123456789012345678", "987654321098765432"]);
        this.setDisabled(false);
    }

    /**
     * Executa o comando GuildInfo.
     * @param {DiscordClient} client - A instância do cliente customizado do Discord.
     * @param {CommandInteraction} interaction - A interação que acionou o comando.
     */
    execute(client, interaction) {
        const guild = interaction.guild;
        interaction.reply(`Nome da Guild: ${guild.name}\nTotal de membros: ${guild.memberCount}`);
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

## Ferramentas Utilitárias

### Limpeza de Comandos

O template inclui uma ferramenta para limpar comandos que estão registrados no Discord. Isso é particularmente útil quando:

- Você remove um comando do seu código, mas ele ainda aparece no Discord
- Um comando não está mais configurado para uma guild específica, mas continua disponível nela
- Você deseja reiniciar todos os comandos do seu bot

#### Como Usar

Para limpar comandos globais:

```bash
bun clearCommands.js global
```

Para limpar comandos de uma guild específica:

```bash
bun clearCommands.js guild <GUILD_ID>
```

Substitua `<GUILD_ID>` pelo ID da guild da qual você deseja remover todos os comandos.

#### Situações de Uso

- **Desenvolvimento**: Durante o desenvolvimento, você pode querer limpar comandos para testar novas versões
- **Migração**: Ao migrar comandos de uma guild para global ou vice-versa
- **Manutenção**: Para remover comandos obsoletos que já foram removidos do código mas ainda aparecem para os usuários
- **Resolução de Problemas**: Quando há discrepância entre os comandos disponíveis e os implementados no código

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.
