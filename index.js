// require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { loadCommands } = require('./utils/loadCommands');
const { token } = require('./config.json');

// create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
client.cooldowns = new Collection();

// key the collection by command name, with the exported module as the value
for (const { command } of loadCommands()) {
    client.commands.set(command.data.name, command);
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// a rejection that escapes a command's try/catch would otherwise be silent
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled promise rejection:', reason);
});

// after an uncaught exception the process is in an unknown state, so log and let the
// supervisor (systemd, pm2, docker, ...) restart the bot rather than limping along
process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
    client.destroy().finally(() => process.exit(1));
});

for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => {
        console.log(`Received ${signal}, closing the gateway connection.`);
        client.destroy().finally(() => process.exit(0));
    });
}

// log in to discord with the client's token
client.login(token);