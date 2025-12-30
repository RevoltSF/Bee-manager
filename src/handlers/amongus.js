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
    UserSelectMenuBuilder,
  } = require("discord.js");
  const { generateDependencyReport, AudioPlayerStatus, AudioPlayer, joinVoiceChannel, createAudioResource, createAudioPlayer } = require("@discordjs/voice")
 const amongusteamrole = "1267959090999595110"
  function extractNumbers(string) {
    // Use a regular expression to find all occurrences of Discord mentions
    const mentionPattern = /<@(\d+)>/g;
    let matches;
    let ids = [];

    // Loop through all the matches and extract the IDs
    while ((matches = mentionPattern.exec(string)) !== null) {
        ids.push(matches[1]);
    }

    return ids;
}
const player = createAudioPlayer()
player.on(AudioPlayerStatus.Playing, () => {
    console.log("Audio Player is ON")
})
player.on("error", error => {
    console.error("We got a fucking error: " +  error.message)
})


  // schemas
  const { getSettings } = require("@schemas/Guild");
  

const { EMBED_COLORS, WORKSTATS } = require("@root/config");
const { error } = require("console");

   /**
   * @param {import("discord.js").ButtonInteraction} interaction
   */
   async function handleStart(interaction){
    await interaction.deferReply({ ephemeral: true })
    const mainchannelID = interaction.message.embeds[0].fields[0].value
    const staffchannelID = interaction.message.embeds[0].fields[1].value
    const state = interaction.message.embeds[0].fields[2].value;
    if(state == "Game in progress"){
        await interaction.followUp("Game is already started")
        return;
    }
    const mainchannel = interaction.guild.channels.cache.get(mainchannelID)
    const staffchannel = interaction.guild.channels.cache.get(staffchannelID)
 
    const members = mainchannel.members;
    const content = interaction.message.content;
    let message = ``;
    if(content.endsWith("happened yet.")){
        message = `# History`
    }else{
        message = content;
    }
    let staffs = ``;
    let users = ``;
    members.forEach(async member => {

        if(member.user.id !== interaction.client.user.id){


        const hasRole = member.roles.cache.some(role => role.id === amongusteamrole);
        if(hasRole){
            member.voice.setChannel(staffchannel)
            staffs = `${staffs} | ${member.nickname || member.user.username}`
        }else{
            member.voice.setMute(true)
            users = `${users} | ${member.nickname || member.user.username}`
        }
    }
    })
    const toadd = `- Commanded by <@${interaction.user.id}> to start the game. Moved all the staff members to <#${staffchannelID}> and muted everyone else in <#${mainchannelID}>.`

    const toedit = `${message}\n${toadd}`
    let components = [];
    components.push(
      new ButtonBuilder().setCustomId("startgame").setStyle(ButtonStyle.Success).setLabel("Start Game").setEmoji("1296022147201765420").setDisabled(true),
      new ButtonBuilder().setCustomId("pausegame").setEmoji("1296022171495305298").setStyle(ButtonStyle.Secondary).setLabel("Pause Game"),
      new ButtonBuilder().setCustomId("clearhistory").setEmoji("1296022603479388160").setStyle(ButtonStyle.Danger).setLabel("Clear History"),
      new ButtonBuilder().setCustomId("alarm").setStyle(ButtonStyle.Danger).setLabel("Alarm (15 seconds)"),

    );
  
    let buttonsRow = interaction.message.components;
    const firstRow = new ActionRowBuilder().addComponents(components)
    const secondRow = buttonsRow[1]
    const thirdRow = buttonsRow[2]

    const embed = new EmbedBuilder().setColor(require("@root/config").EMBED_COLORS.BOT_EMBED)
    .addFields(
        { name: "‎ ", value: mainchannel.id},
        { name: "‎ ", value: staffchannel.id},
        { name: "Current State:", value: "Game in progress"}
    )
    interaction.message.edit({
        content: toedit,
        embeds: [embed],
        components: [firstRow, secondRow, thirdRow]
    })
    interaction.followUp({
        content: "Done"
    })

   

    const resource = createAudioResource("audios/start.mp3")
    player.play(resource)
    const connection = joinVoiceChannel({
        channelId: mainchannelID,
        guildId: interaction.guild.id,
        adapterCreator: mainchannel.guild.voiceAdapterCreator
    })
    const subscriptions = connection.subscribe(player)
    if(subscriptions){
        setTimeout(() => {
            subscriptions.unsubscribe()
        }, 15_000)
    }
  
   }

   /**
   * @param {import("discord.js").ButtonInteraction} interaction
   */
   async function handlePause(interaction){
    await interaction.deferReply({ ephemeral: true })
    const mainchannelID = interaction.message.embeds[0].fields[0].value
    const staffchannelID = interaction.message.embeds[0].fields[1].value
    const state = interaction.message.embeds[0].fields[2].value;
    if(state == "Game is paused"){
        await interaction.followUp("Game is already paused")
        return;
    }else if(state == "Untouched."){
        await interaction.followUp("You cannot pause a game that hasn't started??")
    }
    const mainchannel = interaction.guild.channels.cache.get(mainchannelID)
    const staffchannel = interaction.guild.channels.cache.get(staffchannelID)
    const members = mainchannel.members;
    const staffs = staffchannel.members
    const content = interaction.message.content;
    let message = ``;
    if(content.endsWith("happened yet.")){
        message = `# History`
    }else{
        message = content;
    }

    members.forEach(async member => {
        if(member.user.id !== interaction.client.user.id){
       
            member.voice.setMute(false)
        }
    })
    staffs.forEach(async member => {
        member.voice.setChannel(mainchannel)
})
    const toadd = `- Commanded by <@${interaction.user.id}> to pause the game. Moved all the staff members to <#${mainchannelID}> and unmuted everyone else in <#${mainchannelID}>.`

    const toedit = `${message}\n${toadd}`
    let components = [];
    components.push(
      new ButtonBuilder().setCustomId("startgame").setStyle(ButtonStyle.Success).setLabel("Start Game").setEmoji("1296022147201765420").setDisabled(false),
      new ButtonBuilder().setCustomId("pausegame").setEmoji("1296022171495305298").setStyle(ButtonStyle.Secondary).setLabel("Pause Game").setDisabled(true),
      new ButtonBuilder().setCustomId("clearhistory").setEmoji("1296022603479388160").setStyle(ButtonStyle.Danger).setLabel("Clear History"),
      new ButtonBuilder().setCustomId("alarm").setStyle(ButtonStyle.Danger).setLabel("Alarm (15 seconds)"),

   
    );
  
    let buttonsRow = interaction.message.components;
    const firstRow = new ActionRowBuilder().addComponents(components)
    const secondRow = buttonsRow[1]
    const thirdRow = buttonsRow[2]
    const embed = new EmbedBuilder().setColor(require("@root/config").EMBED_COLORS.BOT_EMBED)
    .addFields(
        { name: "‎ ", value: mainchannel.id},
        { name: "‎ ", value: staffchannel.id},
        { name: "Current State:", value: "Game is paused"}
    )
    interaction.message.edit({
        content: toedit,
        embeds: [embed],
        components: [firstRow, secondRow, thirdRow]
    })
    interaction.followUp({
        content: "Done"
    })
   }




    /**
   * @param {import("discord.js").ButtonInteraction} interaction
   */
    async function handleAnnouncement(interaction){
        await interaction.deferReply({ ephemeral: true })
        const mainchannelID = interaction.message.embeds[0].fields[0].value
        const mainchannel = interaction.guild.channels.cache.get(mainchannelID)

        interaction.followUp({
            content: "Done"
        })
       
        const resource = createAudioResource("audios/announcement.mp3")
        player.play(resource)
        const connection = joinVoiceChannel({
            channelId: mainchannelID,
            guildId: interaction.guild.id,
            adapterCreator: mainchannel.guild.voiceAdapterCreator
        })
        const subscriptions = connection.subscribe(player)
        if(subscriptions){
            setTimeout(() => {
                subscriptions.unsubscribe()
            }, 15_000)
        }
       }

        /**
   * @param {import("discord.js").ButtonInteraction} interaction
   */
    async function handleAnnouncement(interaction){
        await interaction.deferReply({ ephemeral: true })
        const mainchannelID = interaction.message.embeds[0].fields[0].value
        const mainchannel = interaction.guild.channels.cache.get(mainchannelID)

        interaction.followUp({
            content: "Done"
        })
       
        const resource = createAudioResource("audios/announcement.mp3")
        player.play(resource)
        const connection = joinVoiceChannel({
            channelId: mainchannelID,
            guildId: interaction.guild.id,
            adapterCreator: mainchannel.guild.voiceAdapterCreator
        })
        const subscriptions = connection.subscribe(player)
        if(subscriptions){
            setTimeout(() => {
                subscriptions.unsubscribe()
            }, 15_000)
        }
       }
           /**
   * @param {import("discord.js").ButtonInteraction} interaction
   */
    async function handleGameoverCrew(interaction){
        await interaction.deferReply({ ephemeral: true })
        const mainchannelID = interaction.message.embeds[0].fields[0].value
        const mainchannel = interaction.guild.channels.cache.get(mainchannelID)

        interaction.followUp({
            content: "Done"
        })
       
        const resource = createAudioResource("audios/gameover/gameover-crew.mp3")
        player.play(resource)
        const connection = joinVoiceChannel({
            channelId: mainchannelID,
            guildId: interaction.guild.id,
            adapterCreator: mainchannel.guild.voiceAdapterCreator
        })
        const subscriptions = connection.subscribe(player)
        if(subscriptions){
            setTimeout(() => {
                subscriptions.unsubscribe()
            }, 15_000)
        }
       }
            /**
   * @param {import("discord.js").ButtonInteraction} interaction
   */
    async function handleGameoverImp(interaction){
        await interaction.deferReply({ ephemeral: true })
        const mainchannelID = interaction.message.embeds[0].fields[0].value
        const mainchannel = interaction.guild.channels.cache.get(mainchannelID)

        interaction.followUp({
            content: "Done"
        })
       
        const resource = createAudioResource("audios/gameover/gameover-imp.mp3")
        player.play(resource)
        const connection = joinVoiceChannel({
            channelId: mainchannelID,
            guildId: interaction.guild.id,
            adapterCreator: mainchannel.guild.voiceAdapterCreator
        })
        const subscriptions = connection.subscribe(player)
        if(subscriptions){
            setTimeout(() => {
                subscriptions.unsubscribe()
            }, 15_000)
        }
       }
        /**
   * @param {import("discord.js").ButtonInteraction} interaction
   */
    async function handleDeadBody(interaction){
        await interaction.deferReply({ ephemeral: true })
        const mainchannelID = interaction.message.embeds[0].fields[0].value
        const mainchannel = interaction.guild.channels.cache.get(mainchannelID)

        interaction.followUp({
            content: "Done"
        })
       
        const resource = createAudioResource("audios/deadbody.mp3")
        player.play(resource)
        const connection = joinVoiceChannel({
            channelId: mainchannelID,
            guildId: interaction.guild.id,
            adapterCreator: mainchannel.guild.voiceAdapterCreator
        })
        const subscriptions = connection.subscribe(player)
        if(subscriptions){
            setTimeout(() => {
                subscriptions.unsubscribe()
            }, 20_000)
        }
       }

             /**
   * @param {import("discord.js").ButtonInteraction} interaction
   */
    async function handleLightsSabotage(interaction){
        await interaction.deferReply({ ephemeral: true })
        const mainchannelID = interaction.message.embeds[0].fields[0].value
        const mainchannel = interaction.guild.channels.cache.get(mainchannelID)

        interaction.followUp({
            content: "Done"
        })
       
        const resource = createAudioResource("audios/lights/sabotage.mp3")
        player.play(resource)
        const connection = joinVoiceChannel({
            channelId: mainchannelID,
            guildId: interaction.guild.id,
            adapterCreator: mainchannel.guild.voiceAdapterCreator
        })
        const subscriptions = connection.subscribe(player)
        if(subscriptions){
            setTimeout(() => {
                subscriptions.unsubscribe()
            }, 15_000)
        }
       }
                /**
   * @param {import("discord.js").ButtonInteraction} interaction
   */
    async function handleLightsRestore(interaction){
        await interaction.deferReply({ ephemeral: true })
        const mainchannelID = interaction.message.embeds[0].fields[0].value
        const mainchannel = interaction.guild.channels.cache.get(mainchannelID)

        interaction.followUp({
            content: "Done"
        })
       
        const resource = createAudioResource("audios/lights/restore.mp3")
        player.play(resource)
        const connection = joinVoiceChannel({
            channelId: mainchannelID,
            guildId: interaction.guild.id,
            adapterCreator: mainchannel.guild.voiceAdapterCreator
        })
        const subscriptions = connection.subscribe(player)
        if(subscriptions){
            setTimeout(() => {
                subscriptions.unsubscribe()
            }, 15_000)
        }
       }

                /**
   * @param {import("discord.js").ButtonInteraction} interaction
   */
    async function handleReactorSabotage(interaction){
        await interaction.deferReply({ ephemeral: true })
        const mainchannelID = interaction.message.embeds[0].fields[0].value
        const mainchannel = interaction.guild.channels.cache.get(mainchannelID)

        interaction.followUp({
            content: "Done"
        })
       
        const resource = createAudioResource("audios/reactor/sabotage.mp3")
        player.play(resource)
        const connection = joinVoiceChannel({
            channelId: mainchannelID,
            guildId: interaction.guild.id,
            adapterCreator: mainchannel.guild.voiceAdapterCreator
        })
        const subscriptions = connection.subscribe(player)
        if(subscriptions){
            setTimeout(() => {
                subscriptions.unsubscribe()
            }, 15_000)
        }
       }

       
                /**
   * @param {import("discord.js").ButtonInteraction} interaction
   */
    async function handleReactorRestore(interaction){
        await interaction.deferReply({ ephemeral: true })
        const mainchannelID = interaction.message.embeds[0].fields[0].value
        const mainchannel = interaction.guild.channels.cache.get(mainchannelID)

        interaction.followUp({
            content: "Done"
        })
       
        const resource = createAudioResource("audios/reactor/restore.mp3")
        player.play(resource)
        const connection = joinVoiceChannel({
            channelId: mainchannelID,
            guildId: interaction.guild.id,
            adapterCreator: mainchannel.guild.voiceAdapterCreator
        })
        const subscriptions = connection.subscribe(player)
        if(subscriptions){
            setTimeout(() => {
                subscriptions.unsubscribe()
            }, 15_000)
        }
       }

                   /**
   * @param {import("discord.js").ButtonInteraction} interaction
   */
    async function handleOxygenSabotage(interaction){
        await interaction.deferReply({ ephemeral: true })
        const mainchannelID = interaction.message.embeds[0].fields[0].value
        const mainchannel = interaction.guild.channels.cache.get(mainchannelID)

        interaction.followUp({
            content: "Done"
        })
       
        const resource = createAudioResource("audios/oxygen/sabotage.mp3")
        player.play(resource)
        const connection = joinVoiceChannel({
            channelId: mainchannelID,
            guildId: interaction.guild.id,
            adapterCreator: mainchannel.guild.voiceAdapterCreator
        })
        const subscriptions = connection.subscribe(player)
        if(subscriptions){
            setTimeout(() => {
                subscriptions.unsubscribe()
            }, 15_000)
        }
       }

                  /**
   * @param {import("discord.js").ButtonInteraction} interaction
   */
    async function handleOxygenRestore(interaction){
        await interaction.deferReply({ ephemeral: true })
        const mainchannelID = interaction.message.embeds[0].fields[0].value
        const mainchannel = interaction.guild.channels.cache.get(mainchannelID)

        interaction.followUp({
            content: "Done"
        })
       
        const resource = createAudioResource("audios/oxygen/restore.mp3")
        player.play(resource)
        const connection = joinVoiceChannel({
            channelId: mainchannelID,
            guildId: interaction.guild.id,
            adapterCreator: mainchannel.guild.voiceAdapterCreator
        })
        const subscriptions = connection.subscribe(player)
        if(subscriptions){
            setTimeout(() => {
                subscriptions.unsubscribe()
            }, 15_000)
        }
       }

                        /**
   * @param {import("discord.js").ButtonInteraction} interaction
   */
    async function handleClear(interaction){
        await interaction.deferReply({ ephemeral: true })


        await interaction.followUp({
            content: "Done"
        })
       
        await interaction.message.edit({
            content: `# History:\nCleared by <@${interaction.user.id}>`
        })
       }

       
               /**
   * @param {import("discord.js").ButtonInteraction} interaction
   */
               async function handleAlarm(interaction){
                await interaction.deferReply({ ephemeral: true })
                const mainchannelID = interaction.message.embeds[0].fields[0].value
                const mainchannel = interaction.guild.channels.cache.get(mainchannelID)
        
                interaction.followUp({
                    content: "Done"
                })
               
                const resource = createAudioResource("audios/alarm.mp3")
                player.play(resource)
                const connection = joinVoiceChannel({
                    channelId: mainchannelID,
                    guildId: interaction.guild.id,
                    adapterCreator: mainchannel.guild.voiceAdapterCreator
                })
                const subscriptions = connection.subscribe(player)
                if(subscriptions){
                    setTimeout(() => {
                        subscriptions.unsubscribe()
                    }, 15_000)
                }
               }
       
 



  module.exports = {
    handleStart,
    handlePause,
    handleGameoverCrew,
    handleAnnouncement,
    handleGameoverImp,
    handleDeadBody,
    handleLightsSabotage,
    handleLightsRestore,
    handleReactorSabotage,
    handleReactorRestore,
    handleOxygenRestore,
    handleOxygenSabotage,
    handleClear,
    handleAlarm
  };
  