
const { parsePermissions } = require("@helpers/Utils");
const { ApplicationCommandOptionType, ChannelType, EmbedBuilder } = require("discord.js");

const CHANNEL_PERMS = ["ViewChannel", "SendMessages", "EmbedLinks", "ManageMessages", "ReadMessageHistory"];

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "shiftmanagement",
  description: "configure shift system",
  category: "BLOXBURG",
  userPermissions: ["ManageGuild"],

  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
      {
        name: "channel",
        description: "configure shift channel or disable it",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "channel_name",
            description: "the channel where shifts will be sent",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: true,
          },
        ],
      },
      {
        name: "role",
        description: "configure the roles the bot should ping",
        type: ApplicationCommandOptionType.Subcommand,
        options: [  
          {
          name: "coeptus-center-uk",
          description: "set the role for Coeptus Center UK",
          type: 8,
          required: true
      },
      {
          name: "bloxy-acres-americas",
          description: "set the role for Bloxy Acres Americas",
          type: 8,
          required: true
      },
      {
          name: "riverside-estates-oceania",
          description: "set the role for Riverside Estates Oceania",
          type: 8,
          required: true
      },
      {
          name: "dominus-hwy-global",
          description: "set the role for Dominus Hwy Global",
          type: 8,
          required: true
      },
      ],
      },
      {
        name: "allowedchannel",
        description: "configure the allowed channel",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "channel_name",
            description: "the channel where shift commands can be used in",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: true,
          },
        ],
      },
    ],
  },




  async interactionRun(interaction, data) {
    const sub = interaction.options.getSubcommand();
    let response;

    

    // channel
     if (sub == "channel") {
      const channel = interaction.options.getChannel("channel_name");
      
  if (!channel.permissionsFor(channel.guild.members.me).has(CHANNEL_PERMS)) {
    return interaction.followUp(`I need the following permissions in ${channel}\n${parsePermissions(CHANNEL_PERMS)}`);
  }

  const logchannelID = require("@root/config").SHIFTS.LOG
  interaction.client.channels.fetch(logchannelID)
  .then(async (logChannel) => {
      const color = require("@root/config").EMBED_COLORS.BOT_EMBED
      
      const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(`${interaction.user.username} just used the /shiftmanagement command!`)
      .setDescription(`The author changed the shift-announcement channel to <#${channel.id}>`)
      logChannel.send({
          content: `Author: <@${interaction.user.id}>`,
          embeds: [embed],
          allowedMentions: {
              parse: null
          }
      })

})
  interaction.client.shiftdatabase.delete('channelID-')
  interaction.client.shiftdatabase.set('channelID-', channel.id)
  
  return interaction.followUp(`Successfully set <#${channel.id}> as the channel for shifts to be posted at.`)
    }else if(sub =="role"){
      const oldCoeptus = interaction.client.shiftdatabase.get("coeptus-")
      const oldRiverside = interaction.client.shiftdatabase.get("riverside-")
      const oldBloxy = interaction.client.shiftdatabase.get("bloxy-")
      const oldDominus = interaction.client.shiftdatabase.get("dominus-")
     
 
 
         const coeptusCenterUk = (interaction.options.getRole("coeptus-center-uk")).id
         const bloxyAcresAmericas = (interaction.options.getRole("bloxy-acres-americas")).id
         const riversideEstatesOceania = (interaction.options.getRole("riverside-estates-oceania")).id
         const dominusHwy = (interaction.options.getRole("dominus-hwy-global")).id
         interaction.client.shiftdatabase.delete("coeptus-")
         interaction.client.shiftdatabase.delete("riverside-")
         interaction.client.shiftdatabase.delete("bloxy-")
         interaction.client.shiftdatabase.delete("dominus-")
         interaction.client.shiftdatabase.set("coeptus-", coeptusCenterUk)
         interaction.client.shiftdatabase.set("bloxy-", bloxyAcresAmericas)
         interaction.client.shiftdatabase.set("riverside-", riversideEstatesOceania)
         interaction.client.shiftdatabase.set("dominus-", dominusHwy)
        
         await interaction.followUp({
             content: "Successfully set the roles.",
             ephemeral: true
         });
 
         
         const logchannelID = require("@root/config").SHIFTS.LOG;
         interaction.client.channels.fetch(logchannelID)
         .then(async (channel) => {
             const color = require("@root/config").EMBED_COLORS.BOT_EMBED
             
             const embed = new EmbedBuilder()
             .setColor(color)
             .setTitle(`${interaction.user.username} just used the \`/shiftmanagement role\` command!`)
             .setDescription(`The author changed the roles!`)
             .addFields(
                 {
                     name: "Dominus HWY Global",
                     value: `<@&${oldDominus}> -> <@&${dominusHwy}>`
                 },
                 {
                     name: "Riverside Estates Oceania",
                     value: `<@&${oldRiverside}> -> <@&${riversideEstatesOceania}>`
                 },
                 {
                     name: "Bloxy Acres Americas",
                     value: `<@&${oldBloxy}> -> <@&${bloxyAcresAmericas}>`
                 },
                 {
                     name: "Coeptus Center UK",
                     value: `<@&${oldCoeptus}> -> <@&${coeptusCenterUk}>`
                 }
             )
             channel.send({
                 content: `Author: <@${interaction.user.id}>`,
                 embeds: [embed],
                 allowedMentions: {
                     parse: null
                 }
             })
       
     })
    }else if(sub =="allowedchannel"){
      
        const channel = interaction.options.getChannel("channel_name");
        
    if (!channel.permissionsFor(channel.guild.members.me).has(CHANNEL_PERMS)) {
      return interaction.followUp(`I need the following permissions in ${channel}\n${parsePermissions(CHANNEL_PERMS)}`);
    }
  
    const logchannelID = require("@root/config").SHIFTS.LOG
    interaction.client.channels.fetch(logchannelID)
    .then(async (logChannel) => {
        const color = require("@root/config").EMBED_COLORS.BOT_EMBED
        
        const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(`${interaction.user.username} just used the /shiftmanagement command!`)
        .setDescription(`The author changed the allowed channel to <#${channel.id}>`)
        logChannel.send({
            content: `Author: <@${interaction.user.id}>`,
            embeds: [embed],
            allowedMentions: {
                parse: null
            }
        })
  
  })
  interaction.client.shiftdatabase.delete('allowedchannelID-')
  interaction.client.shiftdatabase.set('allowedchannelID-', channel.id)
    
    return interaction.followUp(`Successfully set <#${channel.id}> as the channel for shifts to be posted at.`)
      }
    

  },
};

