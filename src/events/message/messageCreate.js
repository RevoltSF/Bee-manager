const { commandHandler, automodHandler, statsHandler } = require("@src/handlers");
const { PREFIX_COMMANDS, EMBED_COLORS } = require("@root/config");
const { getSettings } = require("@schemas/Guild");
const { getUser} = require("@schemas/User")
const { WORKSTATS} = require("@root/config")
const run = require("@handlers/chatHandler")
function extractNumbers(str) {
  // Regular expression to match one or more digits
  const numberRegex = /\d+/g;

  // Extract numbers using the regular expression
  const numbers = str.match(numberRegex);

  // Convert extracted numbers to numbers if needed
  const numericNumbers = numbers ? numbers.map(Number) : [];

  return numericNumbers;
}

const { ModalBuilder,ActionRowBuilder, ChannelType, ButtonStyle, EmbedBuilder, ButtonBuilder, ComponentType, AttachmentBuilder, TextInputComponent, TextChannel, TextInputStyle, TextInputBuilder } = require("discord.js");
const ping = require("@root/src/commands/information/ping");

/**
 * @param {import('@src/structures').BotClient} client
 * @param {import('discord.js').Message} message
 */
module.exports = async (client, message) => {
try {
    // Check if the message is from the counting bot (replace 'BOT_ID' with actual bot ID)
    if (message.author.id === "510016054391734273" && message.embeds.length > 0) {
      const embed = message.embeds[0];

      // Ensure it's the correct embed (e.g., containing "Save donated!")
      if (embed.title && embed.title.includes("Save donated!")) {
        let userId = null;

        // Check if the message is a reply to a user's command
        if (message.reference) {
          const referencedMessage = await message.channel.messages.fetch(message.reference.messageId).catch((err) => {
            console.error("Error fetching referenced message:", err);
            return null;
          });

          if (referencedMessage) {
            userId = referencedMessage.author.id;
          }
        }

        // If no user ID is found, exit the function
        if (!userId) {
          console.log("No referenced user found.");
          return;
        }

        const guild = message.guild;
        const member = await guild.members.fetch(userId).catch((err) => {
          console.error("Error fetching member:", err);
          channel.send("Could not fetch the member.");
          return null;
        });

        // If the member is found, proceed to check their role
        if (member) {
          const roleId = "1267959009227571373"; // Replace with the actual role ID

          if (member.roles.cache.has(roleId)) {
            await member.roles.remove(roleId);
            console.log(`<@${userId}> has donated a save, and their role has been removed.`);

            // Send a confirmation message in the channel
            await message.channel.send(`<@${userId}> has donated a save and their role has been removed.`);
          } else {
            console.log(`<@${userId}> does not have the role.`);
          }
        } else {
          console.log(`Could not find member with ID ${userId}.`);
          await channel.send("Could not find the member.");
        }
      }
    }
  } catch (error) {
    console.error("An error occurred:", error);
    await channel.send("An error occurred while processing your request.");
  }

  if (message.guild && !message.author.bot && message.channel.name.trim().startsWith("report")) {
    message.react("1275446680199630879");
    const reply = await message.reply({content: "If you want to send that message to the user, then react with <:delivery:1275446680199630879>. You have 30 seconds"});
    const collectorFilter = (reaction, user) => {
      return reaction.emoji.id === '1275446680199630879' && user.id === message.author.id;
    };

    const collector = message.createReactionCollector({ filter: collectorFilter, time: 30_000 });

collector.on('collect', async (reaction, user) => {
	
  const reportID = extractNumbers(message.channel.name);
  let info = []
  client.reportdatabase.forEach((value, key) => {
    
    if(key.endsWith(reportID)) info.push(value)
  })
const userID = info[0].User;
const channelID = info[0].Channel;
if(channelID !== message.channelId) return message.channel.send("Who are you trying to fool?");
const userDM = message.guild.members.cache.get(userID).user;
  await userDM.createDM();
  const textEmbed = new EmbedBuilder().setColor(require("@root/config").EMBED_COLORS.ERROR)
  .setTitle("Reports")
  .setDescription(`Hey there! Someone just responded, here is what they said:\n\`\`\`${message.content}\`\`\``)
  .setFooter({
    text: message.guild.name,
    iconURL: message.guild.iconURL()
  });
  let buttonsRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("server").setLabel(`Sent by the admins of B.E.E. Hive - Bloxburg Excellent Employees`).setStyle(ButtonStyle.Secondary).setDisabled(true),
  );
  userDM.send({
    embeds: [textEmbed],
    components: [buttonsRow]
  })
  await reply.edit({ content: "Done!" })
});

collector.on('end', async collected => {
  if(collected.size == 0){
  message.reactions.removeAll()
	await reply.edit({ content: "Cancelled." })
  }
});
  }
  if(!message.guild && !message.author.bot){
    let channelID;
    let ID;
    client.reportdatabase.forEach((value, key, index) => {

      if(value.User == message.author.id) {
        channelID = value.Channel;
        ID = extractNumbers(key)
       
      }
      else if (!client.reportdatabase.first()) {
        channelId = "none";
      }else{
        channelID = "none"
      }
      

    });
  
    if(channelID){
      const channel = client.guilds.cache.get("1256349528190222386").channels.cache.get(channelID);

      if(!channel) {
        client.reportdatabase.delete(`report-${ID}`)
        return message.reply("Oops! It appears your report channel has been deleted. You may reopen a report after this message. Make sure to let everyone know that you had a report ticket open before.")
      }
      const embedMaybeFinale = new EmbedBuilder().setColor(require("@root/config").EMBED_COLORS.BOT_EMBED)
      .setTitle("New message!")
      .setDescription(`A new message has been sent`)
      .addFields({
        name: "Content:", value: `\`\`\`${message.content}\`\`\``
      })
      .setTimestamp()
      .setFooter({
        text: "DO NOT TOUCH THIS CHANNEL"
      });

      channel.send({
        embeds: [embedMaybeFinale]
      });
      return message.channel.send("Done! I just sent the message, expect a reply soon.")
      return
    }
   
    const embed = new EmbedBuilder().setColor(require("@root/config").EMBED_COLORS.ERROR)
    .setTitle("Reports")
    .setDescription("Hey there! Wanna report something anonymously? Fill out the form below!")
    .setFooter({
      text: 'You have 120 seconds'
    })
    const sentMsg = await message.channel.send({
      embeds: [embed],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId("form").setLabel("Form").setStyle(ButtonStyle.Primary)
        ),
      ],
    });
    const channel = message.channel;
  
    const btnInteraction = await channel
      .awaitMessageComponent({
        componentType: ComponentType.Button,
        filter: (i) => i.customId === "form" && i.message.id === sentMsg.id,
        time: 120000,
      })
      .catch((ex) => {});
  
    if (!btnInteraction) return sentMsg.edit({ content: "No response received", components: [] });
  
    await btnInteraction.showModal(
      new ModalBuilder({
        customId: "report_form",
        title: "Report Form",
        components: [
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("user")
              .setLabel("Who are you reporting?")
              .setStyle(TextInputStyle.Short)
              .setRequired(false)
              .setPlaceholder("(Ignore if not applicable or if you wanna leave empty)")
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("report")
              .setLabel("What are you reporting?")
              .setStyle(TextInputStyle.Paragraph)
              .setRequired(true)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("notes")
              .setLabel("Notes")
              .setStyle(TextInputStyle.Paragraph)
              .setRequired(false)
          ),
        ],
      })
    );
    function generateRandom5DigitNumber() {
      // Generate a random number between 10000 and 99999
      return Math.floor(Math.random() * 90000) + 10000;
    }
    const reportID = generateRandom5DigitNumber()
  
    const modal = await btnInteraction
      .awaitModalSubmit({
        time: 2 * 60 * 1000,
        filter: (m) => m.customId === "report_form",
      })
      .catch((ex) => {});
  
    if (!modal) return sentMsg.edit({ content: "No response received, cancelling reporting process", components: [] });
  
    modal.reply({ content: "Report sent! Expect a reply soon.\n\nMake sure you keep your DMs open." }).catch((ex) => {});
  
    const user = modal.fields.getTextInputValue("user") || "No users were given";
    const report = modal.fields.getTextInputValue("report");
    const notes = modal.fields.getTextInputValue("notes") || "No notes were given";
      const guild = client.guilds.cache.get("1256349528190222386");
    const getCategory = guild.channels.cache.get("1267959169055457352");
    const permissionOverwrites = [
      {
        id: guild.roles.everyone,
        deny: ["ViewChannel"],
      }
    ];
    const newChannel = await guild.channels.create({
      name: `report-${reportID}`,
      type: ChannelType.GuildText,
      topic: `DO NOT CHANGE THE NAME OF THIS TICKET!`,
      parent: getCategory,
      permissionOverwrites: permissionOverwrites,
    });

    const lastEmbed = new EmbedBuilder().setColor(require("@root/config").EMBED_COLORS.BOT_EMBED)
    .setTitle("We have a new report!")
    .setDescription(`The user who reported is anonymous`)
    .addFields(
      { name: "Who they reported:", value: `${user}`},
      { name: "The report:", value: `\`\`\`${report}\`\`\``},
      { name: "Notes:", value: `\`\`\`${notes}\`\`\``}
    )
    .setTimestamp()
    .setFooter({
      text: "If the user used a bad word, let Ara know."
    });
    let buttonsRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("DELETE_REPORT").setLabel(`Delete Report`).setStyle(ButtonStyle.Danger).setDisabled(false),
    );
     newChannel.send({
      content: "<:BEEexcl:1275443033214816379> DO NOT RENAME/DELETE/EDIT THIS CHANNEL IN ANY CIRCUMSTANCES UNLESS ARA IS INFORMED<:BEEexcl:1275443033214816379>", 
      embeds: [lastEmbed],
      components: [buttonsRow]
    })
    const info = {
      Channel: newChannel.id,
      User: message.author.id
    }
    client.reportdatabase.set(`Report-${reportID}`, info)
    



  }
  if (!message.guild || message.author.bot) return;
  const settings = await getSettings(message.guild);

  if(message.channelId == require("@root/config").PROOFS.CHANNELID){
  
    if (!message.attachments.first()) {
    
    } else {
     
     
      const isVideo = message.attachments.some((a) => a.contentType?.split('/')[0] === 'video');
      const isImage = message.attachments.some((a) => a.contentType?.split('/')[0] === 'image');
    
      if (isVideo) {
        return
      } else if (isImage) {
        const image = message.attachments.first()

        const channel = message.guild.channels.cache.get(WORKSTATS.proofManagement);
        let buttonsRow1 = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId("shiftmanager").setStyle(ButtonStyle.Primary).setLabel("Shift Manager's Shift").setEmoji("1275544243410174085"),
          new ButtonBuilder().setCustomId("fellowworker").setStyle(ButtonStyle.Primary).setLabel("Fellow Worker's Shift").setEmoji("1275544750988066948")
        );
        const users = [{id: message.author.id, name: message.author.username}]
        message.attachments.forEach(async attach => {
          let pings = "";
          users.forEach((user, i) => {
           if(i+1 == users.length){
            pings = `${pings} ${user.name} (<@${user.id}>).`
           }
            else pings = `${pings} ${user.name} (<@${user.id}>), `
          })
          const embed = new EmbedBuilder().setColor(EMBED_COLORS.BOT_EMBED)
          .setTitle("Information")
          .addFields(
            { name: "Type", value: `Undefined`},
            { name: "Users", value: `${pings}`},
            { name: "Group Photo", value: `Undefined (Default: No)`},
            { name: "Double XP", value: `Undefined (Default: No)`},
          )
          await channel.send({
            files: [attach],
            components: [buttonsRow1],
            embeds: [embed]
          })
        })

       

      } 
    }
    
    
  }

  const text = (message.content).toLocaleLowerCase()
  if(message.channel.id == "1275425872790294588"){
    try {
      await message.channel.sendTyping();
      const prompt = `You're in a fun Discord group called "${message.guild.name}".
${message.author.username} who just said: "${message.content}"
You're their Bloxburg-loving, chaos-enjoying bestie.  
Your job: vibe with them casually—but if their message relates to building, money, mood, RP, gamepasses, glitches, or tea...  
**sneak in a Bloxburg tip, trick, or secret.**  
Only drop a tip *if it makes sense* in the flow.  
Keep it short, playful, and under 2000 characters.  
No coding. No help desk tone. No boring bot energy.  
You're here to gossip, joke, and casually flex Bloxburg knowledge.`
      const reply = await run(message, prompt);
      if (reply) {
        message.reply(reply)
        .catch(() => {
           message.reply("It appears the AI tried to send more than 2000 characters, try using a more simple prompt on the bot!")
        })
      }
    } catch (error) {
      console.error("Error using API:", error);
    }
  }
  if(text.includes("nbh")){
    
    message.reply(`Our Neighborhood Code is **SkillsLevelUpBro**`)
  } else if (text.includes("next shift")) {
    message.reply(`Want to know when the next shift is? Shifts are often spontaneous, but you can check <#1267959202433732608> or make sure there isn't one now in <#1267959203486502963>. Read all about it in [Work Shifts Info](https://discord.com/channels/1256349528190222386/1389452028727656648)`)
  } else if (text.includes("You have used 1 guild save! There are 0/2 guild saves left.")) {
      message.reply(`<@&1424600322789347379>`)
  }

  const Stickychannel = `1270650570222469171`;
  if (message.channel.id !== Stickychannel || message.author.bot) return;

  const embedColor = require("@root/config").EMBED_COLORS.BOT_EMBED;
  const embed = new EmbedBuilder()
    .setColor(embedColor)
    .setTitle(`Partners!`)
    .setDescription(`Thank you for partnering with the B.E.E. Hive!!\nJoin us for some shifts, and ***get that money, honey***!!`)

  const stickyData = message.client.ticketdatabase.get('sticky') || {};
  const stickyMessageId = stickyData[Stickychannel];
  if (stickyMessageId) {
    try {
      const oldMessage = await message.channel.messages.fetch(stickyMessageId);
      await oldMessage.delete();
    } catch (err) {
      console.warn(`No previous sticky to delete or failed to delete: ${err.message}`);
    }
  } else {
    console.log(`This is the first sticky message for channel ${Stickychannel}`);
  }

  // Send new sticky message
  // const sent = await message.channel.send({ embeds: [embed] });

  // Save updated ID to the database
  stickyData[Stickychannel] = sent.id;
  message.client.ticketdatabase.set('sticky', stickyData);

  const webhookchannel = `1275407148314263562`;

  if (message.webhookId && message.channel.id === webhookchannel) {
    try {
      const mentionedUser = message.mentions.users.first();

      let threadName = "User's Application";
      if (mentionedUser) {
        threadName = `${mentionedUser.username}'s Application`;
      }

      const thread = await message.startThread({
        name: threadName,
        autoArchiveDuration: 10080, // 7 days
      });

      console.log(`Created thread: ${thread.name}`);
    } catch (err) {
      console.error("Failed to create thread:", err);
    }
  }


  // Command handler
  let isCommand = false;
  if (PREFIX_COMMANDS.ENABLED) {
    // Check for bot mentions
    if (message.content.includes(`${client.user.id}`)) {
      message.channel.send(`> My prefix is \`${settings.prefix}\``);
    }
    

    if (message.content && message.content.startsWith(settings.prefix)) {
      const invoke = message.content.slice(settings.prefix.length).split(/\s+/)[0];
      const cmd = client.getCommand(invoke);
      if (cmd) {
        isCommand = true;
        commandHandler.handlePrefixCommand(message, cmd, settings);
      }
    }
  }

 

  // Stats handler
  if (settings.stats.enabled) await statsHandler.trackMessageStats(message, isCommand, settings);

  // Automod handler
  if (!isCommand) await automodHandler.performAutomod(message, settings);
};
