const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { EMBED_COLORS } = require("@root/config");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "resetcd",
  description: "resets the cooldowns",
  category: "BLOXBURG",
  botPermissions: ["EmbedLinks"],
  userPermissions: ["Administrator"],
  command: {
    enabled: false,

  },
  slashCommand: {
    enabled: true,
    options: 
    [
      {
        type: 6,
        name: "user",
        description: "Reset a user's cooldown",
        required: false,
      }
    ]
  },


  async interactionRun(interaction) {
    const user = interaction.options.getUser('user');
    
    if (user) {
        // If a user is selected, delete the specific entry for that user
        interaction.client.shiftdatabase.delete(`${user.id}-lastCommand`);
    } else {
        // If no user is selected, delete the server-wide command entry
        interaction.client.shiftdatabase.delete("lastServerCommand");
    }

    const embedColor = require("@root/config").EMBED_COLORS.BOT_EMBED;
    const cooldownEmbed = new EmbedBuilder()
      .setColor(embedColor)
      .setTitle('Done!')
        .setDescription(user 
          ? `I successfully reset the cooldown for ${user.username}.`
          : "I successfully reset the server-wide cooldown.");

    await interaction.followUp({
        embeds: [cooldownEmbed]
    });
  },
};


