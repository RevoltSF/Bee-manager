const { getUser } = require("@schemas/User");
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { diffHours, getRemainingTime } = require("@helpers/Utils");
const { EMBED_COLORS } = require("@root/config");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "staffpoints",
  description: "view staff points",
  category: "BLOXBURG",
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: false
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "view",
        description: "view staff points for a user",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "user",
            description: "the user to check staff points for",
            type: ApplicationCommandOptionType.User,
            required: false,
          },
        ],
      }
    ],
  },


  async interactionRun(interaction) {
    const sub = interaction.options.getSubcommand();
    let response;

    // status
    if (sub === "view") {
      const target = interaction.options.getUser("user") || interaction.user;
      response = await viewReputation(target);
    }


    await interaction.followUp(response);
  },
};

async function viewReputation(target) {
  const userData = await getUser(target);

  const embed = new EmbedBuilder()
    .setAuthor({ name: `Staff points for ${target.username}` })
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setThumbnail(target.displayAvatarURL())
    .addFields(
      {
        name: "Received",
        value: userData.reputation?.received.toString(),
        inline: true,
      }
    );

  return { embeds: [embed] };
}

