

const { ApplicationCommandOptionType, EmbedBuilder, ButtonStyle, ButtonBuilder, ButtonInteraction, ButtonComponent, ActionRowBuilder, ComponentType } = require("discord.js");
const { getUser } = require("@schemas/User");
const EMBED_COLORS = require("@root/config").EMBED_COLORS


/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "cateringinfo",
  description: "used to train cateters",
  category: "ORDERS",
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
        description: "select a channel",
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
      .setTitle("<:BEEcater:1268596326812094616> __**B.E.E. Hive Catering Info**__")
      .setDescription(`Hello, this embed provides detailed instructions on how to use the bot, if you have any questions, feel free to ask any <@&${require("@root/config").BLOXBURG_ORDERS.CATETER_MANAGER}>.\nHere is a step-by-step guide on how to handle orders and ask questions.`)
      .addFields(
        {
            name: "Step 1️⃣", 
            value: `Greet the customer, clarify the order, propose the price.`
        },
        {
            name: "Step 2️⃣", 
            value: `If you agree to work together, use \`/task claim\`. It will highlight \`ID:\` , you will add a number after it. Example, \`ID:1\``
        },
        {
            name: "Step 3️⃣", 
            value: `Use \`/order add\` to create a tab (invoice) of your order. Example, \`/order add task-id:1 item:Turkey price:1000 quantity:10\``
        },
        {
            name: "Step 4️⃣",
            value: `Complete the order, make the exchange, and post your screenshot of the transactions `
        },
        {
            name: "Step 5️⃣",
            value: `Use \`/task finish\` to close the order.`
        },
        {
         name: "FAQ ❓",
         value: `\`What is my Task ID?\` - Your task ID is the number that is on your channel's name\n\`What is my order ID?\` - The Order ID can be found with the \`/order list\` command\n\`I forgot some commands, what were they?\` - You can run the \`/help\` command to get all the commands.`   
        },
        {
            name: `Command List 📃`,
            value: `*All the catering-related commands:*\n\`/task claim\` - To claim a task\n\`/task finish\` - Use this when you have finished a task\n\`/task change\` - Use this if you want to give your task to another caterer\n\`/order add\` - Add an order to a task\n\`/order remove\` - Remove an order incase you made a mistake\n\`/order list\` - Gives you a list of all the orders`
        },
        {
            name: `Difference between Tasks and Orders ❗`,
            value: `When handling a customer, you'll need two IDs: Task and Order.
🛒 Task is like the customer's shopping cart.
🍗 Orders are the customer's items placed into the cart.

For example:
> - Let's say I order 10 Turkeys and 5 Cookies.
> - You can either use the \`/order add\` command twice to enter the items separately, pricing Turkeys at 100, quantity 10, then Cookies at 26, quantity 5 and let <@1253026215434911865>  calculate the total (base) cost.
> - Or you can lump them as one item called "Assorted Items" or "Ingredients," and name your price, quantity 1.

The **Task ID** can be found at the end of the channel name
The **Order ID** can be found by using \`/order list\`.`
        },
        {
            name: "Notes 📖",
            value: `When using the \`/order add\` command, the price you write is the price of ONE quantity of the item. For example: I sell one turkey for 1000 BBC, and the customer wants 10 turkeys: In this case, I wouldn't make the price \`10000 BBC\`, I would just make it \`1000 BBC\` and I will change the quantity to 10`
        },
        {
          name: "Time Frame ⌚", value: "Please allow **2-7** days to complete an order.\n* You can **place a rush order** for something in under 48 hours, but it **may cost more (in labor fees).**\n* Customers must **pick up the food within 72 hrs** of food completion and must specify a timeframe they are available to avoid cancellations."
        },
        {name : "Orders 📘", value: `* You can order between **5-84 items (4 trays max)** and **up to 21 (1 tray max)** of one food. (Example: You can order up to 21 Muffins out of 84 total items).\n* Caterers may charge anywhere between **$0-$3000 in labor fees.**\n* Caterers may request a **partial deposit for orders priced $10k+** prior to placement. Please **take screenshots** of your payment.`},
        {name: "Cancelations ✖️", value: `* If a caterer cancels an order, **the deposit will be refunded** or the caterer will be given a strike.\n* If a customer cancels an order, the caterer may keep a **portion of the deposit** depending on the time frame.\n* If a party stops responding for 3 days without notice, the transaction will be **forfeited and all binds released.**\n* If a caterer does not complete the order in 7 days, other caterers are permitted to join the thread and assist. **Proof of deposit payment can be used as a coupon.**`},

      )
      .setFooter({ text: "If you have any questions or concerns, speak to Catering Manager Day (nirishorla07) by opening a support ticket" })
      .setImage("https://cdn.discordapp.com/attachments/1275343768601628744/1285636411612987422/image.png?ex=66eafdb6&is=66e9ac36&hm=ca588bc77322dcf7fe6219fc8c3d3043cd417f5307f97bbbc65fccba2869bc3d&");
  
	const embed2 = new EmbedBuilder()
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setImage("https://cdn.discordapp.com/attachments/1275343768601628744/1286396007034261625/008CEDAB-FDAF-49D7-82C2-EB3EEE11444A.jpg?ex=66edc124&is=66ec6fa4&hm=ce5941875db4dedfab749440236fc304e1a3410860ed44df5ed46de12f76307e&")
    
    const embed3 = new EmbedBuilder()
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setImage("https://cdn.discordapp.com/attachments/1275343768601628744/1286396007323533373/921C3E92-E807-4C3F-BF72-316D08DD59B2.jpg?ex=66edc124&is=66ec6fa4&hm=01c9c4a6f86402bf027386ab5e9bc49ee6be3c5b8ebbf141ac14e6851b172694&")
    .setFooter({ text: "If you have any questions or concerns, speak to Catering Manager Day (nirishorla07) by opening a support ticket" })
    
    const tktBtnRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel("Get Support").setCustomId("TICKET_CREATE").setStyle(ButtonStyle.Primary)
    );
  
    const message = await channel.send({ embeds: [embed, embed2, embed3], components: [tktBtnRow] });
    interaction.followUp({
      content: `I successfully sent it! Check ${message.url}`
    })
    }

  }}

  