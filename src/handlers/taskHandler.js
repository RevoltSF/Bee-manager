const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    StringSelectMenuBuilder,
    ComponentType,
    ModalBuilder,
    TextInputStyle,
    TextInputBuilder,
  } = require("discord.js");
  const TICKET = require("@root/config").TICKET
  
  // schemas
  const { getSettings } = require("@schemas/Guild");
  
  // helpers
  const { postToBin } = require("@helpers/HttpUtils");
  const { error } = require("@helpers/Logger");
const { EMBED_COLORS } = require("@root/config");
  
  const OPEN_PERMS = ["ManageChannels"];
  const CLOSE_PERMS = ["ManageChannels", "ReadMessageHistory"];
  
  /**
   * @param {import('discord.js').Channel} channel
   */
  function isTaskChannel(channel) {
    return (
      channel.type === ChannelType.GuildText &&
      channel.topic &&
      channel.topic.startsWith("task|")
    );
  }
  
  /**
   * @param {import('discord.js').Guild} guild
   */
  function getTaskChannels(guild) {
    return guild.channels.cache.filter((ch) => isTaskChannel(ch));
  }
  
  /**
   * @param {import('discord.js').Guild} guild
   * @param {string} userId
   */
  function getExistingTaskChannel(guild, userId) {
    const taskChannels = getTaskChannels(guild);
   
    return taskChannels.filter((ch) => ch.topic.split("|")[1] === userId).first();
  }
  
  /**
   * @param {import('discord.js').BaseGuildTextChannel} channel
   */

 
 

  
  /**
   * @param {import("discord.js").ButtonInteraction} interaction
   */
  async function handleTaskOpen(interaction) {
   
    const { guild, user } = interaction;
    
    await interaction.showModal(
      new ModalBuilder({
        customId: "TASK_MODAL",
        title: "Catering Information",
        components: [
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("robloxusername")
              .setLabel("What is your Roblox username?")
              .setStyle(TextInputStyle.Short)
              .setRequired(true)
              .setPlaceholder("Make sure it's your Roblox username, not display name")
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("timezone")
              .setLabel("What is your timezone?")
              .setStyle(TextInputStyle.Short)
              .setRequired(true)
              .setPlaceholder("UTC+3")
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("order")
              .setLabel("What would you like to order?")
              .setStyle(TextInputStyle.Paragraph)
              .setRequired(true)
              .setPlaceholder("Keep your order between 5-84 items, and use the exact food name!")
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("timeframe")
              .setLabel("Timeframe")
              .setStyle(TextInputStyle.Short)
              .setRequired(false)
              .setPlaceholder("Caterers can take up to 7 days to finish an order!")
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("notes")
              .setLabel("Any extra notes?")
              .setStyle(TextInputStyle.Paragraph)
              .setRequired(false)
              .setPlaceholder("Don't overcook my food!")
          ),
        ],
      })
    );

    const modal = await interaction
    .awaitModalSubmit({
      time: 2 * 60 * 1000,
      filter: (m) => m.customId === "TASK_MODAL" && m.user.id == interaction.user.id,
    })
    .catch((ex) => {});

  if (!modal) return interaction.followUp({ content: "No response received, cancelling order", ephemeral: true });

  modal.reply({ content: "Channel created! 🔥", ephemeral: true }).catch((ex) => {});

  const robloxusername = modal.fields.getTextInputValue("robloxusername");
  const timezone = modal.fields.getTextInputValue("timezone");
  const order = modal.fields.getTextInputValue("order");
  const timeframe = modal.fields.getTextInputValue("timeframe") || "Not given"
  const notes = modal.fields.getTextInputValue("notes") || "This user left no notes";

    if (!guild.members.me.permissions.has(OPEN_PERMS))
      return interaction.followUp({
        content: "Cannot create task channel, missing `Manage Channel` permission. Contact server manager for help!", ephemeral: true
      });
  
    const alreadyExists = getExistingTaskChannel(guild, user.id);
    if (alreadyExists) return interaction.followUp({content: `You already have an open task!`, ephemeral: true});
  
    const settings = await getSettings(guild);
  
    // limit check
    const existing = getTaskChannels(guild).size;
    if (existing > settings.ticket.limit) return interaction.followUp({content: "There are too many open task channels. Try again later", ephemeral: true});
      
    function getNextTaskID(interaction) {
        let maxId = 0;
        interaction.client.taskdatabase.forEach((value, key) => {
            if (key.startsWith("TaskID-")) {
                const taskId = parseInt(key.split("TaskID-")[1], 10);
  
                if (taskId > maxId) {
                    maxId = taskId;
                }
            }
        });
        return maxId + 1;
    }
    
    // Example usage
   const ee = interaction.client.ticketdatabase.get("task") || 0;
   const newTaskID = Number(ee) + 1;
   if(newTaskID == 1){
    
    interaction.client.ticketdatabase.set("task", newTaskID)
   }else{
    interaction.client.ticketdatabase.delete("task")
    interaction.client.ticketdatabase.set("task", newTaskID)
   }
    
   
  
    try {
      const taskNumber = newTaskID
      const permissionOverwrites = [
        {
          id: guild.roles.everyone,
          deny: ["ViewChannel"],
        },
        {
          id: user.id,
          allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
        },
        {
          id: guild.members.me.roles.highest.id,
          allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
        },
        {
          id: require("@root/config").BLOXBURG_ORDERS.ROLE_ID,
          allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
        },
        {
          id: require("@root/config").BLOXBURG_ORDERS.CATETER_MANAGER,
          allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
        },
        {
          id: require("@root/config").BLOXBURG_ORDERS.CATERING_DEPT,
          allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
        }
      ];
  
    
        const category = await interaction.guild.channels.cache.get(require("@root/config").BLOXBURG_ORDERS.STARTER_CATEGORY)

     
      const taskChannel = await guild.channels.create({
        name: `🍽﹒unclaimed-${taskNumber}`,
        type: ChannelType.GuildText,
        topic: `task|${user.id}`,
        permissionOverwrites,
        parent: category
      });
  
      const embed = new EmbedBuilder()
        .setAuthor({ name: `Task #${taskNumber}` })
        .setDescription(
          `Hello ${user.toString()}
          Someone will be with you shortly`
        )

        .setColor(TICKET.CREATE_EMBED)
        .addFields(
          {
            name: "Roblox Username",
            value: `${robloxusername}`
          },
          {
            name: "Timezone", value: `${timezone}`
          },
          {
            name: "Orders", value: `\`\`\`${order}\`\`\``
          },
          {
            name: "Timeframe", value: `${timeframe}`
          },
          {
            name: "Notes:", value: `\`\`\`${notes}\`\`\``
          },
          {
            name: "Official Channel", value: `<#${taskChannel.id}>`
          }
        )
  
     
  
      const sent = await taskChannel.send({ content: `<@&${require("@root/config").BLOXBURG_ORDERS.ROLE_ID}> ${user.toString()}`, embeds: [embed] });
  
      const dmEmbed = new EmbedBuilder()
        .setColor(TICKET.CREATE_EMBED)
        .setAuthor({ name: "Order Created" })
        .setThumbnail(guild.iconURL())
        .setDescription(
          `**Server:** ${guild.name}`
        );
  
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel("View Channel").setURL(sent.url).setStyle(ButtonStyle.Link)
      );
  
      user.send({ embeds: [dmEmbed], components: [row] }).catch((ex) => {});
  
      const info = {
        ClientID: interaction.user.id,
        Orders: [],
        ChannelID: taskChannel.id
      }
      interaction.client.taskdatabase.set(`TaskID-${taskNumber}`, info)

    } catch (ex) {
      error("handleTaskOpen", ex);
      return interaction.editReply("Failed to create channel, an error occurred!");
    }
  }

  /**
 * @param {import('discord.js').BaseGuildTextChannel} channel
 * @param {import('discord.js').User} claimedBy
 * @param {import('discord.js').User} client
 * @param {import('discord.js').Embed} orderEmbed
 */
async function finishTask(channel, claimedBy, client, orderEmbed) {
  

  try {
    const config = await getSettings(channel.guild);
    const messages = await channel.messages.fetch();
    const reversed = Array.from(messages.values()).reverse();

    let content = "";
    reversed.forEach((m) => {
      content += `[${new Date(m.createdAt).toLocaleString("en-US")}] - ${m.author.username}\n`;
      if (m.cleanContent !== "") content += `${m.cleanContent}\n`;
      if (m.attachments.size > 0) content += `${m.attachments.map((att) => att.proxyURL).join(", ")}\n`;
      content += "\n";
    });

    const logsUrl = await postToBin(content, `Task Logs for ${channel.name}`);
    

    const components = [];
    if (logsUrl) {
      components.push(
        new ActionRowBuilder().addComponents(
          new ButtonBuilder().setLabel("Transcript").setURL(logsUrl.short).setStyle(ButtonStyle.Link)
        )
      );
    }

   

    const embed = new EmbedBuilder().setAuthor({ name: "Task Ended" }).setColor(TICKET.CLOSE_EMBED);
    const fields = [];
    
    
    fields.push(
      {
        name: "Customer",
        value: `<@${client}> (${client})`,
        inline: true,
      },
      {
        name: "Claimed By",
        value: claimedBy,
        inline: true,
      }
    );

    embed.setFields(fields);

    // send embed to log channel
    const channelID = require("@root/config").BLOXBURG_ORDERS.CATERING_LOGS
    if (channelID) {
      const logChannel = channel.guild.channels.cache.get(channelID);
      logChannel.safeSend({ embeds: [orderEmbed, embed], components });
    }

   

    return "SUCCESS";
  } catch (ex) {
    error("finishTask", ex);
    return "ERROR";
  }
}

async function deleteChannel(interaction){
  const channelID = interaction.channel.id;
  const channel = interaction.client.channels.cache.get(channelID)
  channel.delete(`Was told to delete it by ${interaction.user.username}`)
  .then(() => {

  })
  .catch(console.error);
}

  /**
 * @param {import('discord.js').Interaction} interaction

 */
async function deleteReport(interaction){
  function extractNumbers(str) {
    // Regular expression to match one or more digits
    const numberRegex = /\d+/g;
  
    // Extract numbers using the regular expression
    const numbers = str.match(numberRegex);
  
    // Convert extracted numbers to numbers if needed
    const numericNumbers = numbers ? numbers.map(Number) : [];
  
    return numericNumbers;
  }
  const ID = extractNumbers(interaction.channel.name)
  
  const {client} = interaction


 

  await interaction.showModal(
    new ModalBuilder({
      customId: "report_delete",
      title: "Are you sure you want to delete this report?",
      components: [
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("reason")
            .setLabel("Reason")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false)
            .setPlaceholder("Leave empty if wanted")
        )
      ],
    })
  );


  const modal = await interaction
    .awaitModalSubmit({
      time: 2 * 60 * 1000,
      filter: (m) => m.customId === "report_delete",
    })
    .catch((ex) => {});

  if (!modal) return interaction.followUp({ content: "No response received, cancelling deleting report process" });

  modal.reply({ content: "Deleted" }).catch((ex) => {});

  const reason = modal.fields.getTextInputValue("reason") || "No reasons were given";
  
  const report = client.reportdatabase.get(`Report-${ID}`);
  const user = interaction.guild.members.cache.get(report.User).user;
  const embed11 = new EmbedBuilder().setColor(require("@root/config").EMBED_COLORS.SUCCESS)
  .setTitle("This report has been deleted")
  .setDescription(`Reason given:\n\`\`\`${reason}\`\`\``)
  user.send({
    embeds: [embed11]
  });
  client.reportdatabase.delete(`Report-${ID}`)
  interaction.channel.delete();



}

  module.exports = {
    getTaskChannels,
    getExistingTaskChannel,
    isTaskChannel,
    handleTaskOpen,
    finishTask,
    deleteChannel,
    deleteReport
  };
  