const { ApplicationCommandOptionType, EmbedBuilder, ButtonStyle, ButtonBuilder, ButtonInteraction, ButtonComponent, ActionRowBuilder, ComponentType } = require("discord.js");
const { getUser } = require("@schemas/User");
const EMBED_COLORS = require("@root/config").EMBED_COLORS


/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "rules",
  description: "used to manage server rules",
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
      .setTitle("<:BEEmod:1268805750898294907> __**B.E.E. Hive Rules and Agreements**__")
      .setDescription(`This server was created as an extension of the Bloxburg experience, which means we abide by not only the Discord ToS, but also the Roblox ToS & Bloxburg Mayor Tom's Guidelines. Click the buttons below to see how you can stay a part of the B.E.E. Hive.`)

  
    const tktBtnRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel("Neighborhood Agreements").setCustomId("NEIGHBORHOOD").setStyle(ButtonStyle.Primary).setEmoji("1269142828190011423"),
        new ButtonBuilder().setLabel("Server Rules").setCustomId("SERVER_RULES").setStyle(ButtonStyle.Primary).setEmoji("1269142832682111006"),
    );
  
    const message = await channel.send({ embeds: [embed], components: [tktBtnRow] });
    interaction.followUp({
      content: `I successfully sent it! Check ${message.url}`
    })
    }

  }}

  