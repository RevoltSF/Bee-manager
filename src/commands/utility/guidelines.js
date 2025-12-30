const { ApplicationCommandOptionType, EmbedBuilder, ButtonStyle, ButtonBuilder, ButtonInteraction, ButtonComponent, ActionRowBuilder, ComponentType } = require("discord.js");
const { getUser } = require("@schemas/User");
const EMBED_COLORS = require("@root/config").EMBED_COLORS


/**
 * @type {import("@structures/Command")}
 */

module.exports = {
    name: 'guidelines',
    description: 'used to managed guidelines',
    category: 'UTILITY',
    userPermissions: ["ManageGuild"],
    command: {
        enabled: false
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

    async interactionRun (interaction, data) {
        const settings = data.settings

        const sub = interaction.options.getSubcommand();

        if (sub == "channel") {
            const channel = interaction.options.getChannel("channel");

            const embed = new EmbedBuilder()
            .setColor(EMBED_COLORS.BOT_EMBED)
            .setDescription(`# <:BEEup:1268808091227390004> Congratulations on your promotion! 
As a service provider to the B.E.E. Hive, you're held at a bit of a higher standard than the other BEEs. Use these guidelines to remain in good standing.

### __Overall:__
* Stay active in the server at least once a week.
* If you can't get a task, help advertise the server.
* Don't monopolize the market; share the clientele.
* Follow the <#1267959178249371770> to the best of your ability.

### __**If you need help:**__
1. Reach out to your respective Dept. Head.
2. If they are not available to help you in 24 hours or for time-sensitive matters, reach out to an Admin.
3. If they cannot help you in 36 hours or for time-sensitive matters, reach out to Dee.
<:BEEwarn:1268469054931210291> Failure to follow this chain may result in demotion. Do not immediately go to Dee. We built a team of fully capable administrators to help run the Hive.

Click the buttons for guidelines about your particular job(s).`)

        const guidelines = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel("Builders").setCustomId("BUILD_GUIDE").setStyle(ButtonStyle.Primary).setEmoji("1270130529613774950"),
            new ButtonBuilder().setLabel("Catering").setCustomId("CATERING_GUIDE").setStyle(ButtonStyle.Primary).setEmoji("1268805753704157256"),
            new ButtonBuilder().setLabel("Entrepreneurship").setCustomId("ENTRE_GUIDE").setStyle(ButtonStyle.Primary).setEmoji("1268603590528729201"),
            new ButtonBuilder().setLabel("Shift Managers").setCustomId("MANAGER_GUIDE").setStyle(ButtonStyle.Primary).setEmoji("1268805747144134698"),

        )

        const message = await channel.send({embeds: [embed], components: [guidelines]});
        interaction.followUp({
        content: `I successfully sent it! Check ${message.url}`
        })
        }
    }

}