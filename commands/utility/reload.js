const { MessageFlags, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const { findCommandFilePath } = require('../../utils/loadCommands');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reloads a command.')
        .addStringOption((option) => option.setName('command').setDescription('The command to reload.').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        // the default member permissions above only set the initial state — server admins can re-enable the
        // command for other roles from the Integrations settings, so re-check at execution time
        if (!interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                content: 'You need the Administrator permission to reload commands.',
                flags: MessageFlags.Ephemeral,
            });
        }

        const commandName = interaction.options.getString('command', true).toLowerCase();
        const filePath = findCommandFilePath(commandName);

        if (!filePath) {
            return interaction.reply({
                content: `There is no command with name \`${commandName}\`!`,
                flags: MessageFlags.Ephemeral,
            });
        }

        delete require.cache[require.resolve(filePath)];

        try {
            const newCommand = require(filePath);
            interaction.client.commands.set(newCommand.data.name, newCommand);
            await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
        } catch (error) {
            console.error(error);
            await interaction.reply(
                `There was an error while reloading a command \`${commandName}\`:\n\`${error.message}\``
            );
        }
    },
};
