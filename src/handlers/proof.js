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

  // schemas
  const { getSettings } = require("@schemas/Guild");
  

const { EMBED_COLORS, WORKSTATS } = require("@root/config");
const senddelete = new ActionRowBuilder().addComponents(
  new ButtonBuilder().setStyle(ButtonStyle.Success).setLabel("Send").setEmoji("1275446680199630879").setCustomId("send"),
  new ButtonBuilder().setStyle(ButtonStyle.Danger).setLabel("Delete").setCustomId("delete").setEmoji("1276176000908136514"),
);
  

 
 

  
  /**
   * @param {import("discord.js").ButtonInteraction} interaction
   */
    async function handleShift(interaction){

        let buttonsRowCheck = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setStyle(ButtonStyle.Success).setLabel("Proceed").setEmoji("1268572260340469764").setCustomId("yes"),
            new ButtonBuilder().setStyle(ButtonStyle.Danger).setLabel("Cancel").setCustomId("no").setEmoji("1268585214054109284"),
          );
          await interaction.deferUpdate()
          const sentMessage = await interaction.followUp({ components: [buttonsRowCheck], content: "Are you sure that this shift is a Shift Manager's Shift? This action is irreversible.", ephemeral: true, fetchReply: true})
          const filter = i =>  i.user.id === interaction.user.id;
        const collector = sentMessage.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 60_000 });
  
        collector.on('collect', async i => {

          if (i.customId === 'yes') {
            let buttonsRowShift = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setStyle(ButtonStyle.Primary).setLabel("Shift Manager's Shift").setEmoji("1275544243410174085").setCustomId("shiftmanager").setDisabled(true),
                new ButtonBuilder().setStyle(ButtonStyle.Success).setLabel("Group Photo").setCustomId("group"),
                new ButtonBuilder().setStyle(ButtonStyle.Secondary).setLabel("Double XP").setCustomId("double"),
                new ButtonBuilder().setStyle(ButtonStyle.Primary).setLabel("Users").setCustomId("users").setEmoji("1275748042888183809"),
              );
              const embed = new EmbedBuilder().setColor(EMBED_COLORS.BOT_EMBED)
              .setTitle("Information")
              .addFields(
                { name: "Type", value: `Shift Manager's Shift`},
                { name: "Users", value: `${interaction.message.embeds[0].fields[1].value}`},
                { name: "Group Photo", value: `${interaction.message.embeds[0].fields[2].value}`},
                { name: "Double XP", value: `${interaction.message.embeds[0].fields[3].value}`},
              )
              .setTimestamp();

              await i.deferUpdate();
              await interaction.editReply({
                embeds: [embed],
                components: [buttonsRowShift, senddelete]
              })
              await i.editReply({ sentMessage, content: "Done!", components: []})
              collector.stop()
           
              
          } else if (i.customId === 'no') {
     
            await i.deferUpdate();
            await i.editReply({sentMessage, content: "Cancelled!", components: []})
            

            return;
          }

        });
  
        collector.on('end', async collected => {
          if (!collected.size) {
            await interaction.editReply({
              message: sentMessage.id,
              content: "Cancelled because you ignored me",
              components: []
            })
          }
        });
    

    }

     /**
   * @param {import("discord.js").ButtonInteraction} interaction
   */
     async function handleWorker(interaction){

      let buttonsRowCheck = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setStyle(ButtonStyle.Success).setLabel("Proceed").setEmoji("1268572260340469764").setCustomId("yes"),
          new ButtonBuilder().setStyle(ButtonStyle.Danger).setLabel("Cancel").setCustomId("no").setEmoji("1268585214054109284"),
        );
        await interaction.deferUpdate()
        const sentMessage = await interaction.followUp({ components: [buttonsRowCheck], content: "Are you sure that this shift is a Normal Worker's Shift? This action is irreversible.", ephemeral: true, fetchReply: true})
        const filter = i =>  i.user.id === interaction.user.id;
      const collector = sentMessage.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 60000 });

      collector.on('collect', async i => {

        if (i.customId === 'yes') {
          let buttonsRowWorker = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setStyle(ButtonStyle.Primary).setLabel("Fellow Worker's Shift").setEmoji("1275544750988066948").setCustomId("fellowworker").setDisabled(true),
            new ButtonBuilder().setStyle(ButtonStyle.Success).setLabel("Group Photo").setCustomId("group"),
            new ButtonBuilder().setStyle(ButtonStyle.Secondary).setLabel("Double XP").setCustomId("double"),
            new ButtonBuilder().setStyle(ButtonStyle.Primary).setLabel("Users").setCustomId("users").setEmoji("1275748042888183809"),
          );
            const embed = new EmbedBuilder().setColor(EMBED_COLORS.BOT_EMBED)
            .setTitle("Information")
            .addFields(
              { name: "Type", value: `Fellow Worker's Shift`},
              { name: "Users", value: `${interaction.message.embeds[0].fields[1].value}`},
              { name: "Group Photo", value: `${interaction.message.embeds[0].fields[2].value}`},
              { name: "Double XP", value: `${interaction.message.embeds[0].fields[3].value}`},
            )
            .setTimestamp();

            await i.deferUpdate();
        await interaction.editReply({
          embeds: [embed],
          components: [buttonsRowWorker, senddelete]
        })
        await i.editReply({ sentMessage, content: "Done!", components: []})
        collector.stop()
         
            
        } else if (i.customId === 'no') {
          await i.deferUpdate();
          await i.editReply({sentMessage, content: "Cancelled!", components: []})
          

          return;
        }

      });

      collector.on('end', async collected => {
        if (!collected.size) {
          await interaction.editReply({
            message: sentMessage.id,
            content: "Cancelled because you ignored me",
            components: []
          })
        }
      });
  

  }
  /**
   * 
   * @param {import("discord.js").ButtonInteraction} interaction
   */

  async function handleUsers(interaction){
    const type = interaction.message.embeds[0].fields[0].value
    const oldUsers = interaction.message.embeds[0].fields[1].value
    const userIDs = extractNumbers(oldUsers)
    const groupPhotos = interaction.message.embeds[0].fields[2].value
    const double = interaction.message.embeds[0].fields[3].value
    const menuRow = new ActionRowBuilder().addComponents(
      new UserSelectMenuBuilder()
        .setCustomId("users")
        .setPlaceholder("Select a user")
        .setMaxValues(25)
    );

    await interaction.deferUpdate()
    let oldUsersList = ""

    userIDs.forEach(user => {
      
      const username = interaction.guild.members.cache.get(user).user


      oldUsersList = `${oldUsersList} ${username.username}`
      
    })
    const sentMessage = await interaction.followUp({ components: [menuRow], content: `Select users who are in this photo.\nCurrent users: ${oldUsersList}`, ephemeral: true, fetchReply: true})

    const collector = sentMessage.createMessageComponentCollector({
      componentType: ComponentType.UserSelect,
      filter: (i) => i.customId === "users" && i.user.id === interaction.user.id,
      time: 240_000, 
    });
    
    collector.on("collect", async (i) => {
      if (!i.values.length) {
        return i.reply({
          content: "You have not picked any options!",
          ephemeral: true,
        });
      }

      i.values.forEach(userID => {
      if(userIDs.includes(userID)){

      }else{
        userIDs.push(userID);
      }
      })
      

      let pings = ""
        userIDs.forEach((user, i) => {
          const user1 = interaction.guild.members.cache.get(user).user
         if(!user1.bot){ if(i+1 == userIDs.length){
            pings = `${pings} ${user1.username} (<@${user1.id}>).`
           }
            else pings = `${pings} ${user1.username} (<@${user1.id}>), `}
        })
        const embed = new EmbedBuilder().setColor(EMBED_COLORS.BOT_EMBED)
        .setTitle("Information")
        .addFields(
          { name: "Type", value: type},
          { name: "Users", value: `${pings}`},
          { name: "Group Photo", value: groupPhotos},
          { name: "Double XP", value: double},
        )
        .setTimestamp();
        await i.deferUpdate();
        await interaction.editReply({
          embeds: [embed],
        })
        await i.editReply({ sentMessage, content: "Done!", components: []})
      collector.stop()
     
    });
  
    collector.on("end", async (collected) => {
      
      if(collected.size == 0 || !collected.size){
        await interaction.editReply({
          message: sentMessage.id,
          content: "Cancelled because you ignored me",
          components: []
        })
      }else{
        
        
      }

    
    });

  }


     /**
   * @param {import("discord.js").ButtonInteraction} interaction
   */
     async function handleGroup(interaction){

      let buttonsRowCheck = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setStyle(ButtonStyle.Success).setLabel("Proceed").setEmoji("1268572260340469764").setCustomId("yes"),
          new ButtonBuilder().setStyle(ButtonStyle.Danger).setLabel("Cancel").setCustomId("no").setEmoji("1268585214054109284"),
        );
        const type = interaction.message.embeds[0].fields[0].value
        const groupPhotos = interaction.message.embeds[0].fields[2].value
        const double = interaction.message.embeds[0].fields[3].value
        let config = false;
        if(double == "Yes") config = true
        let buttonsRowGroup = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setStyle(ButtonStyle.Primary).setLabel("Fellow Worker's Shift").setEmoji("1275544750988066948").setCustomId("fellowworker").setDisabled(true),
          new ButtonBuilder().setStyle(ButtonStyle.Success).setLabel("Group Photo").setCustomId("group").setDisabled(true),
          new ButtonBuilder().setStyle(ButtonStyle.Secondary).setLabel("Double XP").setCustomId("double").setDisabled(config),
          new ButtonBuilder().setStyle(ButtonStyle.Primary).setLabel("Users").setCustomId("users").setEmoji("1275748042888183809"),
        );
        if(type == "Shift Manager's Shift"){
          buttonsRowGroup = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setStyle(ButtonStyle.Primary).setLabel("Shift Manager's Shift").setEmoji("1275544243410174085").setCustomId("shiftmanager").setDisabled(true),
            new ButtonBuilder().setStyle(ButtonStyle.Success).setLabel("Group Photo").setCustomId("group").setDisabled(true),
            new ButtonBuilder().setStyle(ButtonStyle.Secondary).setLabel("Double XP").setCustomId("double").setDisabled(config),
            new ButtonBuilder().setStyle(ButtonStyle.Primary).setLabel("Users").setCustomId("users").setEmoji("1275748042888183809"),
          );
        }
          const embed = new EmbedBuilder().setColor(EMBED_COLORS.BOT_EMBED)
          .setTitle("Information")
          .addFields(
            { name: "Type", value: `${type}`},
            { name: "Users", value: `${interaction.message.embeds[0].fields[1].value}`},
            { name: "Group Photo", value: `Yes`},
            { name: "Double XP", value: `${interaction.message.embeds[0].fields[3].value}`},
          )
          .setTimestamp();
        await interaction.deferUpdate()
        const sentMessage = await interaction.followUp({ components: [buttonsRowCheck], content: "Are you sure that this photo was a group photo? This action is irreversible.", ephemeral: true, fetchReply: true})
        const filter = i =>  i.user.id === interaction.user.id;
      const collector = sentMessage.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 60000 });

      collector.on('collect', async i => {

        if (i.customId === 'yes') {
          

            await i.deferUpdate();
        await interaction.editReply({
          embeds: [embed],
          components: [buttonsRowGroup, senddelete]
        })
        await i.editReply({ sentMessage, content: "Done!", components: []})
        collector.stop()
         
            
        } else if (i.customId === 'no') {
          await i.deferUpdate();
          await i.editReply({sentMessage, content: "Cancelled!", components: []})
          

          return;
        }

      });

      collector.on('end', async collected => {
        if (!collected.size) {
          await interaction.editReply({
            message: sentMessage.id,
            content: "Cancelled because you ignored me",
            components: []
          })
        }
      });
  

  }

   /**
   * @param {import("discord.js").ButtonInteraction} interaction
   */
   async function handleDouble(interaction){

    let buttonsRowCheck = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setStyle(ButtonStyle.Success).setLabel("Proceed").setEmoji("1268572260340469764").setCustomId("yes"),
        new ButtonBuilder().setStyle(ButtonStyle.Danger).setLabel("Cancel").setCustomId("no").setEmoji("1268585214054109284"),
      );
      const type = interaction.message.embeds[0].fields[0].value
      const groupPhotos = interaction.message.embeds[0].fields[2].value
      const double = interaction.message.embeds[0].fields[3].value
      let config = false;
      if(groupPhotos == "Yes") config = true
      let buttonsRowGroup = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setStyle(ButtonStyle.Primary).setLabel("Fellow Worker's Shift").setEmoji("1275544750988066948").setCustomId("fellowworker").setDisabled(true),
        new ButtonBuilder().setStyle(ButtonStyle.Success).setLabel("Group Photo").setCustomId("group").setDisabled(config),
        new ButtonBuilder().setStyle(ButtonStyle.Secondary).setLabel("Double XP").setCustomId("double").setDisabled(true),
        new ButtonBuilder().setStyle(ButtonStyle.Primary).setLabel("Users").setCustomId("users").setEmoji("1275748042888183809"),
      );
      if(type == "Shift Manager's Shift"){
        buttonsRowGroup = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setStyle(ButtonStyle.Primary).setLabel("Shift Manager's Shift").setEmoji("1275544243410174085").setCustomId("shiftmanager").setDisabled(true),
          new ButtonBuilder().setStyle(ButtonStyle.Success).setLabel("Group Photo").setCustomId("group").setDisabled(config),
          new ButtonBuilder().setStyle(ButtonStyle.Secondary).setLabel("Double XP").setCustomId("double").setDisabled(true),
          new ButtonBuilder().setStyle(ButtonStyle.Primary).setLabel("Users").setCustomId("users").setEmoji("1275748042888183809"),
        );
      }
        const embed = new EmbedBuilder().setColor(EMBED_COLORS.BOT_EMBED)
        .setTitle("Information")
        .addFields(
          { name: "Type", value: `${type}`},
          { name: "Users", value: `${interaction.message.embeds[0].fields[1].value}`},
          { name: "Group Photo", value: `${interaction.message.embeds[0].fields[2].value}`},
          { name: "Double XP", value: `Yes`},
        )
        .setTimestamp();
      await interaction.deferUpdate()
      const sentMessage = await interaction.followUp({ components: [buttonsRowCheck], content: "Are you sure that all users in this photo should get 2x XP? This action is irreversible.", ephemeral: true, fetchReply: true})
      const filter = i =>  i.user.id === interaction.user.id;
    const collector = sentMessage.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 60000 });

    collector.on('collect', async i => {

      if (i.customId === 'yes') {
        

          await i.deferUpdate();
      await interaction.editReply({
        embeds: [embed],
        components: [buttonsRowGroup, senddelete]
      })
      await i.editReply({ sentMessage, content: "Done!", components: []})
      collector.stop()
       
          
      } else if (i.customId === 'no') {
        await i.deferUpdate();
        await i.editReply({sentMessage, content: "Cancelled!", components: []})
        

        return;
      }

    });

    collector.on('end', async collected => {
      if (!collected.size) {
        await interaction.editReply({
          message: sentMessage.id,
          content: "Cancelled because you ignored me",
          components: []
        })
      }
    });


}

   /**
   * @param {import("discord.js").ButtonInteraction} interaction
   */
   async function handleSend(interaction){

    let buttonsRowCheck = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setStyle(ButtonStyle.Success).setLabel("Proceed").setEmoji("1268572260340469764").setCustomId("yes"),
        new ButtonBuilder().setStyle(ButtonStyle.Danger).setLabel("Cancel").setCustomId("no").setEmoji("1268585214054109284"),
      );
      const type = interaction.message.embeds[0].fields[0].value
      const users = interaction.message.embeds[0].fields[1].value
      const groupPhotos = interaction.message.embeds[0].fields[2].value
      const double = interaction.message.embeds[0].fields[3].value

        const embed = new EmbedBuilder().setColor(EMBED_COLORS.BOT_EMBED)
        .setTitle("Information")
        .addFields(
          { name: "Type", value: `${type}`},
          { name: "Users", value: `${interaction.message.embeds[0].fields[1].value}`},
          { name: "Group Photo", value: `${interaction.message.embeds[0].fields[2].value}`},
          { name: "Double XP", value: `${interaction.message.embeds[0].fields[3].value}`},
        )
        .setTimestamp();
      await interaction.deferUpdate()
      const sentMessage = await interaction.followUp({ components: [buttonsRowCheck], content: "Should I send out this image for processing? Are you sure that it is final?", fetchReply: true})
      const filter = i =>  i.user.id === interaction.user.id;
    const collector = sentMessage.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 60000 });

    collector.on('collect', async i => {

      if (i.customId === 'yes') {
        const userIDSArray = extractNumbers(users)
        let userUserNameArray = []
        userIDSArray.forEach((id) => {
          const user = interaction.guild.members.cache.get(id).user;
          userUserNameArray.push(user.username)
        })
          userUserNameArray.sort()
          const userUsernames = userUserNameArray.join(", ");
         
          

          await i.deferUpdate();
      await i.deleteReply()
      await interaction.deleteReply()
      await interaction.channel.send({ sentMessage, content: `Done! I just processed this task, info:\n**Type:**\n\`${type}\`\n**Users:**\n\`\`\`${userUsernames}\`\`\`\n**Group Photo?:**\n\`${groupPhotos}\`\n**Double XP?:**\n\`${double}\`\n\n-# Commanded by: <@${interaction.user.id}>`, components: []})
      collector.stop()

      const channelID = WORKSTATS.workStatsChannel;
     

      let totalForEachUser = 0;
      let groupPhoto = false;
      if(groupPhotos == "Yes") groupPhoto = true;
      let doubleXP = false;
      if(double == "Yes") doubleXP = true;
      let shiftType = 0; //Normal Worker Shift
      if(type == "Shift Manager's Shift") shiftType = 1; //Shift Manager's Shift

      if(shiftType == 0) totalForEachUser = totalForEachUser + 50;
      else if(shiftType == 1) totalForEachUser = totalForEachUser + 100;

      if(groupPhoto == true) totalForEachUser = totalForEachUser + 25;
      if(doubleXP == true) totalForEachUser = totalForEachUser * 2;

      function extractWeekRangeFromContent(content) {
        // Regular expression to match the title and week range
        const titleMatch = content.match(/# Week of (.*?) to (.*?)(?:\n|$)/);
        const title = titleMatch ? titleMatch[0] : null;
      
        if (!title) {
          return { startingWeek: null, endingWeek: null };
        }
      
        // Extract the full starting and ending week content
        const startingWeek = titleMatch[1].trim();
        const endingWeek = titleMatch[2].trim();
      
        return { startingWeek, endingWeek };
      }
      const channel = await interaction.guild.channels.cache.get(channelID);
      await channel.messages.fetch({ after: 0, limit: 1 })
        .then(message => {
          if (!message.first() || !message.first().content || !message) {
            channel.send("Our data!");
          } else {
            const leaderboardMessage = message.first();
            const leaderboardContent = leaderboardMessage.content;
            const weeks = extractWeekRangeFromContent(leaderboardContent);
            const start = weeks.startingWeek;
            const end = weeks.endingWeek
            // Check if the leaderboard is empty or contains the specific format indicating it's empty
            const isEmptyLeaderboard = leaderboardContent.includes('Empty for now');
      
            // If the leaderboard is empty, start a new one
            if (isEmptyLeaderboard || !leaderboardContent.includes('## Leaderboard:')) {
              let newLeaderboard = userIDSArray.map(userId => `> * <@${userId}> = ${totalForEachUser}`).join('\n').trim();
              
              leaderboardMessage.edit(`
      # Week of ${start} to ${end}\n-# xp to be given out **after** workaholic weekend
      ## Leaderboard:
      
      ${newLeaderboard}
              `.trim());
            } else {
              // Extract the current leaderboard content, if present
              const existingLeaderboard = leaderboardContent.includes('## Leaderboard:')
                ? leaderboardContent.split('## Leaderboard:')[1].trim().split('\n')
                : [];
      
              // Convert the existing leaderboard into an object for easy updates
              const existingXP = {};
              existingLeaderboard.forEach(entry => {
                const match = entry.match(/<@(\d+)>/);
                if (match) {
                  const userId = match[1];
                  const xp = parseInt(entry.split(' = ')[1]);
                  existingXP[userId] = xp;
                }
              });
      
              // Update XP for users in userIDSArray
              userIDSArray.forEach(userId => {
                if (existingXP[userId]) {
                  existingXP[userId] += totalForEachUser; // Add the new XP to the existing XP
                } else {
                  existingXP[userId] = totalForEachUser; // Set new XP if the user isn't already listed
                }
              });
      
              // Sort the leaderboard by XP in descending order
              const sortedLeaderboard = Object.entries(existingXP).sort((a, b) => b[1] - a[1]);
      
              // Create the new leaderboard string with an asterisk before each user
              let newLeaderboard = sortedLeaderboard.map(([userId, xp]) => `> * <@${userId}> = ${xp}`).join('\n').trim();
      
              // Update the message with the new leaderboard
              leaderboardMessage.edit(`
      # Week of ${start} to ${end}\n-# xp to be given out **after** workaholic weekend
      ## Leaderboard:
      
      ${newLeaderboard}
              `.trim());
            }
          }
        });
      
      
      
       
          
      } else if (i.customId === 'no') {
        await i.deferUpdate();
        await i.editReply({sentMessage, content: "Cancelled!", components: []})
        

        return;
      }

    });

    collector.on('end', async collected => {
      if (!collected.size) {
        await interaction.editReply({
          message: sentMessage.id,
          content: "Cancelled because you ignored me",
          components: []
        })
      }
    });


}
  /**
   * @param {import("discord.js").ButtonInteraction} interaction
   */
  async function handleDelete(interaction){

    let buttonsRowCheck = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setStyle(ButtonStyle.Success).setLabel("Proceed").setEmoji("1268572260340469764").setCustomId("yes"),
        new ButtonBuilder().setStyle(ButtonStyle.Danger).setLabel("Cancel").setCustomId("no").setEmoji("1268585214054109284"),
      );
      const type = interaction.message.embeds[0].fields[0].value
      const users = interaction.message.embeds[0].fields[1].value
      const groupPhotos = interaction.message.embeds[0].fields[2].value
      const double = interaction.message.embeds[0].fields[3].value

      await interaction.deferUpdate()
      const sentMessage = await interaction.followUp({ components: [buttonsRowCheck], content: "Are you sure that I should delete this?", fetchReply: true})
      const filter = i =>  i.user.id === interaction.user.id;
    const collector = sentMessage.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 60000 });

    collector.on('collect', async i => {

      if (i.customId === 'yes') {
        const userIDSArray = extractNumbers(users)
        let userUserNameArray = []
        userIDSArray.forEach((id) => {
          const user = interaction.guild.members.cache.get(id).user;
          userUserNameArray.push(user.username)
        })
          userUserNameArray.sort()
          const userUsernames = userUserNameArray.join(", ");
         
          

          await i.deferUpdate();
      await interaction.deleteReply()
      await i.editReply({ sentMessage, content: `Done! I just deleted this task, info:\n**Type:**\n\`${type}\`\n**Users:**\n\`\`\`${userUsernames}\`\`\`\n**Group Photo?:**\n\`${groupPhotos}\`\n**Double XP?:**\n\`${double}\`\n\n-# Commanded by: <@${interaction.user.id}>`, components: []})
      collector.stop()
      
       
          
      } else if (i.customId === 'no') {
        await i.deferUpdate();
        await i.editReply({sentMessage, content: "Cancelled!", components: []})
        

        return;
      }

    });

    collector.on('end', async collected => {
      if (!collected.size) {
        await interaction.editReply({
          message: sentMessage.id,
          content: "Cancelled because you ignored me",
          components: []
        })
      }
    });


}

 /**
   * @param {import("discord.js").ButtonInteraction} interaction
   */

 async function number(interaction){
  let buttonsRowCheck = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setStyle(ButtonStyle.Success).setLabel("Proceed").setEmoji("1268572260340469764").setCustomId("yes"),
    new ButtonBuilder().setStyle(ButtonStyle.Danger).setLabel("Cancel").setCustomId("no").setEmoji("1268585214054109284"),
  );

  await interaction.deferUpdate()
  const sentMessage = await interaction.followUp({ components: [buttonsRowCheck], content: "Are you sure that you want to continue?", fetchReply: true})
  const filter = i =>  i.user.id === interaction.user.id;
const collector = sentMessage.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 60000 });

collector.on('collect', async i => {

  if (i.customId === 'yes') {      

  
    await i.reply("Hewo")

  collector.stop()
  
   
      
  } else if (i.customId === 'no') {

    await i.reply("Cancelled")
    

    return;
  }

});

collector.on('end', async collected => {
  if (!collected.size) {
    await interaction.editReply({
      message: sentMessage.id,
      content: "Cancelled because you ignored me",
      components: []
    })
  }
});
 }

 



  module.exports = {
   handleShift,
   handleWorker,
   handleUsers,
   handleGroup,
   handleDouble,
   handleSend,
   handleDelete,
   number
  };
  