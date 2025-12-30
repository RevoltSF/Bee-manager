const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");


const { getUser } = require("@schemas/User");
const { ECONOMY, EMBED_COLORS } = require("@root/config");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "give",
  description: "yk it",
  category: "OWNER",
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: false,
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "user",
        description: "the user",
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: "value",
        description: "the value",
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
    ],
  },



  async interactionRun(interaction) {
    const user = interaction.options.getUser("user");
    const value = interaction.options.getNumber("value")




  
    const targetDb = await getUser(user);
  
    targetDb.bank += value;
  
    await targetDb.save();
  
    const embed = new EmbedBuilder()
      .setColor(EMBED_COLORS.BOT_EMBED)
      .setAuthor({ name: "Updated Balance" })
      .setDescription(`You have successfully transferred ${value}${ECONOMY.CURRENCY} to ${user.username}`)
      .setTimestamp(Date.now());
  
    interaction.followUp({
        embeds: [embed]
    })
  },
};


