const { ApplicationCommandOptionType, EmbedBuilder, ButtonStyle, ButtonBuilder, ButtonInteraction, ButtonComponent, ActionRowBuilder, ComponentType, Component } = require("discord.js");
const { getUser } = require("@schemas/User");
const user = require("../information/shared/user");
const { finishTask } = require("@handlers/taskHandler")
const EMBED_COLORS = require("@root/config").EMBED_COLORS


/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "task",
  description: "used to manage customer tasks",
  category: "ORDERS",
  command: {
    enabled: false,
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [

      {
        name: "claim",
        description: "claim an unclaimed task",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
            {
              name: "task-id",
              description: "the task-id to claim",
              type: ApplicationCommandOptionType.Number,
              required: true,
            }
          ]
      },
      {
        name: "finish",
        description: "end a task",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "task-id",
            description: "the task id to end",
            type: ApplicationCommandOptionType.Number,
            required: true
          }
        ]
      },
      {
        name: "change",
        description: "changes the claimer of a task",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "task-id",
            description: "the task id to end",
            type: ApplicationCommandOptionType.Number,
            required: true
          },
          {
            name: "member",
            description: "the user to make claimer",
            type: ApplicationCommandOptionType.User,
            required: true
          }
        ]
      }
    ],
  },
  
  async interactionRun(interaction, data) {
   const settings = data.settings
   function taskIDExists(interaction, taskId) {
    const taskIDKey = `TaskID-${taskId}`;
    return interaction.client.taskdatabase.has(taskIDKey);
  }

  const idid = require("@root/config").BLOXBURG_ORDERS.ROLE_ID;
      if((interaction.member.roles.cache.has(idid)) == false){
        return interaction.followUp("You don't have permission to use this bot. You must be a caterer to use this command.")
      }

    const sub = interaction.options.getSubcommand();

    if(sub == "claim"){
      const taskID = interaction.options.getNumber("task-id");
      const existingTaskID = taskIDExists(interaction, taskID)
      if(!existingTaskID) return interaction.followUp("That task ID isn't even real...")
        const task = interaction.client.taskdatabase.get(`TaskID-${taskID}`)
      if(task.Claimer) {
        let i = "!"
        if((task.Claimer).toString() == (interaction.user.id).toString) i = ", and you claimed it yourself! Why would you want to reclaim something you already claimed??"
        return interaction.followUp(`That task is already claimed${i}`)
      }
      const embed = new EmbedBuilder()
      .setColor(EMBED_COLORS.BOT_EMBED)
      .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
      .setDescription(`Successfully claimed task ${taskID} for ${interaction.user.username}`)
      .setTimestamp();

      const channel = interaction.guild.channels.cache.get(task.ChannelID)
      if(!channel) {
        interaction.client.taskdatabase.delete(`TaskID-${taskID}`)
        return interaction.followUp("The ticket channel which was made for the customer has been deleted.\nThis task has been fully deleted, please do not randomly delete ordering tickets.")
      }
      const categoryChannel = interaction.guild.channels.cache.get(require("@root/config").BLOXBURG_ORDERS.PROGRESS_CATEGORY)
     const clientUser = interaction.client.users.cache.get(task.ClientID)
      const permissionOverwrites = [
        {
          id: interaction.guild.roles.everyone,
          deny: ["ViewChannel"],
        },
        {
          id: interaction.guild.members.me.roles.highest.id,
          allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
        },
        {
          id: require("@root/config").BLOXBURG_ORDERS.ROLE_ID,
          deny: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
        },
        {
            id: interaction.user.id,
            allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
        },
        {
          id: clientUser.id,
          allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
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
      channel.edit({
        permissionOverwrites: permissionOverwrites,
        name: `🍽﹒${interaction.user.username}-${taskID}`
      })
      const orders = task.Orders;
      const client = task.ClientID;
      const info = {
        ChannelID: channel.id,
        ClientID: client,
        Claimer: interaction.user.id,
        Orders: orders
      }
      interaction.client.taskdatabase.delete(`TaskID-${taskID}`)
      interaction.client.taskdatabase.set(`TaskID-${taskID}`, info)
    interaction.followUp({ embeds: [embed] })

   
    
    }else if(sub == "finish"){
      const taskID = interaction.options.getNumber("task-id");
      const existingTaskID = taskIDExists(interaction, taskID)
      if(!existingTaskID) return interaction.followUp("That task ID isn't even real or it has already been finished...")
        const task = interaction.client.taskdatabase.get(`TaskID-${taskID}`)
      
      if(task.Claimer) {
        
        if(task.Claimer !== interaction.user.id) {
          
          const i = "That isn't your task! You aren't allowed to do anything on that task!"
          return interaction.followUp(i)
        }
        
      }else if(!task.Claimer){
        return interaction.followUp("That task hasn't even been claimed!")
      }

      const categoryChannel = interaction.guild.channels.cache.get(require("@root/config").BLOXBURG_ORDERS.DONE_CATEGORY)
      const channel = interaction.guild.channels.cache.get(task.ChannelID)
      if(!channel) {
        interaction.client.taskdatabase.delete(`TaskID-${taskID}`)
        return interaction.followUp("The ticket channel which was made for the customer has been deleted.\nThis task has been fully deleted, please do not randomly delete ordering tickets.")
      }

      let catererInfo = interaction.client.catererdatabase.get('CatererInfo') || [];
      let catererEntry = catererInfo.find(entry => entry.userID === task.Claimer);
      if (catererEntry) {
          catererEntry.completedOrders += 1;
      } else {
          catererEntry = {
              userID: task.Claimer,
              completedOrders: 1
          };
          catererInfo.push(catererEntry);
      }
      interaction.client.catererdatabase.set('CatererInfo', catererInfo);
      const user = interaction.client.users.cache.get(task.ClientID);
     
      const permissionOverwrites = [
        {
          id: interaction.guild.roles.everyone,
          deny: ["ViewChannel"],
        },
        {
          id: interaction.guild.members.me.roles.highest.id,
          allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
        },
        {
          id: require("@root/config").BLOXBURG_ORDERS.ROLE_ID,
          deny: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
        },
        {
            id: interaction.user.id,
            allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
        },
        {
          id: user.id,
          allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
        },
        {
          id: require("@root/config").BLOXBURG_ORDERS.CATETER_MANAGER,
          allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
        }
      ];
      channel.edit({
        name: `🍽﹒done-${taskID}`,
        topic: `This task has been finished by ${interaction.user.username} for ${user.username}`,
        permissionOverwrites: permissionOverwrites
      })

      const orders = task.Orders;
    
      let claimer;
      if(task.Claimer){
        const userClaimer = interaction.client.users.cache.get(task.Claimer);
        claimer = userClaimer.username
      }else claimer == "Unclaimed"
      let currentEmbed = new EmbedBuilder()
        .setColor(EMBED_COLORS.BOT_EMBED)
        .setTitle(`**__List of All Orders of Task ${taskID}__**`)
        .setDescription(`Channel: ${channel ? channel.url : "Channel not found"}\nClaimed by: ${claimer}`)
        .setTimestamp()
        .setThumbnail(interaction.guild.iconURL())
        .setAuthor({
          name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()
        });


        let totalTotal = 0;
      for (const order of orders) {
        const user = interaction.client.users.cache.get(order.addedBy);
        const total = Number(order.price) * Number(order.quantity);
        totalTotal = totalTotal + total
        currentEmbed.addFields({
          name: `<:online:1268584859337752617> Order ${order.id}`,
          value: `<:CutePizza:1268571501280362588> Item Name: ${order.name}\n<a:Money:1268571524936237078> Total: ${Number(order.price) * Number(order.quantity)}\n<:pumpkinn:1268571541470314560> Seasonal: ${order.seasonal ? "<:correct:1268572260340469764> Yes" : "<:wrong:1268585214054109284> No"}\n👨 Added by: ${user ? user.username : 'Unknown'}`,
          inline: require("@root/config").BLOXBURG_ORDERS.INLINE
        });
      }
      currentEmbed.setFooter({
        text: `Total: ${totalTotal} BBC`,
        iconURL: user.displayAvatarURL()
      });
      const embed = new EmbedBuilder()
      .setColor(EMBED_COLORS.BOT_EMBED)
      .setTitle("**__This task has successfully ended!__**")
      .setDescription("The remaining data of this task has been fully deleted from the database and the task is done! A list of all orders are sent and now you can delete this channel.")
      .setFooter({
        iconURL: user.displayAvatarURL(),
        text: `Leave a review with the /review command!`
      })
      .addFields(
        {name: "Claimed by:", value: `<@${interaction.user.id}>`},
        {name: "Client:", value: `<@${user.id}>`}
      );

      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("DELETE_CHANNEL").setLabel("Delete Channel").setStyle(ButtonStyle.Danger).setEmoji("1268805744950513715"),
      );
    
      channel.send({
        embeds: [embed],


      })
      
      channel.safeSend({
        embeds: [currentEmbed],
        components: [buttons]
      });

      interaction.followUp({
        content: "Successfully ended task!"
      })
        
      const caterer = interaction.client.catererdatabase.get('CatererInfo') || [];
      const taskClaimerID = task.Claimer;

      const caterInfo = caterer.find(entry => entry.userID === taskClaimerID);
      const completedOrders = caterInfo ? caterInfo.completedOrders : 0;

      const orderText = completedOrders === 1 ? "order completed" : "orders completed";

      let orderEmbed = new EmbedBuilder()
      .setColor(EMBED_COLORS.BOT_EMBED)
      .setTitle(`**__List of All Orders of Task ${taskID}__**`)
      .setDescription(`This task has been ended, this is just the data that I got rid of in the database.`)
      .setTimestamp()
      .setThumbnail(interaction.guild.iconURL())
      .setAuthor({
        name: `${interaction.user.username} (${completedOrders} ${orderText})`, iconURL: interaction.user.displayAvatarURL()
      });


    
    for (const order of orders) {
      const user = interaction.client.users.cache.get(order.addedBy);
      const total = Number(order.price) * Number(order.quantity);
      
      orderEmbed.addFields({
        name: `<:online:1268584859337752617> Order ${order.id}`,
        value: `<:CutePizza:1268571501280362588> Item Name: ${order.name}\n<a:Money:1268571524936237078> Total: ${Number(order.price) * Number(order.quantity)}\n<:pumpkinn:1268571541470314560> Seasonal: ${order.seasonal ? "<:correct:1268572260340469764> Yes" : "<:wrong:1268585214054109284> No"}\n👨 Added by: ${user ? user.username : 'Unknown'}`,
        inline: require("@root/config").BLOXBURG_ORDERS.INLINE
      });
    }
    orderEmbed.setFooter({
      text: `Total: ${totalTotal} BBC`,
      iconURL: user.displayAvatarURL()
    });


    finishTask(interaction.channel, interaction.user.username, user.id, orderEmbed)
      interaction.client.taskdatabase.delete(`TaskID-${taskID}`)
    
      
     

    }else if(sub == "change"){
      const taskID = interaction.options.getNumber("task-id");
      const user = interaction.options.getMember("member");
      const member = interaction.guild.members.cache.get(user.id)
      if(!member) return interaction.followUp("I couldn't find that member!")
        const idd = require("@root/config").BLOXBURG_ORDERS.ROLE_ID
      if((member.roles.cache.has(idd) == false)){
        return interaction.followUp("That member doesn't have the required role to be able to claim shifts!")
      }
      const existingTaskID = taskIDExists(interaction, taskID)
      if(!existingTaskID) return interaction.followUp("That task ID isn't even real or it has already been finished...")
        const task = interaction.client.taskdatabase.get(`TaskID-${taskID}`)
      
      if(!task.Claimer) {
        return interaction.followUp("That task hasn't even been claimed yet")
      }

      if(task.Claimer == interaction.user.id || interaction.member.permissions.has("Administrator") || interaction.member.roles.cache.some(role => role.id === '1270467594117447781') || interaction.member.roles.cache.some(role => role.id === '1332092881464201237')){
        let info = {
          ClientID: task.ClientID,
          Orders: task.Orders,
          ChannelID: task.ChannelID,
          Claimer: user.id
        }
        if(task.Discount){
          info = {
            ClientID: task.ClientID,
            Orders: task.Orders,
            ChannelID: task.ChannelID,
            Claimer: user.id,
            Discount: task.Discount
          }
        }
       const channel = interaction.guild.channels.cache.get(task.ChannelID)
       channel.edit({
        permissionOverwrites: [
          {
            id: task.Claimer,
            deny: ["ViewChannel", "ReadMessageHistory", "SendMessages"]
          },
          {
            id: user.id,
            allow: ["ViewChannel", "ReadMessageHistory", "SendMessages", "EmbedLinks", "AttachFiles"]
          },
          {
            id: task.ClientID,
            allow: ["ViewChannel", "ReadMessageHistory", "SendMessages", "EmbedLinks", "AttachFiles"]
          },
          {
            id: interaction.guild.roles.everyone,
            deny: ["ViewChannel"],
          },
         {
            id: "1270467594117447781",
            allow: ["ViewChannel", "ReadMessageHistory", "SendMessages", "EmbedLinks", "AttachFiles"]
         },
         {
            id: "1332092881464201237",
            allow: ["ViewChannel", "ReadMessageHistory", "SendMessages", "EmbedLinks", "AttachFiles"]
         }
        ]
       })
        interaction.client.taskdatabase.delete(`TaskID-${taskID}`)
        interaction.client.taskdatabase.set(`TaskID-${taskID}`, info)
        channel.send({
          content: `The caterer of this task has been changed to <@${user.id}>`
        })
        const claimereee = interaction.client.users.cache.get(user.id)
        channel.edit({
            name: `🍽﹒${claimereee.username}-${taskID}`
        })
        return interaction.followUp("The new claimer is set!")
      }else{
        return interaction.followUp("You don't have permission to do this!")
      }

    }

  }}

  