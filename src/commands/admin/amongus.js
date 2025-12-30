const {
    ApplicationCommandOptionType,
    ChannelType,
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    EmbedBuilder,
    ApplicationCommand,
  } = require("discord.js");
const Guild = require("@root/src/database/schemas/Guild");
  
  /**
   * @type {import("@structures/Command")}
   */
  module.exports = {
    name: "amongus",
    description: "amogus",
    category: "ADMIN",
    userPermissions: ["ManageGuild"],
    command: {
      enabled: false,
    },
    slashCommand: {
      enabled: true,
      ephemeral: false,
      options: [
        { type: ApplicationCommandOptionType.Channel, name: "mainchannel", description: "What is the main voice channel?", required: true, channelTypes: [ChannelType.GuildVoice, ChannelType.GuildStageVoice] },
        { type: ApplicationCommandOptionType.Channel, name: "staffchannel", description: "What is the staff-only voice channel?", required: true, channelTypes: [ChannelType.GuildVoice, ChannelType.GuildStageVoice] },
    ]
    },
  
 
  
    async interactionRun(interaction) {
                const mainchannel = interaction.options.getChannel("mainchannel");
        const staffchannel = interaction.options.getChannel("staffchannel");
        
        let components = [];
        components.push(
          new ButtonBuilder().setCustomId("startgame").setStyle(ButtonStyle.Success).setLabel("Start Game").setEmoji("1296022147201765420"),
          new ButtonBuilder().setCustomId("pausegame").setEmoji("1296022171495305298").setStyle(ButtonStyle.Secondary).setLabel("Pause Game").setDisabled(true),
          new ButtonBuilder().setCustomId("clearhistory").setEmoji("1296022603479388160").setStyle(ButtonStyle.Danger).setLabel("Clear History"),
          new ButtonBuilder().setCustomId("alarm").setStyle(ButtonStyle.Danger).setLabel("Alarm (15 seconds)"),
        );
      
        let buttonsRow = new ActionRowBuilder().addComponents(components);

        let alarms = [];
        alarms.push(
          new ButtonBuilder().setCustomId("oxygen-restore").setStyle(ButtonStyle.Success).setLabel("Oxygen Restore"),
          new ButtonBuilder().setCustomId("oxygen-sabotage").setStyle(ButtonStyle.Danger).setLabel("Oxygen Sabotage"),
          new ButtonBuilder().setCustomId("reactor-restore").setStyle(ButtonStyle.Success).setLabel("Reactor Restore"),
          new ButtonBuilder().setCustomId("reactor-sabotage").setStyle(ButtonStyle.Danger).setLabel("Reactor Sabotage"),
          new ButtonBuilder().setCustomId("deadbody").setStyle(ButtonStyle.Secondary).setLabel("Dead Body"),

        );

        let alarms1 = [];
        alarms1.push(
          new ButtonBuilder().setCustomId("lights-restore").setStyle(ButtonStyle.Success).setLabel("Lights Restore"),
          new ButtonBuilder().setCustomId("lights-sabotage").setStyle(ButtonStyle.Danger).setLabel("Lights Sabotage"),
          new ButtonBuilder().setCustomId("gameover-crew").setStyle(ButtonStyle.Success).setLabel("Gameover - Crewmate"),
          new ButtonBuilder().setCustomId("gameover-imp").setStyle(ButtonStyle.Danger).setLabel("Gameover - Impostor"),
          new ButtonBuilder().setCustomId("announcement").setStyle(ButtonStyle.Secondary).setLabel("Announcement"),
        );
      
        let soundsDEE = new ActionRowBuilder().addComponents(alarms);
        let soundsDEE1 = new ActionRowBuilder().addComponents(alarms1);
        const embed = new EmbedBuilder().setColor(require("@root/config").EMBED_COLORS.BOT_EMBED)
        .addFields(
            { name: "‎ ", value: mainchannel.id},
            { name: "‎ ", value: staffchannel.id},
            { name: "Current State:", value: "Untouched."}
        )
        interaction.followUp({
            content: "Done!"
        })
        interaction.channel.send({
            content: `# History:\nNothing has happened yet.`,
            components: [buttonsRow, soundsDEE, soundsDEE1],
            embeds: [embed]
        })
    },
  };
  