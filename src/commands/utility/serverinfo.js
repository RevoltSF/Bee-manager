const { ApplicationCommandOptionType, EmbedBuilder, ButtonStyle, ButtonBuilder, ButtonInteraction, ButtonComponent, ActionRowBuilder, ComponentType } = require("discord.js");
const { getUser } = require("@schemas/User");
const EMBED_COLORS = require("@root/config").EMBED_COLORS


/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "serverinfo",
  description: "used to manage server info",
  category: "UTILITY",
  userPermissions: ["ManageGuild"],
  command: {
    enabled: false,
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [

      {
        name: "channel",
        description: "select a channel to send the message in",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
            {
              name: "channel",
              description: "the channel to set",
              type: ApplicationCommandOptionType.Channel,
              required: true,
            }
          ]
      }
    ],
  },
  
  async interactionRun(interaction, data) {
   const settings = data.settings
  

    const sub = interaction.options.getSubcommand();

    if(sub == "channel"){
      const channel = interaction.options.getChannel("channel");
     
      
      const embed = new EmbedBuilder()
      .setColor(EMBED_COLORS.BOT_EMBED)
      .setTitle("__**B.E.E. Hive Server Info**__")
      .setThumbnail(interaction.guild.iconURL())
      .setDescription(`Welcome to the cash driven server for Bloxburg Excellent Employees!\nClick the buttons below to learn more about the B.E.E. Hive, then *get that money, honey!*\n\n**Tell others about us:**\n[WtB Community - looking for players](<https://discord.com/channels/732384711040696331/1202056949928304710>)\n[Welome to Bloxburg Official - looking for group (Author: Dee)](<https://discord.com/channels/1242031861761441833/1250825093836308681>)\n[Welcome to Bloxburg Official - looking for group (Author: Seawyd)](<https://discord.com/channels/1242031861761441833/1250825093836308681>)`)
      .setFooter({ text: "Formerly Bloxburg Workers Community est. September 1, 2023" });
  
    const tktBtnRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel("Boosting Perks").setCustomId("BOOST_PERKS").setStyle(ButtonStyle.Primary).setEmoji("1268789869283512341"),
        new ButtonBuilder().setLabel("Building Info").setCustomId("BUILDING_INFO").setStyle(ButtonStyle.Primary).setEmoji("1270130529613774950"),
        new ButtonBuilder().setLabel("Catering Info").setCustomId("CATERING_INFO").setStyle(ButtonStyle.Primary).setEmoji("1268805753704157256"),
        new ButtonBuilder().setLabel("Entrepreneurship Info").setCustomId("ENTRE_INFO").setStyle(ButtonStyle.Primary).setEmoji("1268603590528729201"),
        new ButtonBuilder().setLabel("FAQ").setCustomId("FAQ").setStyle(ButtonStyle.Primary).setEmoji("1268805756476592210"),
    );
    const tktBtnRow1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel("Homeownership Info").setCustomId("HOMEOWNERSHIP").setStyle(ButtonStyle.Primary).setEmoji("1268962836990660628"),
      new ButtonBuilder().setLabel("Level Perks").setCustomId("LEVEL_PERKS").setStyle(ButtonStyle.Primary).setEmoji("1268808091227390004"),
      new ButtonBuilder().setLabel("Partnership Info").setCustomId("PARTNERSHIP_INFO").setStyle(ButtonStyle.Primary).setEmoji("1268805757835411516"),
      new ButtonBuilder().setLabel("Server Staff").setCustomId("SERVER_STAFF").setStyle(ButtonStyle.Primary).setEmoji("1268805750898294907"),
      new ButtonBuilder().setLabel("Get Support").setCustomId("TICKET_CREATE").setStyle(ButtonStyle.Success)
    );
  
    const message = await channel.send({ embeds: [embed], components: [tktBtnRow, tktBtnRow1] });
    interaction.followUp({
      content: `I successfully sent it! Check ${message.url}`
    })
    }

  }}

  