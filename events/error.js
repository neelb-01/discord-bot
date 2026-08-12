const { Events } = require('discord.js');

module.exports = {
    name: Events.Error,
    execute(error) {
        // the client emits this for errors it recovers from itself (websocket, REST); without a
        // listener attached, node treats an emitted 'error' as an uncaught exception
        console.error('Client error:', error);
    },
};
