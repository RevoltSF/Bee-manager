const { commandHandler, automodHandler, statsHandler } = require("@src/handlers");

/**
 * @param {import('@src/structures').BotClient} client
 * @param {import('discord.js').ThreadChannel} channel
 */
module.exports = async (client, channel) => {
  channel.join()
};
