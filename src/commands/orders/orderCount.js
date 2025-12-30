const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: 'oc',
    description: 'Add or subtract a Caterer\'s completed orders.',
    command: {
        enabled: false,
    },
    slashCommand: {
        enabled: true,
        ephemeral: true,
        options: [
            {
                name: 'set',
                description: 'Set a Caterer\'s completed order count.',
                type: 1,
                options: [
                    {
                        name: 'user',
                        description: 'Select a Caterer to set',
                        type: ApplicationCommandOptionType.User,
                        required: true,
                    },
                    {
                        name: 'amount',
                        description: 'How many completed orders?',
                        type: ApplicationCommandOptionType.Number,
                        required: true,
                    }
                ]
            },
            {
                name: 'wipe',
                description: 'Wipe every Caterer\'s completed orders.',
                type: 1,
                options: [
                    {
                        name: 'user',
                        description: 'Select a Caterer to set',
                        type: ApplicationCommandOptionType.User,
                        required: false,
                    },
                ]
            }
        ]
    },

    async interactionRun(interaction) {

        const sub = interaction.options.getSubcommand();

        const idid = require("@root/config").BLOXBURG_ORDERS.CATETER_MANAGER;
        if((interaction.member.roles.cache.has(idid)) == false && !interaction.member.permissions.has('Administrator')){
            return interaction.followUp("You don't have permission to use this command.")
        }

        let catererInfo = interaction.client.catererdatabase.get('CatererInfo') || [];

        if (sub === 'set') {
            const user = interaction.options.getUser("user");
            const amount = interaction.options.getNumber("amount");

            let catererEntry = catererInfo.find(entry => entry.userID === user.id);
            if (catererEntry) {
                catererEntry.completedOrders = amount;
            } else {
                // Add new entry if the user doesn't exist
                catererEntry = { userID: user.id, completedOrders: amount };
                catererInfo.push(catererEntry);
            }

            interaction.client.catererdatabase.set('CatererInfo', catererInfo);

            await interaction.followUp({
                content: `Successfully set ${user.username}'s completed orders to ${amount}.`
            });

        } else if (sub === 'wipe') {
            const user = interaction.options.getUser("user");
        
            if (user) {
                // Find the user's entry and remove it from the array
                const userIndex = catererInfo.findIndex(entry => entry.userID === user.id);
                if (userIndex !== -1) {
                    catererInfo.splice(userIndex, 1); // Remove the entry at the found index
                    interaction.followUp({
                        content: `Caterer <@${user.id}>'s ompleted orders has been wiped.`
                    });
                } else {
                    interaction.followUp({
                        content: `No entry found for Caterer <@${user.id}>.`
                    });
                }
            } else {
                // If no user is specified, reset everyone's completedOrders to 0
                catererInfo.forEach(entry => entry.completedOrders = 0);
                interaction.client.catererdatabase.set('CatererInfo', catererInfo);
        
                await interaction.followUp({
                    content: `All Caterers' completed orders have been reset to 0.`
                });
            }
        
            // Update the database
            interaction.client.catererdatabase.set('CatererInfo', catererInfo);
        }
    }
}