const { REST, Routes } = require('discord.js');
const { loadCommands } = require('./utils/loadCommands');
const { clientId, guildId, token } = require('./config.json');

// grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
const commands = loadCommands().map(({ command }) => command.data.toJSON());

// construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// deploy commands
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // the put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // catch and log any errors
        console.error(error);
    }
})();