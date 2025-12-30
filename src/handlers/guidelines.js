const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    StringSelectMenuBuilder,
    ComponentType,
    Embed,
  } = require("discord.js");

const embed = require("../commands/admin/embed");
const { description } = require("../structures/BaseContext");
const { title } = require("process");

const color = require("@root/config").EMBED_COLORS.BOT_EMBED
  
  /**
   * @param {import("discord.js").ButtonInteraction} interaction
   */

  async function handleBuildingGuide (interaction) {
    await interaction.deferReply({ephemeral: true });

    const embed = new EmbedBuilder().setColor(color)
    .setTitle(`__Builder Guidelines__`)
    .addFields(
        {
            name: `<:BEEbuilding:1270130529613774950> Remain active.`, value: `> * Engage anywhere in the server every week unless on LOA and complete at least 1 build job every month.
> * Not engaging in the server for 2 weeks straight may result in a demotion and a 2 week cooldown before you can re-apply unless on LOA.
> * Your monthly requirement resets on the day that you got hired.
            > * If you aren't getting any job offers, promote the server with "looking-for-player" threads (see <#1267959190337618022>), partnership recommendations, decal promotions inside Bloxburg (see <#1268612745373421678>), or bump us on Disboard with the \`/bump\` command.`
        },
        {
            name: `<:BEEbuilding:1270130529613774950> Maintain Professionalism.`, value: `> * Do not talk down to or emotionally at customers.
            > * Type clearly, not everyone reads English as a first langauge.
            > * Be open, honest and kind with your customer.`
        },
        {
            name: `<:BEEbuilding:1270130529613774950> Work with the customer's schedule.`, value: `> * If you and your customer have trouble meeting up to finish the job for more than two weekends, your flexibility may be evaluated and result in a demotion.
            > * If something comes up and you cannot finish in a timely manner, reach out to other builders or the Department Head.`
        },
        {
            name: `<:BEEbuilding:1270130529613774950> Honor the customer's deposit.`, value: `> * If you need to cancel a job and you requested a deposit, you must give it back or it's not only a permanent demotion, but also a server warning.
            <:blank:1278554259050205287>`
        },
        {
            name: `<:BEEmod:1268805750898294907> 3 Strikes <:BEEdown:1268808089369579570>`, value: `> * If you receive 3 strikes, you will be put on probation
> * A 4th strike will result in a demotion, removal of your post and a 2 week cooldown before you're allowed to re-apply for the position.`
        },
    )


    await interaction.editReply({
     embeds: [embed]});
  }

async function handleCaterGuide (interaction) {
    await interaction.deferReply({ephemeral: true });

    const embed = new EmbedBuilder().setColor(color)
    .setTitle(`__Caterer Guidelines__`)
    .addFields(
        {
            name: `<:BEEcater:1268805753704157256> Remain Active.`, value: `> * Engage anywhere in the server every week unless on LOA and complete at least 1 order every 2 weeks.\n<:blank:1278554259050205287>`
        },
        {
            name: `<:BEEcater:1268805753704157256> Maintain Professionalism in tickets.`, value: `> * Do not talk down to customers
            > * Type clearly, not everyone reads English as a first language
            > * Do not steal orders before a bid has been made by the first caterer to respond.\n<:blank:1278554259050205287>`
        },
        {
            name: `<:BEEcater:1268805753704157256> Honor the customer's deposit.`, value: `> * If you need to cancel an order and you requested a deposit, you must give it back or it's not only a permanent demotion, but also a server warning.\n<:blank:1278554259050205287>`
        },
        {
            name: `<:BEEcater:1268805753704157256> Deliver on time.`, value: `> * If you take longer than 7 days to complete your order, you will be given a strike and your order may be given to another caterer.\n<:blank:1278554259050205287>`
        },
        {
            name: `<:BEEcater:1268805753704157256> Claim 1 order at a time.`, value: `> * You should only have **one** order at a time. Having multiple orders prevent other caterers from claiming tickets and doing their job.\n<:blank:1278554259050205287>`
        },
        {
            name: `<:BEEmod:1268805750898294907> 3 Strikes`, value:`<:BEEdown:1268808089369579570> Leads to a demotion and a cooldown before you can apply again.
            <:blank:1278554259050205287>`
        },
        {
            name: `__How to Fulfill Orders__`, value: `See <#1270468553098657923>`
        }
)

    await interaction.editReply({
     embeds: [embed]});
}

async function handleEntreGuide (interaction) {
    await interaction.deferReply({ephemeral: true });

    const embed = {
        color: 16427271,
        title: `__Entrepreneur Guidelines__`,
        description: `<:Beeclock:1268765723384348705> **__Timing and Starting__**`,
        fields: [
            {
                name: `1. Check <#1267959202433732608> before starting an RP.`, value: `> * Do not schedule over server events.\n<:blank:1278554259050205287>`
            },
            {
                name: `2. Give your group time to react to the ping.`, value: `> * Just like with Shift alerts, let them know 10-30 minutes in advance that you're hosting an event.\n<:blank:1278554259050205287>`
            },
            {
                name: `3. Follow through.`, value: `If you schedule a session in advance, set a reminder. If you say you're going to pay your staff, be sure you have the money ready.\n<:blank:1278554259050205287>`
            },
            {
                name: `4.<:BEExno:1268805744950513715> Never ever ping \`here\`, \`everyone\`, or any role, but your business ping.`, value: `> * You will be immediately demoted and muted, and your job post & role will be deleted.
                > * You *are*, however, allowed to ping <@&1267959053959561337> once a day in case someone is bored and available.\n<:blank:1278554259050205287>`
            },
            {
                name: `<:BEEcoin2:1269024950082076783> __Operating__\n5. Join a busy neighborhood.`, value: `> * If you are a business for customers, find a neighborhood code with loads of people so your business has plenty opportunities for vistors! This will mean you may have to load early before your session to fight for a plot.
                > * Our neighborhood is just for working at Bloxbrug jobs, so you won't likely get much action, but you can use it for training if you need to. If your business is something more interal like stocking food, that works fine! Just don't get in the way of works shifts.\n<:blank:1278554259050205287>`
            },
            {
                name: `6. Manage everyone's moods every 20-30 minutes.`, value: `> * Your business should have a mood boosting area for everyone.
                > * If it doesn't, allow them to clock out and take care of themselves.
                > * You can also offer irl bio-breaks like stretching, getting water, or looking away from the screen.\n<:blank:1278554259050205287>`
            },
            {
                name: `7. Get a candid or posed picture of the group on the job.`, value: `> * Partners love pictures of our group actively getting together! Get creative with it!
                > * You can tell everyone to post their pics into <#1267959227599687691>
                > * Use hashtags like #BEEHIVEBUSINESS or #BEES@[yourbusiness]\n<:blank:1278554259050205287>`
            },
            {
                name: `8. Update your post when the session is over.`, value: `> * Send a message in your post thanking those who joined and notifying those who may have wanted to that their chance is over for now.`
            },
        ]

    };

    const embed2 = {
        color: 16427271        ,
        title: `Other info`,
        description: `1. Be sure you are familiar with the server rules and agreements. Uphold them during your session and your activity in the public channels.
2. Use <#1267959221966606366> to talk with other staff about the job or off the clock, rules are a bit more lax, just don't lose control.
3. The B.E.E. Hive is willing to pay you $5,000 a day for good reviews and excellent group photos (up to $20k a week). YOU will need to request it by pinging me in the <#1267959223350857862>`
    };

    await interaction.editReply({
     embeds: [embed, embed2]});
} 

async function handleManagerGuide (interaction) {
    await interaction.deferReply({ephemeral: true });

    const embed = {
        color: 16427271        ,
        title: `__Shift Manager Guidelines__`,
        description: `<:Beeclock:1268765723384348705> **__Timing and Starting__**`,
        fields: [
            {
                name: `1. Host shifts every week.`, value: `> * If you need to be inactive for any reason for 7+ days, notify Mod+ in your management thread. Inactivity for 15+ days regardless will likely result in a demotion.\n<:blank:1278554259050205287>`
            },
            {
                name:`2. Share the job`, value: `> * Check <#1267959202433732608> before starting a shift.
                > * Do not host more than three times a day.\n<:blank:1278554259050205287>`
            },
            {
                name: `3. Announce shifts well.`, value: `> * Shifts in less than 45 minutes can go through <@1253026215434911865> to <#1267959203486502963>.
                > * Shifts 60+ minutes away are claimed in an Event & posted in <#1267959202433732608>. (Shifts between 46-59 minutes can be claimed in shift claim or break room, but don't make an Event.)
                > * Trainees may not make Events, but may claim times in <#1270565497733382186>.
                > * Use the <#1267959215880798318>.\n<:blank:1278554259050205287>`
            },
            {
                name: `4. Don't forget about your planned or announced shifts.`, value: `> * Remember Rule 9: follow through!`
            },
            {
                name: `5. <:BEExno:1268805744950513715> Never ever ping \`here\`, \`everyone\`, or subscription pings beside \`wyd\`.`, value: `> * You will be immediately demoted and muted.\n<:blank:1278554259050205287>`
            },
            {
                name: `<:BEEmoney:1268805747144134698> __Managing__\n6. Specifically for Blox Burger, be an Adult size and invite every worker to your Family.`, value: `> * If they go AFK, carry them out of their position.
                > * Warn members to protect their fridge by adjusting \`Storage Access\` permissions.
                > * Family at other jobs are optional.\n<:blank:1278554259050205287>`
            },
            {
                name: `7. Manage everyone's moods every 20-30 minutes.`, value: `> * You can offer food, advise station visits, etc.
                > * You can also offer irl bio-breaks like stretching, getting water, or looking away from the screen.\n<:blank:1278554259050205287>`
            },
            {
                name: `8. Get a candid or posed picture of the group on the job.`, value: `> * Partners love pictures of our group actively getting together! Get creative with it!
                > * Tell everyone to post their paychecks and pics into <#1267959207399788625>.
                > * Take note of everyone that joined your shift in your <#1267959223350857862> thread for their bonus xp.\n<:blank:1278554259050205287>`
            },
            {
                name: `9. Check in with the Discord server every 45 minutes.`, value: `> * Check the chat to see if people are asking about your shift.
                > * If your shift is still going strong after 45 minutes, say so in <#1267959203486502963>.\n<:blank:1278554259050205287>`
            },
            {
                name: `<:BEEmod:1268805750898294907> __Moderating__\nYou are the deputy of Bloxburg when you are in an official BEE neighborhood.`, value: `> * If someone is causing trouble and not listening to your sound management advice, **take screenshots/video of your and their actions** and report them and/or ban them from the neighborhood.
                > * You can **ask other employees to share their side** of the story in Support Tickets as well as more evidence.
                > * **Notify other shift managers why** you've banned them, so it cna be done across all neighborhoods.`
            }
        ]
    }

    const embed2 = {
        color: 16427271        ,
        title: `Other info`,
        description: `1. Be sure you are familiar with the server rules and agreements and uphold them during your shift and your activity in the public channels.
2. Use the <#1267959221966606366> to talk with other staff about the job or off the clock, rules are a bit more lax, but don't lose absolute control.
3. I am willing to pay you $10,000 a day for good reviews and excellent group photos (up to $50k a week). You will need to request it by pinging me in your <#1267959223350857862> thread.`,
    };

    await interaction.editReply({
     embeds: [embed, embed2]});
} 

  module.exports = {
    handleBuildingGuide,
    handleEntreGuide,
    handleCaterGuide,
    handleManagerGuide,
  }