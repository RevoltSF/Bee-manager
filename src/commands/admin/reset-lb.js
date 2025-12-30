const { ApplicationCommandOptionType, ChannelType } = require("discord.js");
const { WORKSTATS} = require("@root/config")
/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "reset-lb",
  description: "reset the work-stats leaderboard",
  category: "ADMIN",
  command: {
    enabled: false,
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
      {
        name: "start-day",
        description: "the starting day's timestamp",
        required: true,
        type: ApplicationCommandOptionType.String,
      },
      {
        name: "end-day",
        description: "the end day's timestamp",
        required: true,
        type: ApplicationCommandOptionType.String,
      },
    ],
  },


  async interactionRun(interaction, data) {
      const allowedRoles = ['1267959002164232292', '1267959003078725722']; // Replace with actual role IDs

    // Check if the user has at least one of the allowed roles
    if (!interaction.member.roles.cache.some(role => allowedRoles.includes(role.id))) {
        return interaction.reply({ content: "You don't have permission to use this command.", ephemeral: true });
    }
      
    function parseLeaderboard(content) {
        const leaderboard = [];
      
        // Check if the leaderboard exists in the content
        if (content.includes('## Leaderboard:')) {
          // Extract the leaderboard section
          const leaderboardSection = content.split('## Leaderboard:')[1].trim();
          const entries = leaderboardSection.split('\n');
      
          // Iterate through each entry and extract user ID and XP
          entries.forEach(entry => {
            const match = entry.match(/<@(\d+)>/);
            if (match) {
              const userId = match[1];
              const xp = parseInt(entry.split(' = ')[1]);
              leaderboard.push({ userId, xp });
            }
          });
        }
      
        return leaderboard;
      }
    const start = interaction.options.getString("start-day")
    const end = interaction.options.getString("end-day")

      const channelID = WORKSTATS.workStatsChannel
    
      const channel = await interaction.guild.channels.cache.get(channelID);
      await channel.messages.fetch({ after: 0, limit: 1 })
        .then(messages => {
            const message = messages.first();
            const array = parseLeaderboard(message.content);
            message.edit({
                content: `# Week of ${start} to ${end}\n-# * XP to be given out **after** workaholic weekend.
## Leaderboard:

Empty for now
    `
            });

            let field = "";
           
            array.forEach((value) => {
                const id = value.userId;
                const xp = value.xp
                const newCmd = `\`\`\`/xp add member: <@${id}> xp: ${xp}\`\`\``;
                field = `${field}\n\n${newCmd}`;
            })
            interaction.followUp({
                content: `Done! I just reset the leaderboard, you can use these shortcuts to add XP to members:${field}`
            })
        })

  },
};