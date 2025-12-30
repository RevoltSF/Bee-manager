const { ephemeral } = require("@root/src/structures/BaseContext");
const { ApplicationCommandOptionType, ButtonStyle, ButtonBuilder, ActionRowBuilder, ComponentType, MessageActionRow, MessageButton, MessageComponentInteraction } = require("discord.js");

const categories = [
    { name: "Stop Ignoring Me", value: 'stop_ignore' },
    { name: 'Time Sensitive', value: 'time' }, 
    { name: 'Ongoing project', value: 'ongoing' },  
    { name: "Must be Dee", value: 'dee' }, 
    { name: 'Admin', value: 'admin' }, 
    { name: 'Low Priority', value: 'low' },                
    { name: 'Undone', value: 'undone' },               
    { name: 'Complete', value: 'completed' }              
];

// Existing emoji mappings
const emojiMappings = {
    stop_ignore: '🚨',
    time: '⌚',
    ongoing: '♾️',
    dee: '<:beyqueen:1269194348696830062>',
    admin: '<:BEEmod:1268805750898294907>',
    low: '⏬',
    completed: '🟢',
    undone: '⭕'
};

const orderedCategories = [
    'stop_ignore',
    'time',
    'ongoing',
    'dee',
    'admin',
    'low',
    'undone',
    'completed',
];

// Descriptions for each category
const descriptionMappings = {
    stop_ignore: 'Stop ignoring me!',
    time: 'Time sensitive',
    ongoing: 'Ongoing project',
    dee: 'Must be Dee',
    admin: 'Must be Admin',
    low: 'Low Priority',
    completed: 'Completed',
    undone: 'Undone'
};

module.exports = {
    name: 'to-do',
    description: 'Create and manage a todo list for staff members',
    category: "ADMIN",
    command: {
        enabled: false,
    },
    slashCommand: {
        enabled: true,
        ephemeral: false,
        options: [
            {
                name: 'new-week',
                description: 'Create a new todo list',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'start',
                        description: 'Enter the beginning of the week',
                        type: ApplicationCommandOptionType.String,
                        required: true,
                    },
                    {
                        name: 'end',
                        description: 'Enter the end of the week',
                        type: ApplicationCommandOptionType.String,
                        required: true,
                    },
                    {
                        name: 'new-task',
                        description: 'Enter a task to add to the list',
                        type: ApplicationCommandOptionType.String,
                        required: false,
                    },
                    {
                        name: 'category',
                        description: 'What category does this task belong to?',
                        type: ApplicationCommandOptionType.String,
                        choices: categories,
                        required: false,
                    }
                ]
            },
            {
                name: 'add',
                description: 'Add an item to the to-do list',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'task',
                        description: 'Add a task to the todo list',
                        type: ApplicationCommandOptionType.String,
                        required: true,

                    },
                    {
                        name: 'task-id',
                        description: 'Enter a task id to add a subtask',
                        type: ApplicationCommandOptionType.Number,
                        required: false,
                    },
                    {
                        name: 'category',
                        description: 'What category does this task belong to?',
                        type: ApplicationCommandOptionType.String,
                        choices: categories,
                        required: false,
                    },
                ]
            },
            {
                name: 'remove',
                description: 'Remove a task from the todo list',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'task-id',
                        description: 'Enter the id of the task you\'d like to remove',
                        type: 10,
                        required: true,
                    }
                ]
            },
            {
                name: 'edit',
                description: 'Edit a to-to list task',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'task-id',
                        description: 'Enter the id of the task you\'d like to remove',
                        type: ApplicationCommandOptionType.Number,
                        required: true,
                    },
                    {
                        name: 'new-task',
                        description: 'What would you like to edit the task to?',
                        type: ApplicationCommandOptionType.String,
                        required: false,
                    },
                    {
                        name: 'category',
                        description: 'Change the category of a task',
                        type: ApplicationCommandOptionType.String,
                        choices: categories,
                        required: false,
                    },
                    {
                        name: 'slot',
                        description: 'Where you want to move the task to',
                        type: ApplicationCommandOptionType.Number,
                        required: false,
                    }
                ]
            },
            {
                name: 'claim',
                description: 'Claim a task from the todo list',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'task-id',
                        description: 'What is the id of the task you\'d like to claim?',
                        type: 10,
                        required: true,
                    }
                ]
            },
            {
                name: 'transfer',
                description: 'Transfer a claimed todo list task to another person',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'task-id',
                        description: 'What is the id of the task you\'d like to claim?',
                        type: 10,
                        required: true,
                    },
                    {
                        name: 'user',
                        description: 'Who do you want to transfer your claimed task to? (Leave blank to unclaim)',
                        type: 6,
                        required: false,
                    }
                ]
            },
            {
                name: 'complete',
                description: 'Mark a todo list item as complete',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'task-id',
                        description: 'Enter the id of the task that you have completed',
                        type: 10,
                        required: true,
                    }
                ]
            },
        ]
    },

    async interactionRun(interaction) {
        const sub = interaction.options.getSubcommand();
        const targetChannel = interaction.guild.channels.cache.get('1267959208465399980');
        
        const allowedRoles = ['1268995995375505458', '1267959004009857034']; //Trial Mod & Mod+ roles

        // Check if the member has at least one of the allowed roles
        const hasRole = interaction.member.roles.cache.some(role => allowedRoles.includes(role.id));

        // If the member does not have the required roles, return an error
        if (!hasRole) {
            return interaction.followUp({
                content: `You are not authorized to use this command.`,
                ephemeral: true,
            });
        }
    
        if (sub === 'new-week') {
            const start = interaction.options.getString('start');
            const end = interaction.options.getString('end');
            const newTask = interaction.options.getString('new-task');
            let category = interaction.options.getString('category');
        
            let todoLists = interaction.client.todolistdatabase.get('todoLists') || [];
            let latestTodoList;
        
            // If there is an existing to-do list, update the start and end date
            if (todoLists.length > 0) {
                latestTodoList = todoLists[todoLists.length - 1];
                latestTodoList.startDate = start;
                latestTodoList.endDate = end;
                latestTodoList.pendingMessageID = null;
                latestTodoList.messageID = null;
        
                latestTodoList.tasks.forEach(task => {
                    // Store the original subtasks to check if all were completed
                    const originalSubtasks = task.subtasks || [];
                
                    // Filter out completed subtasks
                    task.subtasks = originalSubtasks.filter(subtask => subtask.status !== 'completed');
                
                    // Check if all subtasks were completed
                    if (originalSubtasks.length > 0 && task.subtasks.length === 0) {
                        // All subtasks were completed, mark the parent task as completed
                        task.status = 'completed';
                    }
                });
                
                // Filter out tasks that should be marked as completed
                latestTodoList.tasks = latestTodoList.tasks.filter(task => {
                    // Keep tasks with no subtasks and status is pending
                    if (task.subtasks.length === 0 && task.status === 'pending') {
                        return true;
                    }
                    // Remove tasks marked as completed
                    return task.status !== 'completed';
                }); 
                
                // Update the database with the modified to-do list
                interaction.client.todolistdatabase.set('todoLists', latestTodoList);                

                // Update the task IDs after filtering
                latestTodoList.tasks.forEach((task, index) => {
                    task.id = index + 1;
                });

                // Assign subtask IDs
                latestTodoList.tasks.forEach(task => {
                    task.subtasks.forEach((subtask, index) => {
                        subtask.subid = parseFloat(`${task.id}.${index + 1}`);
                    });
                });

                // Filter pending tasks for the message
                const pendingTasks = latestTodoList.tasks.filter(task => task.status === 'pending');

                // Prepare the pending message
                let pendingMessage = '';
                if (pendingTasks.length > 0) {
                    pendingMessage = `Todo list updated for the week starting **${start}** and ending **${end}**${newTask ? ` with new task: ${newTask}` : ''}.\n\nThese tasks were not completed from the previous week:\n`;

                    pendingMessage += pendingTasks.map(task => {
                        const emoji = task.status === 'completed'
                            ? emojiMappings['completed']
                            : emojiMappings[task.category] || '⭕';

                        let taskString = `${emoji} ${task.description}\n-# [Task ID: ${task.id}] Claimed by: ${task.assignedTo ? `${task.assignedTo}` : 'Nobody'}`;

                        if (task.subtasks && task.subtasks.length > 0) {
                            const subtaskStrings = task.subtasks.map(subtask => {
                                const subtaskEmoji = subtask.status === 'completed'
                                    ? emojiMappings['completed']
                                    : emojiMappings[subtask.category] || '⭕';

                                return `> ${subtaskEmoji} ${subtask.description}\n> -# [Subtask ID: ${subtask.subid}] Claimed by: ${subtask.assignedTo ? `${subtask.assignedTo}` : 'Nobody'}`;
                            }).join('\n');
                            taskString += `\n${subtaskStrings}`;
                        }

                        return taskString;
                    }).join('\n');
                } else {
                    pendingMessage = 'All tasks from the previous week were completed';
                }

                // Add new task at the bottom, if provided
                if (newTask) {
                    const newTaskEmoji = emojiMappings[category] || emojiMappings['undone']; // Use category emoji or a default

                    pendingMessage += `\n\n__You have added this new task__\n${newTaskEmoji} ${newTask}\n\nTo add another task or subtask, send the list and then use the \`/to-do add\` command.`;
                }
        
                // Create the confirmation and cancel buttons
                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('confirming_send')
                        .setLabel('Send List')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('cancelling_send')
                        .setLabel('Cancel Send')
                        .setStyle(ButtonStyle.Danger)
                );
        
                const sentMessage = await interaction.followUp({
                    content: pendingMessage || 'All tasks from the previous week were completed',
                    components: [row],
                    ephemeral: true,
                });

                latestTodoList.pendingMessageID = sentMessage.id;

                if (newTask) {
                    if (!category) {
                        category = 'undone';
                    }

            
                    const taskId = latestTodoList.tasks.length + 1;
            
                    const task = {
                        id: taskId,
                        description: newTask,
                        category: category,
                        assignedTo: null,
                        UserID: null,
                        status: 'pending',
                        subtasks: []
                    };
            
                    latestTodoList.tasks.push(task);
                }
            
                interaction.client.todolistdatabase.set('todoLists', todoLists);

                const message = buildTodoListMessage(latestTodoList, emojiMappings, descriptionMappings, orderedCategories);
        
                // Setup message component collector for button interaction
                const filter = i => (i.customId === 'confirming_send' || i.customId === 'cancelling_send') && i.user.id === interaction.user.id;
                const collector = interaction.channel.createMessageComponentCollector({
                    filter,
                    componentType: ComponentType.Button,
                    time: 60000,
                });
        
                collector.on('collect', async i => {
                    const pendingMessageID = latestTodoList.pendingMessageID;
        
                    if (pendingMessageID) {
                        try {
                            const channel = await i.guild.channels.fetch(interaction.channel.id);
                            const pendingMessage = await channel.messages.fetch(pendingMessageID);
                            await pendingMessage.delete();
                            latestTodoList.pendingMessageID = null;
                            interaction.client.todolistdatabase.set('todoLists', todoLists);
                        } catch (error) {
                            console.error('Error deleting pending message:', error);
                        }
                    }
        
                    if (i.customId === 'confirming_send') {
                        const sentMessage = await targetChannel.send({ content: message });
        
                        latestTodoList.messageID = sentMessage.id;
                        todoLists[todoLists.length - 1] = latestTodoList;
                        interaction.client.todolistdatabase.set('todoLists', todoLists);
        
                        await i.reply({
                            content: 'To-do list has been successfully sent!',
                            components: [],
                            ephemeral: true,
                        });

                    } else if (i.customId === 'cancelling_send') {

                       
                        if (newTask) {
                            // Only splice if a new task was actually added
                            if (latestTodoList && latestTodoList.tasks && latestTodoList.tasks.length > 0) {
                                latestTodoList.tasks.splice(-1, 1);
                                interaction.client.todolistdatabase.set('todoLists', todoLists);
                            }
                        }

                        const pendingMessageID = latestTodoList.pendingMessageID;
        
                        if (pendingMessageID) {
                            try {
                                const pendingMessage = await channel.messages.fetch(pendingMessageID);
                                await pendingMessage.delete();
                                latestTodoList.pendingMessageID = null;
                                interaction.client.todolistdatabase.set('todoLists', todoLists);
                            } catch (error) {
                                console.error('Error deleting pending message:', error);
                            }
                        }
                    
                        // Reply to the interaction indicating that the to-do list was not sent
                        await i.reply({
                            content: 'The latest task has been removed from the to-do list.',
                            components: [],
                            ephemeral: true,
                        });
                    }                    
                });
        
                collector.on('end', async (collected) => {
                    if (collected.size === 0) {
                        const pendingMessageID = latestTodoList.pendingMessageID;
                
                        if (pendingMessageID) {
                            try {
                                // Fetch the channel using interaction.guild.channels
                                const channel = await interaction.guild.channels.fetch(interaction.channel.id);
                
                                if (channel) {
                                    // Fetch and delete the pending message
                                    const pendingMessage = await channel.messages.fetch(pendingMessageID);
                                    await pendingMessage.delete();
                
                                    // Reset the pending message ID
                                    latestTodoList.pendingMessageID = null;
                                    interaction.client.todolistdatabase.set('todoLists', todoLists);
                                } else {
                                    console.error('Channel not found.');
                                }
                            } catch (error) {
                                console.error('Error deleting pending message:', error);
                            }
                        }
                
                        // Send follow-up message
                        await interaction.followUp({
                            content: 'Confirmation timed out. Tasks were saved to the database.\nRun the command again to send the list.',
                            ephemeral: true,
                        });
                    }
                });                               
        
            } else {
                latestTodoList = {
                    startDate: start,
                    endDate: end,
                    pendingMessageID: null,
                    tasks: [],
                    messageID: null,
                };

                if (newTask) {
                    if (!category) {
                        category = 'undone';
                    }

                    const taskId = 1; // Start with ID 1 for a new list

                    const task = {
                        id: taskId,
                        description: newTask,
                        category: category,
                        assignedTo: null,
                        UserID: null,
                        status: 'pending',
                        subtasks: []
                    };

                    // Initialize tasks array with the new task
                    latestTodoList.tasks.push(task);

                    const newTaskEmoji = emojiMappings[task.category] || emojiMappings['undone'];
                    // Message indicating the task has been added
                    const pendingMessage = category === 'undone'
                    ? `Brand new Todo list created for the week starting **${start}** and ending **${end}**.\n\n__You have added this new task__\n${newTaskEmoji} ${newTask}`
                    : `Brand new Todo list created for the week starting **${start}** and ending **${end}**.\nYou did not add a task. You can send the list and do \`/to-do edit\` to edit the task or cancel it and run the command again.`;
                
                    // Create the confirmation and cancel buttons
                    const row = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('confirm_send')
                            .setLabel('Send List')
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId('cancel_send')
                            .setLabel('Cancel Send')
                            .setStyle(ButtonStyle.Danger)
                    );
                
                    // Save the updated to-do list in the database
                    todoLists.push(latestTodoList);
                    interaction.client.todolistdatabase.set('todoLists', todoLists);

                    const sentMessage = await interaction.followUp({
                        content: pendingMessage, 
                        components: [row],
                        ephemeral: true,
                    });

                    // Save the message ID to the database
                    latestTodoList.pendingMessageID = sentMessage.id;
                
                    // Setup message component collector for button interaction
                    const filter = i => (i.customId === 'confirm_send' || i.customId === 'cancel_send') && i.user.id === interaction.user.id;
                    const collector = interaction.channel.createMessageComponentCollector({
                        filter,
                        componentType: ComponentType.Button,
                        time: 60000,
                    });
                
                    collector.on('collect', async i => {
                        const pendingMessageID = latestTodoList.pendingMessageID;
                
                        if (pendingMessageID) {
                            try {
                                const channel = await i.guild.channels.fetch(interaction.channel.id);
                                const pendingMessage = await channel.messages.fetch(pendingMessageID);
                                await pendingMessage.delete();
                                latestTodoList.pendingMessageID = null;
                                interaction.client.todolistdatabase.set('todoLists', todoLists);
                            } catch (error) {
                                console.error('Error deleting pending message:', error);
                            }
                        }
                
                        if (i.customId === 'confirm_send') {
                            const message = buildTodoListMessage(latestTodoList, emojiMappings, descriptionMappings, orderedCategories);
                            const sentMessage = await targetChannel.send({ content: message });
                
                            latestTodoList.messageID = sentMessage.id;
                            todoLists[todoLists.length - 1] = latestTodoList;
                            interaction.client.todolistdatabase.set('todoLists', todoLists);
                
                            await i.reply({
                                content: 'To-do list has been successfully sent!',
                                components: [],
                                ephemeral: true,
                            });
                
                        } else if (i.customId === 'cancel_send') {
                            // Remove the last added to-do list from the todoLists array
                            latestTodoList = null; // Removes the last element (the current week's to-do list)
                        
                            // Update the database after splicing the list
                            interaction.client.todolistdatabase.set('todoLists', []);
                        
                            // Reply to the interaction indicating that the to-do list was not sent
                            await i.reply({
                                content: 'The to-do list was not sent.',
                                components: [],
                                ephemeral: true,
                            });
                        }
                    });
                
                    collector.on('end', (collected) => {
                        if (collected.size === 0) {
                            const pendingMessageID = latestTodoList.pendingMessageID;
                    
                            if (pendingMessageID) {
                                // Fetch the channel using interaction.guild.channels
                                const channel = interaction.guild.channels.cache.get(interaction.channel.id);
                    
                                if (channel) {
                                    // Fetch the pending message using the ID
                                    channel.messages.fetch(pendingMessageID)
                                        .then((pendingMessage) => {
                                            // Delete the pending message
                                            return pendingMessage.delete();
                                        })
                                        .then(() => {
                                            // Reset the pending message ID
                                            latestTodoList.pendingMessageID = null;
                                            interaction.client.todolistdatabase.set('todoLists', todoLists);
                                        })
                                        .catch((error) => {
                                            console.error('Error deleting pending message:', error);
                                        });
                                } else {
                                    console.error('Channel not found.');
                                }
                            }
                    
                            // Send follow-up message
                            interaction.followUp({
                                content: 'Confirmation timed out. Tasks were saved to the database.\nRun the command again to send the list.',
                                ephemeral: true,
                            });
                        }
                    }); 

                } else {
                    category = 'undone'

                    const taskId = 1; // Start with ID 1 for a new list

                    const task = {
                        id: taskId,
                        description: 'Unknown',
                        category: category,
                        assignedTo: null,
                        UserID: null,
                        status: 'pending',
                        subtasks: []
                    };

                    // Initialize tasks array with the new task
                    latestTodoList.tasks.push(task);

                    const newTaskEmoji = emojiMappings[task.category] || emojiMappings['undone'];
                    // Message indicating the task has been added
                    const pendingMessage = `Brand new Todo list created for the week starting **${start}** and ending **${end}**.\nYou did not add a task. You can send the list and do \`/to-do edit\` to edit the task or cancel it and run the command again.`;
                
                    // Create the confirmation and cancel buttons
                    const row = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('confirmed_send')
                            .setLabel('Send List')
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId('cancelled_send')
                            .setLabel('Cancel Send')
                            .setStyle(ButtonStyle.Danger)
                    );
                
                    // Save the updated to-do list in the database
                    todoLists.push(latestTodoList);
                    interaction.client.todolistdatabase.set('todoLists', todoLists);

                    const sentMessage = await interaction.followUp({content: pendingMessage, components: [row]});

                    // Save the message ID to the database
                    latestTodoList.pendingMessageID = sentMessage.id;
                
                    // Setup message component collector for button interaction
                    const filter = i => (i.customId === 'confirmed_send' || i.customId === 'cancelled_send') && i.user.id === interaction.user.id;
                    const collector = interaction.channel.createMessageComponentCollector({
                        filter,
                        componentType: ComponentType.Button,
                        time: 60000,
                    });
                
                    collector.on('collect', async i => {
                        const pendingMessageID = latestTodoList.pendingMessageID;
                
                        if (pendingMessageID) {
                            try {
                                const channel = await i.guild.channels.fetch(interaction.channel.id);
                                const pendingMessage = await channel.messages.fetch(pendingMessageID);
                                await pendingMessage.delete();
                                latestTodoList.pendingMessageID = null;
                                interaction.client.todolistdatabase.set('todoLists', todoLists);
                            } catch (error) {
                                console.error('Error deleting pending message:', error);
                            }
                        } else {
                            return
                        }
                
                        if (i.customId === 'confirmed_send') {
                            const message = buildTodoListMessage(latestTodoList, emojiMappings, descriptionMappings, orderedCategories);
                            const sentMessage = await targetChannel.send({ content: message });
                
                            latestTodoList.messageID = sentMessage.id;
                            todoLists[todoLists.length - 1] = latestTodoList;
                            interaction.client.todolistdatabase.set('todoLists', todoLists);
                
                            await i.reply({
                                content: 'To-do list has been successfully sent!',
                                components: [],
                                ephemeral: true,
                            });
                
                        } else if (i.customId === 'cancelled_send') {
                            // Remove the last added to-do list from the todoLists array
                            latestTodoList = null; // Removes the last element (the current week's to-do list)
                        
                            // Update the database after splicing the list
                            interaction.client.todolistdatabase.set('todoLists', []);
                        
                            // Reply to the interaction indicating that the to-do list was not sent
                            await i.reply({
                                content: 'The to-do list was not sent.',
                                components: [],
                                ephemeral: true,
                            });
                        }
                        
                    });
                
                    collector.on('end', (collected) => {
                        if (collected.size === 0) {
                            const pendingMessageID = latestTodoList.pendingMessageID;
                    
                            if (pendingMessageID) {
                                // Fetch the channel using interaction.guild.channels
                                const channel = interaction.guild.channels.cache.get(interaction.channel.id);
                    
                                if (channel) {
                                    // Fetch the pending message using the ID
                                    channel.messages.fetch(pendingMessageID)
                                        .then((pendingMessage) => {
                                            // Delete the pending message
                                            return pendingMessage.delete();
                                        })
                                        .then(() => {
                                            // Reset the pending message ID
                                            latestTodoList.pendingMessageID = null;
                                            interaction.client.todolistdatabase.set('todoLists', todoLists);
                                        })
                                        .catch((error) => {
                                            console.error('Error deleting pending message:', error);
                                        });
                                } else {
                                    console.error('Channel not found.');
                                }
                            }
                    
                            // Send follow-up message
                            interaction.followUp({
                                content: 'Confirmation timed out. Task was saved to the database.\nRun the command again to send the list.',
                                ephemeral: true,
                            });
                        }
                    }); 
                }
            }                        

        } else if (sub === 'add') {
            const taskId = interaction.options.getNumber('task-id');
            const category = interaction.options.getString('category') || 'undone'; // Default to 'undone' if no category is provided
            const taskDescription = interaction.options.getString('task');
        
            // Retrieve the todo lists
            let todoLists = interaction.client.todolistdatabase.get('todoLists') || [];
            const latestTodoList = todoLists[todoLists.length - 1];
        
            if (taskId === null) {
                // Append a new task
                const lastTaskId = latestTodoList.tasks.length > 0 
                    ? Math.max(...latestTodoList.tasks.map(task => task.id)) 
                    : 0;
                const newTaskId = lastTaskId + 1;
        
                const newTask = {
                    id: newTaskId,
                    description: taskDescription,
                    category: category,
                    assignedTo: null,
                    UserID: null,
                    status: 'pending',
                };
        
                // Add the new task to the tasks array
                latestTodoList.tasks.push(newTask);
                interaction.client.todolistdatabase.set('todoLists', todoLists);
        
                // Generate the new message content
                const updatedMessageContent = buildTodoListMessage(latestTodoList, emojiMappings, descriptionMappings, orderedCategories);
                
                // Get the messageID
                const messageID = latestTodoList.messageID;
        
                // Attempt to edit the previous message if it exists
                if (messageID) {
                    try {
                        const channel = await interaction.guild.channels.fetch(targetChannel.id); // Fetch the target channel
                        const sentMessage = await channel.messages.fetch(messageID); // Fetch the previous message
                        
                        await sentMessage.edit(updatedMessageContent);
                        
                    } catch (error) {
                        console.error('Error editing the message:', error);
                        await interaction.followUp({
                            content: 'There was an error updating the to-do list. Please try again later.',
                            ephemeral: true,
                        });
                    }
                } else {
                    await interaction.followUp({
                        content: 'No previous message found to update.',
                        ephemeral: true,
                    });
                }

                const newTaskMessage = `New task ${taskDescription} has been added.`;
                
                await interaction.followUp({
                    content: newTaskMessage,
                    ephemeral: true,
                });
            } else {
                // Add a subtask to the parent task if taskId matches an existing task
                const task = latestTodoList.tasks.find(task => task.id === taskId);
        
                if (!task) {
                    return interaction.followUp({
                        content: `Enter a valid task id to add a subtask or leave blank to add a new main task`,
                        ephemeral: true,
                    });
                }
        
                // Initialize the subtasks array if it doesn't exist
                if (!task.subtasks) {
                    task.subtasks = [];
                }
        
                // Create a new subtask ID (based on the number of existing subtasks)
                const newSubtaskId = parseFloat(`${taskId}.${task.subtasks.length + 1}`);
        
                const newSubtask = {
                    subid: newSubtaskId,
                    description: taskDescription,
                    category: task.category,
                    assignedTo: null,
                    UserID: null,
                    status: 'pending',
                };
        
                // Add the new subtask to the parent's subtasks array
                task.subtasks.push(newSubtask);
                
                // Update the todo lists in the database
                interaction.client.todolistdatabase.set('todoLists', todoLists);
                
                // Generate the new message content
                const updatedMessageContent = buildTodoListMessage(latestTodoList, emojiMappings, descriptionMappings, orderedCategories);
        
                // Get the messageID
                const messageID = latestTodoList.messageID;
        
                // Attempt to edit the previous message if it exists
                if (messageID) {

                    const channel = await interaction.guild.channels.fetch(targetChannel.id); // Fetch the target channel
                    const sentMessage = await channel.messages.fetch(messageID); // Fetch the previous message
                    
                    await sentMessage.edit(updatedMessageContent); // Edit the message with the new content

                    const subMessage = `Subtask ${newSubtaskId} ${taskDescription} has been added to task #${taskId}.`
                    await interaction.followUp({
                        content: subMessage,
                        ephemeral: true,
                    });

                } else {
                    await interaction.followUp({
                        content: 'To-do list was not sent. Send the list to see the changes.',
                        ephemeral: true,
                    });
                }

            }
        } else if (sub === 'remove') {
            const taskId = interaction.options.getNumber('task-id');
            
            let todoLists = interaction.client.todolistdatabase.get('todoLists') || [];
            const latestTodoList = todoLists[todoLists.length - 1];
            
            // Extract the main task ID and subtask ID
            const mainTaskId = Math.floor(taskId); // Get the integer part for the main task
            const subtaskId = taskId; // Keep subtaskId as a floating-point number
        
            // Check for subtask first
            let parentTask = latestTodoList.tasks.find(task => 
                task.subtasks && task.subtasks.some(subtask => subtask.subid === subtaskId)
            );
        
            if (parentTask) {
                const subtaskIndex = parentTask.subtasks.findIndex(subtask => subtask.subid === subtaskId);
                if (subtaskIndex !== -1) {
                    // Remove the subtask
                    const subtaskDescription = parentTask.subtasks[subtaskIndex].description; // Store the description before removal
                    parentTask.subtasks.splice(subtaskIndex, 1); // Remove the subtask
        
                    // Update subtask IDs for the parent task
                    parentTask.subtasks.forEach((subtask, index) => {
                        subtask.subid = parseFloat(`${parentTask.id}.${index + 1}`); // Reassign subtask IDs
                    });
        
                    // Update the database
                    interaction.client.todolistdatabase.set('todoLists', todoLists);
                    
                    // Prepare the updated message content
                    const updatedMessageContent = buildTodoListMessage(latestTodoList, emojiMappings, descriptionMappings, orderedCategories);
                    const messageID = latestTodoList.messageID;
                    const targetChannel = interaction.guild.channels.cache.get(interaction.channelId);
        
                    if (targetChannel && messageID) {
                        const messageToEdit = await targetChannel.messages.fetch(messageID).catch(err => {
                            console.error(`Failed to fetch message: ${err}`);
                        });
        
                        if (messageToEdit) {
                            await messageToEdit.edit({ content: updatedMessageContent });
        
                            return await interaction.followUp({
                                content: `Subtask "${subtaskDescription}" has been removed from task "${parentTask.description}".`,
                                components:[],
                                ephemeral: true,
                            });
                        } else {
                            console.error('Message to edit not found.');
                        }
                    }
                } else {
                    return interaction.followUp({
                		content: `Task or subtask with ID ${taskId} not found.`,
                		ephemeral: true,
            		});
                }
            } else {
                // If the subtask is not found, check if it's a parent task
                let taskIndex = latestTodoList.tasks.findIndex(task => task.id === mainTaskId);
                
                // If the task is found as a parent task
                if (taskIndex !== -1) {
                    const taskDescription = latestTodoList.tasks[taskIndex].description; // Store the description before removal
                    latestTodoList.tasks.splice(taskIndex, 1); // Remove the parent task
        
                    // Update the task IDs after filtering
                    latestTodoList.tasks.forEach((task, index) => {
                        task.id = index + 1; // Reassign task IDs
                    });
        
                    // Update the database
                    interaction.client.todolistdatabase.set('todoLists', todoLists);
                    
                    // Prepare the updated message content
                    const updatedMessageContent = buildTodoListMessage(latestTodoList, emojiMappings, descriptionMappings, orderedCategories);
                    const messageID = latestTodoList.messageID;
                    const targetChannel = interaction.guild.channels.cache.get(interaction.channelId);
        
                    if (targetChannel && messageID) {
                        const messageToEdit = await targetChannel.messages.fetch(messageID).catch(err => {
                            console.error(`Failed to fetch message: ${err}`);
                        });
        
                        if (messageToEdit) {
                            await messageToEdit.edit({ content: updatedMessageContent });
        
                            return interaction.followUp({
                                content: `Task "${taskDescription}" and all its subtasks have been removed from the list.`,
                                ephemeral: true,
                            });
                        } else {
                            console.error('Message to edit not found.');
                        }
                    }
                } else {
                    return interaction.followUp({
                		content: `Task or subtask with ID ${taskId} not found.`,
                		ephemeral: true,
            		});
                }
            }

        } else if (sub === 'edit') {
            const taskId = interaction.options.getNumber('task-id');
            const newTaskDescription = interaction.options.getString('new-task');
            const newCategory = interaction.options.getString('category'); // Get the new category if provided
            const newSlot = interaction.options.getNumber('slot'); // Get the new slot if provided
        
            let todoLists = interaction.client.todolistdatabase.get('todoLists') || [];
            const latestTodoList = todoLists[todoLists.length - 1];
        
            let taskIndex = -1;
            let parentTask = null;
            let subtaskIndex = -1;
            let isSubtask = false;
        
            // Check if taskId is a floating-point number to identify it as a subtask
            if (Number.isInteger(taskId)) {
                // Find the main task by ID
                taskIndex = latestTodoList.tasks.findIndex(task => task.id === taskId);
            } else {
                // It's a subtask, so search for it inside the subtasks of all tasks
                parentTask = latestTodoList.tasks.find(task => task.subtasks && task.subtasks.some(subtask => subtask.subid === taskId));
                if (parentTask) {
                    subtaskIndex = parentTask.subtasks.findIndex(subtask => subtask.subid === taskId);
                    isSubtask = true;
                }
            }
        
            if (taskIndex === -1 && subtaskIndex === -1) {
                return await interaction.followUp({
                    content: `Task or subtask with ID ${taskId} not found.`,
                    ephemeral: true
                });
            }
        
            if (isSubtask) {
                // Edit the subtask
                const subtask = parentTask.subtasks[subtaskIndex];
        
                // Update the subtask description if provided
                if (newTaskDescription) {
                    subtask.description = newTaskDescription;
                }
        
                // Update the subtask category if provided
                if (newCategory) {
                    subtask.category = newCategory;
                }
        
                // If a new slot is provided, rearrange the subtask
                if (newSlot !== null) {
                    const newSubtaskSlotIndex = newSlot - 1;
        
                    // Ensure the new slot is within the valid range
                    if (newSubtaskSlotIndex < 0 || newSubtaskSlotIndex >= parentTask.subtasks.length) {
                        return await interaction.followUp({
                            content: `Invalid subtask slot number. Please choose a number between 1 and ${parentTask.subtasks.length}.`,
                            ephemeral: true
                        });
                    }
        
                    // Move the subtask to the new slot
                    parentTask.subtasks.splice(subtaskIndex, 1); // Remove the subtask from its current position
                    parentTask.subtasks.splice(newSubtaskSlotIndex, 0, subtask); // Insert subtask at the new position
        
                    // Reassign subtask IDs
                    parentTask.subtasks.forEach((subtask, index) => {
                        subtask.subid = parseFloat(`${parentTask.id}.${index + 1}`);
                    });
                }
        
            } else {
                // Edit the main task
                const task = latestTodoList.tasks[taskIndex];
        
                // Update the task description if a new one is provided
                if (newTaskDescription) {
                    task.description = newTaskDescription;
                }
        
                // Update the task category if a new one is provided
                if (newCategory) {
                    task.category = newCategory;
                }
        
                // If a new slot is provided, rearrange the task
                if (newSlot !== null) {
                    const newSlotIndex = newSlot - 1; // Convert to 0-based index
        
                    // Ensure the new slot is within the valid range
                    if (newSlotIndex < 0 || newSlotIndex >= latestTodoList.tasks.length) {
                        return await interaction.followUp({
                            content: `Invalid slot number. Please choose a number between 1 and ${latestTodoList.tasks.length}.`,
                            ephemeral: true
                        });
                    }
        
                    // Move the task to the new slot
                    latestTodoList.tasks.splice(taskIndex, 1); // Remove task from its current position
                    latestTodoList.tasks.splice(newSlotIndex, 0, task); // Insert task at the new position
        
                    // Reassign task IDs for all tasks
                    latestTodoList.tasks.forEach((task, index) => {
                        task.id = index + 1;
                        // Reassign subtask IDs for each task
                        task.subtasks.forEach((subtask, subIndex) => {
                            subtask.subid = parseFloat(`${task.id}.${subIndex + 1}`);
                        });
                    });
                }
            }
        
            // Save the updated to-do list
            interaction.client.todolistdatabase.set('todoLists', todoLists);
        
            // Call the function to update the to-do list message
            await updateTodoListMessage(latestTodoList, emojiMappings, descriptionMappings, orderedCategories, interaction);
        
            // Prepare the response message
            let response = `Task with ID ${taskId} has been updated.`;
            if (newTaskDescription) response += ` New description: **${newTaskDescription}**.`;
            if (newCategory) response += ` New category: **${newCategory}**.`;
            if (newSlot !== null) response += isSubtask ? ` Subtask has been moved to position ${newSlot}.` : ` Task has been moved to position ${newSlot}.`;
        
            await interaction.followUp({
                content: response,
                ephemeral: true
            });

        } else if (sub === 'claim') {
            const taskId = interaction.options.getNumber('task-id');
            const userId = interaction.user.id;
        
            let todoLists = interaction.client.todolistdatabase.get('todoLists') || [];
            const latestTodoList = todoLists[todoLists.length - 1];
        
            // Extract the main task ID and subtask ID
            const mainTaskId = Math.floor(taskId); // Get the integer part for the main task
            const subtaskId = taskId; // Keep subtaskId as a floating-point number
        
            // Search for the main task
            const mainTask = latestTodoList.tasks.find(task => task.id === mainTaskId);
        
            // Search for the subtask if the main task exists
            const subtask = mainTask ? 
                (mainTask.subtasks || []).find(subtask => subtask.subid === subtaskId) : null;
        
            // Check if either a main task or a subtask is found
            if (!mainTask && !subtask) {
                return interaction.followUp({
                    content: `Task with ID ${taskId} not found.`,
                    ephemeral: true,
                });
            }
        
            // Prioritize claiming the subtask first
            const claimedTask = subtask || mainTask; // Claim the subtask if available
        
            // Ensure claimedTask is defined before accessing its properties
            if (!claimedTask) {
                return interaction.followUp({
                    content: `Could not find task or subtask with ID ${taskId}.`,
                    ephemeral: true,
                });
            }
        
            // Check if the task's category is 'admin' and prevent claiming it
            if (claimedTask.category === 'admin' && interaction.member.permissions.has("Administrator") == false) {
                return interaction.followUp({
                    content: `You cannot claim a task that belongs to the 'Admin' category.`,
                    ephemeral: true,
                });
            }
        
            if (claimedTask.category === 'dee' && !interaction.user.id === '271078843786330114') {
                return interaction.followUp({
                    content: `You cannot claim a task that belongs to Dee.`,
                    ephemeral: true,
                });
            }
        
            // Check if the task has already been claimed
            if (claimedTask.assignedTo) {
                return interaction.followUp({
                    content: `This task has already been claimed by ${claimedTask.assignedTo}.`,
                    ephemeral: true,
                });
            }
        
            // Fetch the user's member object and get their nickname
            const member = interaction.guild.members.cache.get(userId);
            let nickname = member ? (member.nickname || member.user.username) : interaction.user.username;
        
            // If the nickname contains '|', split and use the first part; otherwise, use the full nickname
            if (nickname.includes('|')) {
                nickname = nickname.split('|')[0].trim(); // Take everything before '|' and trim any extra spaces
            }
        
            // Claim the task
            claimedTask.assignedTo = nickname; // Store the part of the nickname
            claimedTask.UserID = userId; // Store the user ID
        
            // Save the updated task list to the database
            interaction.client.todolistdatabase.set('todoLists', todoLists);
        
            // Update the to-do list message
            await updateTodoListMessage(latestTodoList, emojiMappings, descriptionMappings, orderedCategories, interaction);
        
            // Confirm to the user that they have claimed the task
            await interaction.followUp({
                content: `You have claimed ${subtask ? `subtask ${subtaskId}` : `task ${mainTaskId}`}.`,
                ephemeral: true,
            });

        } else if (sub === 'transfer') {
            const taskId = interaction.options.getNumber('task-id');
            const newUser = interaction.options.getUser('user'); // Get the new user object
            
            let todoLists = interaction.client.todolistdatabase.get('todoLists') || [];
            const latestTodoList = todoLists[todoLists.length - 1];
        
            // Extract main task ID and subtask ID
            const mainTaskId = Math.floor(taskId); // Get the integer part for the main task
            const subtaskId = taskId; // Keep subtaskId as a floating-point number
        
            // Search for the main task
            const mainTask = latestTodoList.tasks.find(task => task.id === mainTaskId);
        
            // Search for the subtask if the main task exists
            const subtask = mainTask ? 
                (mainTask.subtasks || []).find(subtask => subtask.subid === subtaskId) : null;
        
            // Check if either a main task or a subtask is found
            if (!mainTask && !subtask) {
                return interaction.followUp({
                    content: `Task with ID ${taskId} not found.`,
                    ephemeral: true,
                });
            }
        
            // Prioritize transferring the subtask first
            const taskToTransfer = subtask || mainTask;
        
            // Check if the new user is valid
            if (!newUser) {
                
                // Check if the task (or subtask) has been claimed
                if (!taskToTransfer.UserID) {
                    return interaction.followUp({
                        content: `This task has not been claimed yet.`,
                        ephemeral: true,
                    });
                }
            
                // Ensure the current user is authorized to unclaim the task (or subtask)
                if (taskToTransfer.UserID !== interaction.user.id && interaction.member.permissions.has("Administrator") == false) {
                    return interaction.followUp({
                        content: `You cannot unclaim this task because you are not the one who claimed it.`,
                        ephemeral: true,
                    });
                }
                
                taskToTransfer.assignedTo = null; // Unclaim the task
                taskToTransfer.UserID = null; // Remove the UserID as well
                interaction.client.todolistdatabase.set('todoLists', todoLists);
        
                // Build the updated task list string to reflect the unassignment
                const message = buildTodoListMessage(latestTodoList, emojiMappings, descriptionMappings, orderedCategories);
        
                // Get the message ID from the latest to-do list
                const messageID = latestTodoList.messageID;
        
                if (targetChannel && messageID) {
                    const messageToEdit = await targetChannel.messages.fetch(messageID).catch(err => {
                        console.error(`Failed to fetch message: ${err}`);
                    });
        
                    if (messageToEdit) {
                        await messageToEdit.edit({ content: message });
                    } else {
                        console.error('Message to edit not found.');
                    }
                }
        
                return interaction.followUp({
                    content: `You have unclaimed this task.`,
                    ephemeral: true,
                });
            }
        
            // Check if the task (or subtask) has been claimed
            if (!taskToTransfer.UserID) {
                return interaction.followUp({
                    content: `This task has not been claimed yet.`,
                    ephemeral: true,
                });
            }
        
            // Ensure the current user is authorized to transfer the task (or subtask)
            if (taskToTransfer.UserID !== interaction.user.id && interaction.member.permissions.has("Administrator") == false) {
                return interaction.followUp({
                    content: `You are not authorized to transfer this task because you are not the one who claimed it.`,
                    ephemeral: true,
                });
            }
        
            // Fetch the new user's member object and get their nickname
            const newMember = interaction.guild.members.cache.get(newUser.id);
            let newNickname = newMember ? (newMember.nickname || newMember.user.username) : newUser.username;
        
            // If the nickname contains '|', split and use the first part; otherwise, use the full nickname
            if (newNickname.includes('|')) {
                newNickname = newNickname.split('|')[0].trim(); // Take everything before '|' and trim any extra spaces
            }
        
            // Transfer the task (or subtask) to the new user's nickname and ID
            taskToTransfer.assignedTo = newNickname;
            taskToTransfer.UserID = newUser.id;
            interaction.client.todolistdatabase.set('todoLists', todoLists);
        
            // Build the updated task list string
            const message = buildTodoListMessage(latestTodoList, emojiMappings, descriptionMappings, orderedCategories);
        
            // Get the message ID from the latest to-do list
            const messageID = latestTodoList.messageID;
        
            if (targetChannel && messageID) {
                const messageToEdit = await targetChannel.messages.fetch(messageID).catch(err => {
                    console.error(`Failed to fetch message: ${err}`);
                });
        
                if (messageToEdit) {
                    await messageToEdit.edit({ content: message });
                } else {
                    console.error('Message to edit not found.');
                }
            }
        
            await interaction.followUp({
                content: `Task with ID ${taskId} has been transferred to ${newNickname}.`,
                ephemeral: true,
            });

        } else if (sub === 'complete') {
            const taskId = interaction.options.getNumber('task-id');
        
            let todoLists = interaction.client.todolistdatabase.get('todoLists') || [];
            const latestTodoList = todoLists[todoLists.length - 1];
        
            // First, look for the subtask directly
            let taskToComplete = latestTodoList.tasks
                .flatMap(task => task.subtasks || []) // Get all subtasks from all main tasks
                .find(subtask => subtask.subid === taskId); // Find the subtask
        
            // If no subtask is found, check if the task ID corresponds to a main task
            let mainTask;
            if (!taskToComplete) {
                mainTask = latestTodoList.tasks.find(task => task.id === taskId); // Check for main task
                if (mainTask) {
                    // Check if there are any uncompleted subtasks
                    const uncompletedSubtasks = mainTask.subtasks?.filter(subtask => subtask.status !== 'completed') || [];
                    if (uncompletedSubtasks.length > 0) {
                        return interaction.followUp({
                            content: `You cannot complete this main task because there are uncompleted subtasks.`,
                            ephemeral: true
                        });
                    }

                    // If all subtasks are completed, proceed to mark the main task as complete
                    taskToComplete = mainTask;
                }
            }
        
            // Check if the task (main task or subtask) is found
            if (!taskToComplete) {
                return interaction.followUp({
                    content: `Task with ID ${taskId} not found.`,
                    ephemeral: true
                });
            }
        
            // Check if the task has been claimed
            if (!taskToComplete.assignedTo) {
                return interaction.followUp({
                    content: `This task has not been claimed yet. You cannot mark an unclaimed task as completed.`,
                    ephemeral: true
                });
            }
        
            // Check if the user is the one who claimed the task
            if (taskToComplete.UserID !== interaction.user.id && interaction.member.permissions.has("Administrator") == false) {
                return interaction.followUp({
                    content: `You cannot complete this task because you are not the one who claimed it.`,
                    ephemeral: true
                });
            }
        
            // Mark the task (main task or subtask) as complete
            taskToComplete.status = 'completed';
        
            // Save the updated to-do list
            interaction.client.todolistdatabase.set('todoLists', todoLists);
        
            // Build the updated task list string
            const message = buildTodoListMessage(latestTodoList, emojiMappings, descriptionMappings, orderedCategories);
        
            // Get the message ID from the latest to-do list
            const messageID = latestTodoList.messageID;
        
            if (targetChannel && messageID) {
                const messageToEdit = await targetChannel.messages.fetch(messageID).catch(err => {
                    console.error(`Failed to fetch message: ${err}`);
                });
        
                if (messageToEdit) {
                    await messageToEdit.edit({ content: message });
                } else {
                    console.error('Message to edit not found.');
                }
            }
        
            // Send confirmation to the user
            await interaction.followUp({
                content: `Task with ID ${taskId} has been marked as complete.`,
                ephemeral: true
            });
        }          
    }
}

function buildTodoListMessage(latestTodoList, emojiMappings, descriptionMappings, orderedCategories) {
    // Validate latestTodoList
    if (!latestTodoList || !Array.isArray(latestTodoList.tasks)) {
        console.error('Invalid latestTodoList:', latestTodoList);
        return 'Invalid to-do list.';
    }

    // Validate emojiMappings
    if (!emojiMappings || typeof emojiMappings !== 'object') {
        console.error('Invalid emojiMappings:', emojiMappings);
        return 'Invalid emoji mappings.';
    }

    // Validate descriptionMappings
    if (!descriptionMappings || typeof descriptionMappings !== 'object') {
        console.error('Invalid descriptionMappings:', descriptionMappings);
        return 'Invalid description mappings.';
    }

    // Build the task list
    const taskList = latestTodoList.tasks.map(task => {
        // Determine the emoji for the main task
    
        const emoji = task.status === 'completed'
            ? emojiMappings['completed']
            : emojiMappings[task.category] || '⭕';

        const taskDescription = task.status === 'completed'
            ? `~~${task.description}~~`
            : task.description;
    
        // Build the main task string with the emoji on one line and the task description on the next
        let taskString = `${task.id}. ${emoji} ${taskDescription}\n-# [ID: ${task.id}] Claimed by: ${task.assignedTo ? `${task.assignedTo}` : 'Nobody'}`;
    
        // Check for subtasks and append them to the taskString
        if (task.subtasks && task.subtasks.length > 0) {
            const subtaskStrings = task.subtasks.map(subtask => {
                // Determine the emoji for the subtask
                const subtaskEmoji = subtask.status === 'completed'
                    ? emojiMappings['completed'] : emojiMappings[subtask.category] || '⭕';

                const subtaskDescription = subtask.status === 'completed'
                    ? `~~${subtask.description}~~` : subtask.description;
    
                return `> ${subtaskEmoji} ${subtaskDescription}\n> -# [ID: ${subtask.subid}] Claimed by: ${subtask.assignedTo ? `${subtask.assignedTo}` : 'Nobody'}`;
            }).join('\n');
            taskString += `\n${subtaskStrings}`; // Append subtasks to the main task string
        }
    
        return taskString;
    }).join('\n');
    
    const startDate = latestTodoList.startDate; // Assuming startDate is part of the list
    const endDate = latestTodoList.endDate;     // Assuming endDate is part of the list

    // Get the categories present in the tasks
    const taskCategories = new Set();

    // Build the task categories and check for completed tasks and subtasks
    latestTodoList.tasks.forEach(task => {
        taskCategories.add(task.category);

        // Add 'completed' category if the main task is completed
        if (task.status === 'completed') {
            taskCategories.add('completed');
        }

        // Check subtasks if they exist
        if (task.subtasks && Array.isArray(task.subtasks)) {
            task.subtasks.forEach(subtask => {
                taskCategories.add(subtask.category);

                // Add 'completed' category if the subtask is completed
                if (subtask.status === 'completed') {
                    taskCategories.add('completed');
                }
            });
        }
    });

    // Build the legend dynamically based on the task categories in the specified order
    let legend = '-# __LEGEND__\n';
    for (const category of orderedCategories) {
        if (taskCategories.has(category) && emojiMappings[category]) {
            // Add both emoji and description to the legend
            legend += `-# ${emojiMappings[category]} ${descriptionMappings[category] || ''}\n`;
        }
    }

    // Build the final message
    const message = `**Weekly Team To-Do List**\n${startDate}-${endDate}\n-# Listed in order of priority. Feel free to claim one by using the command \`/to-do claim [task-id]\`\n-# Once you have completed a task, please use \`/to-do complete [task-id]\`.\n\n${taskList}\n\n${legend}`;

    return message;
}

async function updateTodoListMessage(latestTodoList, emojiMappings, descriptionMappings, orderedCategories, interaction) {
    // Build the updated task list string
    const message = buildTodoListMessage(latestTodoList, emojiMappings, descriptionMappings, orderedCategories);

    // Get the message ID from the latest to-do list
    const messageID = latestTodoList.messageID;

    // Edit the message in the channel with the new task list
    const targetChannel = interaction.guild.channels.cache.get('1267959208465399980'); //Change in final code

    if (targetChannel && messageID) {
        const messageToEdit = await targetChannel.messages.fetch(messageID).catch(err => {
            console.error(`Failed to fetch message: ${err}`);
        });

        if (messageToEdit) {
            if (message.length > 2000) {
                console.error('Message exceeds 2000 characters limit.');
                await interaction.followUp({ content: "This task has been marked in the database.\nHowever the message is too long to edit so please let everyone know what you had marked.", ephemeral: true });
                return;
            }
            await messageToEdit.edit({ content: message });
        } else {
            console.error('Message to edit not found.');
        }
    }
}