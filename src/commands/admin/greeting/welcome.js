const { isHex } = require("@helpers/Utils");
const { buildGreeting } = require("@handlers/greeting");
const { ApplicationCommandOptionType, ChannelType } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "welcome",
  description: "setup welcome message",
  category: "ADMIN",
  userPermissions: ["ManageGuild"],
  command: {
    enabled: true,
    minArgsCount: 1,
    subcommands: [
      {
        trigger: "status <on|off>",
        description: "enable or disable welcome message",
      },
      {
        trigger: "channel <#channel>",
        description: "configure welcome message",
      },
      {
        trigger: "preview",
        description: "preview the configured welcome message",
      },
      {
        trigger: "desc <text>",
        description: "set embed description",
      },
      {
        trigger: "thumbnail <ON|OFF>",
        description: "enable/disable embed thumbnail",
      },
      {
        trigger: "color <hexcolor>",
        description: "set embed color",
      },
      {
        trigger: "footer <text>",
        description: "set embed footer content",
      },
      {
        trigger: "image <url>",
        description: "set embed image",
      }
    ],
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
      {
        name: "status",
        description: "enable or disable welcome message",
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
        name: "preview",
        description: "preview the configured welcome message",
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: "channel",
        description: "set welcome channel",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "channel",
            description: "channel name",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: true,
          },
        ],
      },
      {
        name: "title",
        description: "set embed title",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "title",
            description: "title-content",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
      {
        name: "desc",
        description: "set embed description",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "content",
            description: "description content",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
      {
        name: "thumbnail",
        description: "configure embed thumbnail",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "status",
            description: "thumbnail status",
            type: ApplicationCommandOptionType.String,
            required: true,
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
        name: "color",
        description: "set embed color",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "hex-code",
            description: "hex color code",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
      {
        name: "footer",
        description: "set embed footer",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "footer-content",
            description: "footer content",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
      {
        name: "footer-image",
        description: "set footer image to set",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "footer-image",
            description: "the image to set",
            type: ApplicationCommandOptionType.String,
            required: true
          }
        ]
      },
      {
        name: "image",
        description: "set embed image",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "url",
            description: "image url",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
      {
        name: "content",
        description: "set welcome message content",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "content-text",
            description: "the text to send",
            type: ApplicationCommandOptionType.String,
            required: true
          }
        ]
      },
      {
        name: "author-content",
        description: "set author content",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "author-content",
            description: "the content to set",
            type: ApplicationCommandOptionType.String,
            required: true
          }
        ]
      },
      {
        name: "author-image",
        description: "set author image",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "author-image",
            description: "the author image to set",
            type: ApplicationCommandOptionType.String,
            required: true
          }
        ]
      },
      {
        name: "timestamp",
        description: "set timestamp",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "timestamp",
            description: "should timestamp be on or off?",
            type: ApplicationCommandOptionType.Boolean,
            required: true
          }
        ]
      }
    ],
  },

  async messageRun(message, args, data) {
    const type = args[0].toLowerCase();
    const settings = data.settings;
    let response;

    // preview
    if (type === "preview") {
      response = await sendPreview(settings, message.member);
    }

    // status
    else if (type === "status") {
      const status = args[1]?.toUpperCase();
      if (!status || !["ON", "OFF"].includes(status))
        return message.safeReply("Invalid status. Value must be `on/off`");
      response = await setStatus(settings, status);
    }

    // channel
    else if (type === "channel") {
      const channel = message.mentions.channels.first();
      response = await setChannel(settings, channel);
    }

    // desc
    else if (type === "desc") {
      if (args.length < 2) return message.safeReply("Insufficient arguments! Please provide valid content");
      const desc = args.slice(1).join(" ");
      response = await setDescription(settings, desc);
    }

    // thumbnail
    else if (type === "thumbnail") {
      const status = args[1]?.toUpperCase();
      if (!status || !["ON", "OFF"].includes(status))
        return message.safeReply("Invalid status. Value must be `on/off`");
      response = await setThumbnail(settings, status);
    }

    // color
    else if (type === "color") {
      const color = args[1];
      if (!color || !isHex(color)) return message.safeReply("Invalid color. Value must be a valid hex color");
      response = await setColor(settings, color);
    }

    // footer
    else if (type === "footer") {
      if (args.length < 2) return message.safeReply("Insufficient arguments! Please provide valid content");
      const content = args.slice(1).join(" ");
      response = await setFooter(settings, content);
    }

    // image
    else if (type === "image") {
      const url = args[1];
      if (!url) return message.safeReply("Invalid image url. Please provide a valid url");
      response = await setImage(settings, url);
    }

    //
    else response = "Invalid command usage!";
    return message.safeReply(response);
  },

  async interactionRun(interaction, data) {
    const sub = interaction.options.getSubcommand();
    const settings = data.settings;

    let response;
    switch (sub) {
      case "preview":
        response = await sendPreview(settings, interaction.member);
        break;

      case "status":
        response = await setStatus(settings, interaction.options.getString("status"));
        break;

      case "channel":
        response = await setChannel(settings, interaction.options.getChannel("channel"));
        break;

      case "desc":
        response = await setDescription(settings, interaction.options.getString("content"));
        break;

      case "thumbnail":
        response = await setThumbnail(settings, interaction.options.getString("status"));
        break;

      case "color":
        response = await setColor(settings, interaction.options.getString("hex-code"));
        break;

      case "footer":
        response = await setFooter(settings, interaction.options.getString("footer-content"));
        break;

      case "image":
        response = await setImage(settings, interaction.options.getString("url"));
        break;

        case "content":
          response = await setContent(settings, interaction.options.getString("content-text"));
          break;

          case "footer-image":
            response = await setFooterImage(settings, interaction.options.getString("footer-image"))
            break;
            case "author-content":
              response = await setAuthorContent(settings, interaction.options.getString("author-content"))
              break;
              case "author-image":
                response = await setAuthorImage(settings, interaction.options.getString("author-image"))
                break;
                case "title":
                  response = await setTitle(settings, interaction.options.getString("title-content"))
                  break;
                  case "timestamp":
                    response = await setTimestamp(settings, interaction.options.getBoolean("timestamp"))
                    break;
      default:
        response = "Invalid subcommand";
    }

    return interaction.followUp(response);
  },
};

async function sendPreview(settings, member) {
  if (!settings.welcome?.enabled) return "Welcome message not enabled in this server";

  const targetChannel = member.guild.channels.cache.get(settings.welcome.channel);
  if (!targetChannel) return "No channel is configured to send welcome message";

  const response = await buildGreeting(member, "WELCOME", settings.welcome);
  await targetChannel.safeSend(response);

  return `Sent welcome preview to ${targetChannel.toString()}`;
}

async function setStatus(settings, status) {
  const enabled = status.toUpperCase() === "ON" ? true : false;
  settings.welcome.enabled = enabled;
  await settings.save();
  return `Configuration saved! Welcome message ${enabled ? "enabled" : "disabled"}`;
}

async function setChannel(settings, channel) {
  if (!channel.canSendEmbeds()) {
    return (
      "Ugh! I cannot send greeting to that channel? I need the `Write Messages` and `Embed Links` permissions in " +
      channel.toString()
    );
  }
  settings.welcome.channel = channel.id;
  await settings.save();
  return `Configuration saved! Welcome message will be sent to ${channel ? channel.toString() : "Not found"}`;
}

async function setDescription(settings, desc) {
  settings.welcome.embed.description = desc;
  await settings.save();
  return "Configuration saved! Welcome message updated";
}

async function setThumbnail(settings, status) {
  settings.welcome.embed.thumbnail = status.toUpperCase() === "ON" ? true : false;
  await settings.save();
  return "Configuration saved! Welcome message updated";
}

async function setColor(settings, color) {
  settings.welcome.embed.color = color;
  await settings.save();
  return "Configuration saved! Welcome message updated";
}

async function setFooter(settings, content) {
  settings.welcome.embed.footer = content;
  await settings.save();
  return "Configuration saved! Welcome message updated";
}

async function setImage(settings, url) {
  settings.welcome.embed.image = url;
  await settings.save();
  return "Configuration saved! Welcome message updated";
}

async function setContent(settings, content) {
  settings.welcome.content = content;
  await settings.save();
  return "Configuration saved! Welcome message updated";
}


async function setFooterImage(settings, content) {
  settings.welcome.embed.footer_image = content;
  await settings.save();
  return "Configuration saved! Welcome message updated";
}

async function setAuthorContent(settings, content) {
  settings.welcome.embed.author_content = content;
  await settings.save();
  return "Configuration saved! Welcome message updated";
}

async function setAuthorImage(settings, content) {
  settings.welcome.embed.author_image = content;
  await settings.save();
  return "Configuration saved! Welcome message updated";
}

async function setTitle(settings, content) {
  settings.welcome.embed.title = content;
  await settings.save();
  return "Configuration saved! Welcome message updated";
}

async function setTimestamp(settings, content) {
  settings.welcome.embed.timestamp = content;
  await settings.save();
  return "Configuration saved! Welcome message updated";
}
