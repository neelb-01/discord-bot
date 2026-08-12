const fs = require('node:fs');
const path = require('node:path');

const commandsRoot = path.join(__dirname, '..', 'commands');

// collect every commands/<category>/*.js path, skipping stray files sitting at the category level
function getCommandFilePaths() {
    const filePaths = [];
    for (const entry of fs.readdirSync(commandsRoot, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;

        const categoryPath = path.join(commandsRoot, entry.name);
        for (const file of fs.readdirSync(categoryPath, { withFileTypes: true })) {
            if (file.isFile() && file.name.endsWith('.js')) {
                filePaths.push(path.join(categoryPath, file.name));
            }
        }
    }
    return filePaths;
}

// require every command module, skipping (with a warning) any that fails to load or is malformed
function loadCommands() {
    const commands = [];
    for (const filePath of getCommandFilePaths()) {
        let command;
        try {
            command = require(filePath);
        } catch (error) {
            console.log(`[WARNING] The command at ${filePath} could not be loaded: ${error.message}`);
            continue;
        }

        if ('data' in command && 'execute' in command) {
            commands.push({ filePath, command });
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
    return commands;
}

// resolve the file backing a command name, including files added since startup
function findCommandFilePath(name) {
    for (const { filePath, command } of loadCommands()) {
        if (command.data.name === name) return filePath;
    }
    return null;
}

module.exports = { loadCommands, findCommandFilePath };
