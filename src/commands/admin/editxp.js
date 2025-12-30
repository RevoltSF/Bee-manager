const { WORKSTATS } = require("@root/config");
const { ephemeral } = require('@root/src/structures/BaseContext');

module.exports = {
    name: "editxp",
    description: "Edit the XP of a user in the leaderboard.",
    category: "ADMIN",
    botPermissions: ["EmbedLinks"],
    userPermissions: ["Administrator"],
    command: {
        enabled: false,
    },
    slashCommand: {
        enabled: true,
		ephemeral: true,
        options: [
            {
                type: 6, // Type 6 corresponds to USER
                name: "user",
                description: "The user whose XP you want to edit",
                required: true,
            },
            {
                type: 4, // Type 4 corresponds to INTEGER
                name: "amount",
                description: "The amount of XP to set",
                required: true,
            },
        ],
    },

    async interactionRun(interaction) {
        const targetUser = interaction.options.getUser("user");
        const xpAmount = interaction.options.getInteger("amount");
        const channelID = WORKSTATS.workStatsChannel; // Use the channel ID from the config
        const channel = await interaction.guild.channels.cache.get(channelID);
        
        if (!channel) {
            return interaction.reply({ content: 'Channel not found!', ephemeral: true });
        }

        try {
            const message = await channel.messages.fetch({after:0, limit: 1 });
            const leaderboardMessage = message.first();
            
            if (!leaderboardMessage || !leaderboardMessage.content) {
                return interaction.followUp({ content: 'No leaderboard data found!', ephemeral: true });
            } 
            
            const leaderboardContent = leaderboardMessage.content;
            const weeks = extractWeekRangeFromContent(leaderboardContent);
            const start = weeks.startingWeek;
            const end = weeks.endingWeek;

            // Parse the leaderboard content
            const existingXP = parseLeaderboard(leaderboardContent);

            // Update the target user's XP
            const userEntry = existingXP.find(entry => entry.userId === targetUser.id);

            if (xpAmount === 0) {
                // Remove the user from the leaderboard if their XP is 0
                const index = existingXP.findIndex(entry => entry.userId === targetUser.id);
                if (index !== -1) {
                    existingXP.splice(index, 1); // Remove the user from the array
                }
            } else {
                // If the user exists, update their XP
                if (userEntry) {
                    userEntry.xp = xpAmount; // Set to the new XP amount
                } else {
                    // If the user is not already in the leaderboard, add them
                    existingXP.push({ userId: targetUser.id, xp: xpAmount });
                }
            }


            // Sort the leaderboard by XP in descending order
            const sortedLeaderboard = existingXP.sort((a, b) => b.xp - a.xp);

            // Create the new leaderboard string with an asterisk before each user
            let newLeaderboard = sortedLeaderboard.map(entry => `> * <@${entry.userId}> = ${entry.xp}`).join('\n').trim();

            // Update the message with the new leaderboard
            await leaderboardMessage.edit(`
# Week of ${start} to ${end}\n-# xp to be given out **after** workaholic weekend
## Leaderboard:

${newLeaderboard}
            `.trim());

            // Check if we have already replied
            if (!interaction.replied) {
                // Reply to the interaction
                return interaction.followUp({ content: `Successfully updated ${targetUser.tag}'s XP to ${xpAmount}.`, ephemeral: true });
            }
        } catch (error) {
            console.error(error);
            // Ensure that we only reply once in case of an error
            if (!interaction.replied) {
                return interaction.followUp({ content: 'An error occurred while processing your request.', ephemeral: true });
            }
        }
    },
};

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