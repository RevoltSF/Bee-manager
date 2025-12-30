const { ApplicationCommandOptionType, EmbedBuilder, ButtonStyle, ButtonBuilder, ButtonInteraction, ButtonComponent, ActionRowBuilder, ComponentType } = require("discord.js");
const { getUser } = require("@schemas/User");
const EMBED_COLORS = require("@root/config").EMBED_COLORS


/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "tasksetup",
  description: "used to manage tasks",
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
        description: "select a channel to send the task open message in",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
            {
              name: "task-channel",
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
      const channel = interaction.options.getChannel("task-channel");
  
      
	   const embed = new EmbedBuilder()
      .setColor(EMBED_COLORS.BOT_EMBED)
      .setTitle("<:BEEcater:1268596326812094616> __**B.E.E. Hive Catering Info**__")
      .addFields(
        {
          name: "**Time Frame:**", value: "* Please allow **2-7** days to complete an order.\n* You can **place a rush order** for something in under 48 hours, but it **may cost more (in labor fees).**\n* Customers must **pick up the food order within 72 hrs** of food completion and must specify a timeframe they are available to avoid cancellations."
        },
        {name : "**Orders:**", value: `* You can order between **5-84 items (4 trays max)** and **up to 21 (1 tray max)** of one food. (Example: You can order up to 21 Muffins out of 84 total items).\n* Caterers may charge anywhere between **$0-$3000 in labor fees.**\n* B.E.E. Hive offers special menus and discounts occasionally **(or once a month).** It will be listed below.`},
        {name: "**Cancelations:**", value: `* If a caterer cancels an order, you will be given a **new caterer.**\n* If a customer cancels an order, the caterer may keep the food for a new order. **Please note: customers who order and cancel multiple times** may be refused service. This can be seen as order trolling.\n* If either party stops responding for 3 days without notice, you will be **given an order reminder.**\n* If a caterer does not complete the order in 7 days, other caterers are permitted to join the thread and assist. **Ping Day | Head Chef for assistance in the order ticket**.`},

      )
      .setFooter({ text: "If you have any questions or concerns, speak to Catering Manager Day (nirishorla07)" })
      .setImage("https://cdn.discordapp.com/attachments/1275343768601628744/1285636411612987422/image.png?ex=66eafdb6&is=66e9ac36&hm=ca588bc77322dcf7fe6219fc8c3d3043cd417f5307f97bbbc65fccba2869bc3d&");
    
    const tktBtnRow =  new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("TASK_CREATE").setLabel("Order Now!").setStyle(ButtonStyle.Primary)
    )
  
    const message = await channel.send({ embeds: [embed], components: [tktBtnRow] });
    interaction.followUp({
      content: `I successfully sent it! Check ${message.url}`
    })
    }

  }}

  