const { ActivityType } = require("discord.js");

/**
 * @param {import('@src/structures').BotClient} client
 */
function updatePresence(client) {
  let message = client.config.PRESENCE.MESSAGE;

 

  const getType = (type) => {
    switch (type) {
      case "COMPETING":
        return ActivityType.Competing;

      case "LISTENING":
        return ActivityType.Listening;

      case "PLAYING":
        return ActivityType.Playing;

      case "WATCHING":
        return ActivityType.Watching;
    }
  };

  client.user.setPresence({
    status: client.config.PRESENCE.STATUS,
    activities: [{
      type: ActivityType.Custom,
      name: "custom", // name is exposed through the API but not shown in the client for ActivityType.Custom
      state: "Message me to make an anonymous report."
    }]
  });
}

module.exports = function handlePresence(client) {
  updatePresence(client);
  setInterval(() => updatePresence(client), 10 * 60 * 1000);
};
