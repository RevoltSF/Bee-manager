const { ApplicationCommandOptionType, EmbedBuilder, ButtonStyle, ButtonBuilder, ButtonInteraction, ButtonComponent, ActionRowBuilder, ComponentType } = require("discord.js");
const { getUser } = require("@schemas/User");


/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "donator",
  description: "Used to manage donators",
  category: "UTILITY",
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
              name: "donator-channel",
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
      const channel = interaction.options.getChannel("donator-channel");
  
      const donationMessage = `# <:BEEcoin:1268603590528729201> **Donations** <:BEEcoin:1268603590528729201>
Wanna help the B.E.E. Hive *buzz* even louder? You can drop a donation in the Server Shop! We've got a bunch of fun ways to show us your appreciation to the Hive. But hey, if you're strapped for cash ||brokie||, you can still throw some Bloxburg Cash our way. <:BEEheart3:1268808162513780816>

We live and breathe <:BBC:1269039975001755852> around here—giveaways, events, level rewards, boost perks, you name it! And while we hustle hard in Bloxburg to rack up cash 🤑, there's still a ton our awesome staff has to cover. Wanna help lighten the load? Pop open a ticket with the button below, and let's chat about when and how you can donate!

You can also donate through our Roblox group! Join the group [here](<https://www.roblox.com/groups/8095829/B-E-E-Hive-Bloxburg-Excellent-Employees>) and donate Robux directly. Every bit helps us keep buzzing!
        
### Donations aren't required, but if you do toss in some love, you can snag these sweet perks:
* **A shiny new role with badges:**
> Available roles:
> * <@&1292527874334654484>
> * <@&1292528315139227702>
> * <@&1292528719696494662>
> * <@&1292530176328077372>
> * <@&1292530239515132077>
> * <@&1292530995660197998>
> * <@&1292531187218382858>
> * <@&1292531212128092292>
> * <@&1292531280931590257>
-# Roles are not stackable.
        
* A special shoutout in <linktothread>.
* Access to a Donator, Support & Booster-only channel.
* Donator-only giveaways.`

    const tktBtnRow =  new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("TICKET_CREATE").setLabel("Open a support ticket").setStyle(ButtonStyle.Success)
    )
  
    const message = await channel.send({ content: donationMessage, components: [tktBtnRow] });
    interaction.followUp({
      content: `I successfully sent it! Check ${message.url}`,
      ephemeral: true
    })

    const thread = await message.startThread({
      name: "Donation Thread",
      autoArchiveDuration: 1440, // 24 hours in minutes
      reason: "For donation discussions",
    });

    const updatedMessage = donationMessage.replace("<linktothread>", `<#${thread.id}>`);

    await message.edit({ content: updatedMessage, components: [tktBtnRow] });
    interaction.followUp({
      content: `I successfully sent it! Check ${message.url} and the thread here: ${thread.url}`,
      ephemeral: true,
    });
    }
  }}

  