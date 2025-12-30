const { ApplicationCommandOptionType, EmbedBuilder, ButtonStyle, ButtonBuilder, ButtonInteraction, ButtonComponent, ActionRowBuilder, ComponentType } = require("discord.js");
const { getUser } = require("@schemas/User");
const EMBED_COLORS = require("@root/config").EMBED_COLORS;

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "order",
  description: "used to manage orders",
  category: "ORDERS",
  command: {
    enabled: false,
  },
  slashCommand: {
    enabled: true,
    ephemeral: false,
    options: [
      {
        name: "add",
        description: "add an order to a task",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "task-id",
            description: "the task id to add to",
            type: ApplicationCommandOptionType.Number,
            required: true,
          },
          {
            name: "item",
            description: "the item to add",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
          {
            name: "price",
            description: "the price of the item, for one quantity",
            type: ApplicationCommandOptionType.Number,
            required: true,
          },
          {
            name: "quantity",
            description: "the amount of the item",
            type: ApplicationCommandOptionType.Number,
            required: true,
          },
          {
            name: "seasonal",
            description: "is the item seasonal? (default = false)",
            type: ApplicationCommandOptionType.Boolean,
            required: false,
          },
        ],
      },
      {
        name: "list",
        description: "list orders of a task",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "task-id",
            description: "the task id to list orders for",
            type: ApplicationCommandOptionType.Number,
            required: true,
          }
        ]
      },
      {
        name: "remove",
        description: "removes an order from a task",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "task-id",
            description: "the task id to remove orders from",
            type: ApplicationCommandOptionType.Number,
            required: true
          },
          {
            name: "order-id",
            description: "the order id to remove",
            type: ApplicationCommandOptionType.Number,
            required: true
          },
        ]
      }
    ],
  },

  async interactionRun(interaction, data) {
    function taskIDExists(interaction, taskId) {
      const taskIDKey = `TaskID-${taskId}`;
      return interaction.client.taskdatabase.has(taskIDKey);
    }



    function orderIDExists(interaction, taskId, orderId1) {
      const orderId = orderId1.toString()
      const taskIDKey = `TaskID-${taskId}`;
      const taskINFO = interaction.client.taskdatabase.get(taskIDKey);
      if (!taskINFO) return false;

      return taskINFO.Orders.some(order => order.id === orderId);
    }

    const idid = require("@root/config").BLOXBURG_ORDERS.ROLE_ID;
    if((interaction.member.roles.cache.has(idid)) == false){
      return interaction.followUp("You don't have permission to use this bot.")
    }

    const sub = interaction.options.getSubcommand();

    if (sub == "add") {
      const taskID = interaction.options.getNumber("task-id");
      const item = interaction.options.getString("item");
      const price = interaction.options.getNumber("price");
      const quantity = interaction.options.getNumber("quantity");
      if (quantity == 0) return interaction.followUp("What do you mean the quantity is 0? I bet you skipped math class.");
      const seasonal = interaction.options.getBoolean("seasonal") || false;

      const taskIDExisting = taskIDExists(interaction, taskID);

      if (!taskIDExisting) {
        return interaction.followUp({ content: "I couldn't find that Task ID!" });
      }

      const taskINFO = interaction.client.taskdatabase.get(`TaskID-${taskID}`);
      if(!taskINFO.Claimer){
        return interaction.followUp("You can only add orders to a task that is claimed! Please claim the task using the \`/task claim\` command")
      }
      if(taskINFO.Claimer){
        if(taskINFO.Claimer !== interaction.user.id) return interaction.followUp("You cannot add items to a task you don't own!")

          const idd = require("@root/config").BLOXBURG_ORDERS.ROLE_ID
          if((interaction.member.roles.cache.has(idd) == false)){
            return interaction.followUp("You don't have permission to run this command!")
          }
      }
      
      function getNextOrderID(orders) {
        const existingIDs = orders.map(order => parseInt(order.id, 10));
        existingIDs.sort((a, b) => a - b);
      
        for (let i = 1; i <= existingIDs.length; i++) {
          if (!existingIDs.includes(i)) {
            return i;
          }
        }
      
        return existingIDs.length + 1;
      }
      const newOrderID = getNextOrderID(taskINFO.Orders);

      const orderIDExisting = orderIDExists(interaction, taskID, newOrderID);
      
      if(taskINFO.Orders.length == 25){
        return interaction.followUp("You cannot add more than 25 orders to a task")
      }

      const embed = new EmbedBuilder()
        .setColor(EMBED_COLORS.BOT_EMBED)
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL()
        })
        .setTitle(`**__New order has been set for ${taskID}__**`)
        .addFields(
          { name: "<:CutePizza:1268571501280362588> Item Name", value: item, inline: true },
          { name: `<a:Money:1268571524936237078> Total`, value: `${quantity}x${price} = \`${price * quantity}\``, inline: true },
          { name: "<:pumpkinn:1268571541470314560> Seasonal", value: `${seasonal ? "<:correct:1268572260340469764> Yes" : "<:wrong:1268585214054109284> No"}`, inline: true },
          { name: "👨 Added by", value: `${interaction.user.username}`, inline: true },
        );

      interaction.followUp({
        embeds: [embed]
      });

      const ordersArray = taskINFO.Orders;
      ordersArray.push({
        id: newOrderID.toString(),
        name: item,
        price: price.toString(),
        quantity: quantity.toString(),
        seasonal: seasonal,
        addedBy: interaction.user.id
      });
      let info = {
        ClientID: taskINFO.ClientID,
        Orders: ordersArray,
        ChannelID: taskINFO.ChannelID
      };
      if(taskINFO.Claimer){
        info = {
          ClientID: taskINFO.ClientID,
          Orders: ordersArray,
          ChannelID: taskINFO.ChannelID,
          Claimer: taskINFO.Claimer
        };
      }

      interaction.client.taskdatabase.delete(`TaskID-${taskID}`);
      interaction.client.taskdatabase.set(`TaskID-${taskID}`, info);

    } else if (sub == "list") {
      const taskID = interaction.options.getNumber("task-id");
      const taskIDExisting = taskIDExists(interaction, taskID);

      if (!taskIDExisting) {
        return interaction.followUp({ content: "I couldn't find that Task ID!" });
      }

      const task = interaction.client.taskdatabase.get(`TaskID-${taskID}`);
      const orders = task.Orders;
      const channel = interaction.guild.channels.cache.get(task.ChannelID);
      const clientUser = interaction.client.users.cache.get(task.ClientID)
      let claimer;
      if(task.Claimer){
        const userClaimer = interaction.client.users.cache.get(task.Claimer) || "Unclaimed"
        claimer = userClaimer.username
      }else claimer = "Unclaimed"
      let currentEmbed = new EmbedBuilder()
        .setColor(EMBED_COLORS.BOT_EMBED)
        .setTitle(`**__List of All Orders of Task ${taskID}__**`)
       
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
      currentEmbed.setDescription(`Channel: ${channel ? channel.url : "Channel not found"}\nClaimed by: ${claimer}\nTotal: ${totalTotal} BBC`)
      currentEmbed.setFooter({
        text: `Total: ${totalTotal} BBC`,
        iconURL: clientUser.displayAvatarURL()
      })
 
      interaction.followUp({
        embeds: [currentEmbed]
      });
    }else if(sub == "remove"){
      const taskID = interaction.options.getNumber("task-id");
      const taskIDExisting = taskIDExists(interaction, taskID);

      if (!taskIDExisting) {
        return interaction.followUp({ content: "I couldn't find that Task ID!" });
      }

      const orderID = interaction.options.getNumber("order-id")
      const orderIDExisting = orderIDExists(interaction, taskID, orderID)
     
      if(!orderIDExisting){
        return interaction.followUp("I couldn't find that Order ID!")
      }
      const task = interaction.client.taskdatabase.get(`TaskID-${taskID}`);
      if(task.Claimer && task.Claimer !== interaction.user.id) return interaction.followUp("You can't touch someone else's task")
      const orders = task.Orders
      let selectedOrder;
      for(const order of orders){
        if(order.id == orderID || (order.id).toString() == orderID.toString()){
          selectedOrder = order
        }
      }
      const user = interaction.client.users.cache.get(selectedOrder.addedBy);
      const embed = new EmbedBuilder()
      .setColor(EMBED_COLORS.ERROR)
      .setTitle(`__**Are you sure you want to remove Order ${orderID} from Task ${taskID}?**__`)
      .addFields(
        { name: "<:CutePizza:1268571501280362588> Item Name", value: selectedOrder.name, inline: true },
        { name: `<a:Money:1268571524936237078> Total`, value: `${selectedOrder.quantity}x${selectedOrder.price} = \`${Number(selectedOrder.price) * Number(selectedOrder.quantity)}\``, inline: true },
        { name: "<:pumpkinn:1268571541470314560> Seasonal", value: `${selectedOrder.seasonal ? "<:correct:1268572260340469764> Yes" : "<:wrong:1268585214054109284> No"}`, inline: true },
        { name: "👨 Added by", value: `${user.username}`, inline: true },
      )
      .setTimestamp()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL()
      });
      const message = await interaction.followUp({
        embeds: [embed]
      })
      message.react("<:correct:1268572260340469764>")
      message.react("<:wrong:1268585214054109284>")
      const collectorFilter = (reaction, user) => {
       return (reaction.emoji.id === '1268572260340469764' || reaction.emoji.id === '1268585214054109284') && user.id === interaction.user.id;
   };
      const collector = message.createReactionCollector({
        filter: collectorFilter,
        time: 120_000,
        max: 1
      })
      function removeOrder(client, taskID, orderID) {
        const taskKey = `TaskID-${taskID}`;
        if (!client.taskdatabase.has(taskKey)) return;
      
        const taskINFO = client.taskdatabase.get(taskKey);
        taskINFO.Orders = taskINFO.Orders.filter(order => order.id !== orderID.toString());
      
        client.taskdatabase.set(taskKey, taskINFO);
      }
      collector.on("collect", async (reaction, user) => {
        if(reaction.emoji.id == "1268572260340469764"){
          collector.stop()
          const command = `\`\`\`/order add task-id: ${taskID} item: ${selectedOrder.name} price: ${selectedOrder.price} quantity: ${selectedOrder.quantity} seasonal: ${selectedOrder.seasonal}\`\`\``
          const finalEmbed = new EmbedBuilder().setColor(EMBED_COLORS.SUCCESS)
          .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
          .setTimestamp()
          .setTitle(`**__Successfully removed order ${orderID} from task ${taskID}__**`)
          .setDescription("If you want to add it back, use this command:\n" + command);

          removeOrder(interaction.client,taskID, orderID)
          return interaction.followUp({
            embeds: [finalEmbed]
          })
         
        }else if(reaction.emoji.id == "1268585214054109284"){
          collector.stop()
          return interaction.followUp("Cancelled order removal process.")
        }
      })
    }
  }
};
