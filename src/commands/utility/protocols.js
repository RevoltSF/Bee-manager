const { ApplicationCommandOptionType, EmbedBuilder, ButtonStyle, ButtonBuilder, ButtonInteraction, ButtonComponent, ActionRowBuilder, ComponentType } = require("discord.js");
const { getUser } = require("@schemas/User");
const EMBED_COLORS = require("@root/config").EMBED_COLORS


/**
 * @type {import("@structures/Command")}
 */
module.exports = {
    name: "protocols",
    description: "used to manage protocols",
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
                description: "select a channel to send the message in",
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

        if(sub == "channel") {
            const channel = interaction.options.getChannel("channel");


            const embed = new EmbedBuilder()
            .setColor(EMBED_COLORS.BOT_EMBED)
            .setTitle("__**Protocol Summaries**__")
            .setThumbnail(interaction.guild.iconURL())
            .setDescription(`**Try to check in at least every other day! If you think you'll be absent more than three (3) days, please notify the team before you go.**`)
            .addFields(
                {
                    name: `1️⃣ **|** :shield: Protect & Serve`, value: `* Monitor all messages for appropriateness & respect
* Answer questions or divert to #server-info support
* Delete inappropriate messages (slurs, cursing at people, instigation)
* De-escalate drama with understanding or a reminder to be kind or private`
                },
                {
                    name:  `2️⃣ **|** :rotating_light: Police & Slap! >:D`, value: `* If people are getting off-topic, link the right channel or ping them from inside it
* You can give one gentle reminder before resorting to Circle's command
* Include which rule/agreement was broken in your Circle command
* If they're new, just remind them of the rule they break without a Circle warn`
                },
                {
                    name: `3️⃣ **|** :sparkles: Polish & Side (with staff)`, value: `* Please await approval & proofreading from two admin or the owner before announcing or pinging the server.
* Take your time when responding to something about the rules. Make sure it aligns with what's already been established.
* If another Mod+ says something that might be out of line, ping them in #offtopic-mod about it to let them correct themselves in public. *#UnitedFront*
* If another Mod+ is properly handling a situation, try not to chime in too much and let them finish handling it. Reactions are cool though <:BEEcheck:1268805754924695602>`
                },
                {
                    name: `4️⃣ **|** :recycle: Partner & Solicit!`, value: `* Notice when you've found a server that might create a mutual benefit by partnering with us.
* Scope them out before offering or accepting
* Check the recruiting thread from time to time to see if anyone new wants to join or the threads have fallen far down the list (links in server-info)
* Search the looking-for-group/players forums for people looking to work "Burger" and offer an invitation`
                },
            )

        const protocolRow1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel("Chart").setCustomId("HIERARCHY").setStyle(ButtonStyle.Success).setEmoji("1269194348696830062"),
            new ButtonBuilder().setLabel("Protect & Serve").setCustomId("PROTECT_SERVE").setStyle(ButtonStyle.Success).setEmoji("🛡️"),
            new ButtonBuilder().setLabel("Police & Slap").setCustomId("POLICE_SLAP").setStyle(ButtonStyle.Success).setEmoji("🚨"),
            new ButtonBuilder().setLabel("Polish & Side").setCustomId("POLISH_SIDE").setStyle(ButtonStyle.Success).setEmoji("✨"),
            new ButtonBuilder().setLabel("Sending Partnerships").setCustomId("SEND_PARTNER").setStyle(ButtonStyle.Success).setEmoji("🙌"),
        );
        const protocolRow2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel("Answering Partnerships").setCustomId("ANSWER_PARTNER").setStyle(ButtonStyle.Success).setEmoji("🤝"),
            new ButtonBuilder().setLabel("Punishments").setCustomId("PUNISHMENTS").setStyle(ButtonStyle.Success).setEmoji("1268805750898294907"),
            new ButtonBuilder().setLabel("Who to Ping").setCustomId("SUBSCRIPTIONS").setStyle(ButtonStyle.Success).setEmoji("1281663676591505479"),
        );

        const message = await channel.send({embeds: [embed], components: [protocolRow1, protocolRow2]});
        interaction.followUp({
            content: `I successfully sent it! Check ${message.url}`
        })
        }
    }}