const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ApplicationCommandOptionType,
    ButtonStyle,
    MessageCollector
  } = require("discord.js");
  const { stripIndent } = require("common-tags");

const { bannedWords } = require("../../bannedwords")

function containsBannedWords(inputString) {
    const lowerCaseInput = inputString.toLowerCase();
    for (const word of bannedWords) {
        if (lowerCaseInput.includes(word.toLowerCase())) {
            return true;
        }
    }
    return false;
}
  /**
   * @type {import("@structures/Command")}
   */
  module.exports = {
    name: "confess",
    description: "submit an anonymous confession",
    category: "CONFESSION",
    cooldown: 1,
    command: {
      enabled: false,
      usage: "[confession]",
      minArgsCount: 1,
    },
    slashCommand: {
      enabled: true,
      options: [
        {
          name: "confession",
          description: "the confession (you can use this if your DMs are closed)",
          type: ApplicationCommandOptionType.String,
          required: false,
        },
      ],
      ephemeral: true
    },
    async interactionRun(interaction, data) {
      const settings = data.settings
      if (!settings.confessions.enabled) return await interaction.followUp("Confession system is disabled.");
    if (!settings.confessions.channel_id) return await interaction.followUp("Confession channel not configured!");
  const channel = interaction.member.guild.channels.cache.get(settings.confessions.channel_id);
    if (!channel) return await interaction.followUp("Confession channel not found!");

   
    
        let confession = interaction.options.getString("confession");
        if (!confession || confession === "" || confession === null) {
          await interaction.followUp("I sent you a DM!");
          interaction.user.send("Hello! I hear that you want to make an anonymous confession! Please write your confession after this message.")
            .then((messageM) => {
                const dmChannel  = interaction.user.dmChannel
              const filter = message => message.author.id === interaction.user.id;
              const collector = dmChannel.createMessageCollector({ filter, time: 120_000, max: 1 });
      
              collector.on('collect', message => {
              
                if (containsBannedWords(message.content)) {
                    dmChannel.send("Your confession has bad words in it, I can't post that, I have a reputation to keep up with!")
                    return
                 } 
                interaction.user.send(`Are you sure you want to send this confession?\n\n\`\`\`${message.content}\`\`\``)
                .then((m) => {
                    m.react("✅")
                    m.react("⛔")
                    const collectorFilter = (reaction, user) => {
                        return (reaction.emoji.name === '✅' || reaction.emoji.name === '⛔') && user.id === message.author.id;
                    };
                    
                    const collector = m.createReactionCollector({ filter: collectorFilter, time: 120_000, max: 1 });
                    
                    collector.on('collect', async (reaction, user) => {
                        const name = reaction.emoji.name;
                        if(name == "⛔"){
                            collector.stop()
                            return dmChannel.send("Cancelled confession, don't worry though your secrets are safe with me!")
                           
                        }else if(name =="✅"){
                        const response = await confess(interaction.member, message.content, data.settings);
                       
                        dmChannel.send(response)
                        collector.stop()
                        }else{
                            collector.stop()
                            return dmChannel.send("What emoji is that?")
                        }
                    });
                    
                    collector.on('end', collected => {
                     
                        if (collected.size === 0) {
                            dmChannel.send('You did not react properly, cancelled.');
                            return;
                          }
                    });
                })
              
                collector.stop();
              });
      
              collector.on('end', collected => {
                if (collected.size === 0) {
                  dmChannel.send('You did not send any confession within the time limit.');
                } else {
                 
                }
              });
            })
            .catch(async err => {
              await interaction.followUp({
                content: "It appears your DMs are closed, please fill out the confession value when using the slash command.",
                ephemeral: true
              })
            });
        } else {
            if (containsBannedWords(confession)) {
               await interaction.followUp("Your confession has bad words in it, I can't post that, I have a reputation to keep up with!")
               return
            } else {
                const response = await confess(interaction.member, confession, data.settings);
                await interaction.followUp(response)
            }
         
          
        }
      }
  };
  
  /**
   * @param {import('discord.js').GuildMember} member
   * @param {string} confession
   * @param {object} settings
   */
  async function confess(member, confession, settings) {
    
    if (!settings.confessions.enabled) return "Confession system is disabled.";
    if (!settings.confessions.channel_id) return "Confession channel not configured!";
    const channel = member.guild.channels.cache.get(settings.confessions.channel_id);
    if (!channel) return "Confession channel not found!";
  
    const embed = new EmbedBuilder()
      .setAuthor({ name: "New Confession" })
      .setColor(require("../../../config").EMBED_COLORS.BOT_EMBED)
      .setDescription(
        stripIndent`
          ${confession}
        `
      )
      .setFooter({
        text: "To confess something, use the /confess command"
      })
      .setTimestamp();
  
    try {
      const sentMsg = await channel.send({
        embeds: [embed]
      });

  
      return "I successfully sent your confession!";
    } catch (ex) {
      member.client.logger.error("confess", ex);
      return "Failed to send message to confessions channel!";
    }
  }
  
