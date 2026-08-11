# Discord Bot

A slash-command Discord bot built with [discord.js](https://discord.js.org) v14. Commands and events are loaded dynamically from the filesystem, and each command supports a configurable per-user cooldown.

## Features

- Dynamic command loading from `commands/<category>/*.js`
- Dynamic event loading from `events/*.js`
- Slash command (interaction-based) handling with per-command cooldowns
- Built-in commands: `/ping`, `/server`, `/user`, `/reload`

## Commands

| Command | Description |
| --- | --- |
| `/ping` | Replies with "Pong! 🏓" (5s cooldown) |
| `/server` | Shows the current server's name and member count |
| `/user` | Shows the invoking user's username and join date |
| `/reload` | Hot-reloads a command by name without restarting the bot |

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- A Discord application and bot token from the [Discord Developer Portal](https://discord.com/developers/applications)

## Setup

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/neelb-01/discord-bot.git
   cd discord-bot
   npm install
   ```

2. Create a `config.json` file in the project root (this file is gitignored and should never be committed):

   ```json
   {
     "token": "your-bot-token",
     "clientId": "your-application-client-id",
     "guildId": "your-test-server-id"
   }
   ```

   - `token` — your bot's token, from the Bot tab of your application in the Developer Portal
   - `clientId` — your application's client/application ID, from the General Information tab
   - `guildId` — the ID of the Discord server you want to deploy commands to for testing (right-click the server icon with Developer Mode enabled and select "Copy Server ID")

3. Invite the bot to your server using an OAuth2 URL generated in the Developer Portal, granting it the `bot` and `applications.commands` scopes.

## Usage

Deploy the slash commands to your test server:

```bash
node deploy-commands.js
```

Start the bot:

```bash
node index.js
```

Once running, the bot logs `Ready! Logged in as <bot tag>` to the console and the commands become available in your server.

## Project Structure

```
.
├── commands/
│   └── utility/
│       ├── ping.js
│       ├── reload.js
│       ├── server.js
│       └── user.js
├── events/
│   ├── interactionCreate.js
│   └── ready.js
├── deploy-commands.js
├── index.js
├── package.json
└── config.json      # not committed — create this yourself
```

### Adding a new command

Add a file to a folder under `commands/` (or create a new category folder) that exports an object with `data` (a `SlashCommandBuilder`) and an async `execute(interaction)` function, optionally with a `cooldown` (in seconds, defaults to 3). Re-run `node deploy-commands.js` to register it, then restart the bot (or use `/reload` for existing commands during development).

### Adding a new event

Add a file to `events/` that exports an object with `name` (a value from discord.js's `Events`), an optional `once` boolean, and an `execute(...)` function.

## Linting

This project uses ESLint:

```bash
npx eslint .
```

## License

ISC
