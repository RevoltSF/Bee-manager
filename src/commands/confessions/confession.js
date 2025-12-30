
const { parsePermissions } = require("@helpers/Utils");
const { ApplicationCommandOptionType, ChannelType } = require("discord.js");

const CHANNEL_PERMS = ["ViewChannel", "SendMessages", "EmbedLinks", "ManageMessages", "ReadMessageHistory"];

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "confession",
  description: "configure confession system",
  category: "CONFESSION",
  userPermissions: ["ManageGuild"],

  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
      {
        name: "status",
        description: "enable or disable confession status",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "status",
            description: "enabled or disabled",
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
              {
                name: "ON",
                value: "ON",
              },
              {
                name: "OFF",
                value: "OFF",
              },
            ],
          },
        ],
      },
      {
        name: "channel",
        description: "configure confession channel or disable it",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "channel_name",
            description: "the channel where confessions will be sent",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: false,
          },
        ],
      }
    ],
  },




  async interactionRun(interaction, data) {
    const sub = interaction.options.getSubcommand();
    let response;

    // status
    if (sub == "status") {
      const status = interaction.options.getString("status");
      response = await setStatus(data.settings, status);
    }

    // channel
    else if (sub == "channel") {
      const channel = interaction.options.getChannel("channel_name");
      response = await setChannel(data.settings, channel);
    }

    // else
    else response = "Not a valid subcommand";
    await interaction.followUp(response);
  },
};

async function setStatus(settings, status) {
  const enabled = status.toUpperCase() === "ON" ? true : false;
  settings.confessions.enabled = enabled;
  await settings.save();
  return `Confession system is now ${enabled ? "enabled" : "disabled"}`;
}

async function setChannel(settings, channel) {
  if (!channel) {
    settings.confessions.channel_id = null;
    await settings.save();
    return "Confession system is now disabled";
  }

  if (!channel.permissionsFor(channel.guild.members.me).has(CHANNEL_PERMS)) {
    return `I need the following permissions in ${channel}\n${parsePermissions(CHANNEL_PERMS)}`;
  }

  settings.confessions.channel_id = channel.id;
  await settings.save();
  return `Confessions will now be sent to ${channel}`;
}
