const { ApplicationCommandOptionType, EmbedBuilder, ButtonStyle, ButtonBuilder, ButtonInteraction, ButtonComponent, ActionRowBuilder, ComponentType, ChannelType, ThreadAutoArchiveDuration, StringSelectMenuBuilder } = require("discord.js");
const { ephemeral } = require('@root/src/structures/BaseContext');
const { config } = require("dotenv");
const { getUser } = require("@schemas/User");
const color = require("@root/config").EMBED_COLORS.BOT_EMBED

const pingOptions = [
  {label: 'What\'s the Buzz?', value: '1267959041687027765'},
  {label: 'A Day Off', value: '1267959089171005633'},
  {label: 'Schedule', value: '1267959053108383765'},
  {label: 'Roleplayer', value: '1269679477919715350'},
  {label: 'None', value: 'none'},
]

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
    name: "special",
    description: "Manage events for the server",
    category: "BLOXBURG",
    botPermissions: ["EmbedLinks"],
    command: {
        enabled: false,
    },
    // Slash command configuration
    slashCommand: {
      enabled: true,
      ephemeral: true,
      options: [
        {
          name: "announce",
          description: "Announce a new event",
          type: 1, // Subcommand type
          options: [
            {
              name: "title",
              description: "What is the title of the event?",
              type: ApplicationCommandOptionType.String,
              required: true,
            },
            {
              name: 'description',
              description: "Describe the event",
              type: ApplicationCommandOptionType.String,
              required: true,
            },
            {
              name: "start-time",
              description: "Input the hammertime code when the shift will start, choose the very last option.",
              type: ApplicationCommandOptionType.String,
              required: true,
             },
             {
               name: "image",
               description: "Provide an image for the event",
               type: ApplicationCommandOptionType.Attachment,
               required: false,
             },
          ]
        },
        {
          name: 'edit',
          description: 'Edit an event',
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: 'event-num',
              description: 'Your provided event number (Press tab to view options)',
              type: ApplicationCommandOptionType.Number,
              required: true,
            },
            {
              name: "new-host",
              description: "Choose a new host",
              type: 6,
              required: false,
            },
            {
              name: 'new-title',
              description: 'Change the title of your event',
              type: ApplicationCommandOptionType.String,
              required: false,
            },
            {
              name: 'new-description',
              description: 'Change the description of your event',
              type: ApplicationCommandOptionType.String,
              required: false,
            },
            {
              name: 'new-time',
              description: 'Change the time of your event',
              type: ApplicationCommandOptionType.String,
              required: false,
            },
            {
              name: 'new-image',
              description: 'Change the image of your event',
              type: ApplicationCommandOptionType.Attachment,
              required: false,
            }
          ]
        },
        {
          name: 'end',
          description: 'End or cancel a planned event',
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: 'event-num',
              description: 'Your provided event number',
              type: ApplicationCommandOptionType.Number,
              required: true,
              autocomplete: true
            }
          ]
        },
        {
            name: 'start',
            description: 'Start the planned event',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'event-num',
                    description: 'Your provided event number',
                    type: ApplicationCommandOptionType.Number,
                    required: true,
                }
            ]
        }
      ]
    },
  
    async interactionRun(interaction) {
      const client = interaction.client
      const subCommand = interaction.options.getSubcommand();

      const allowedRoles = ['1273393774780874793', '1267958988126027848', '1267736435323306026']; //Boss & Admin

      const hasRole = interaction.member.roles.cache.some(role => allowedRoles.includes(role.id));

      if (!hasRole) {
            return interaction.followUp({
                content: `You do not have the required role to use this command.`,
                ephemeral: true,
            });
        }

      if (subCommand === 'announce') {
        const title = interaction.options.getString('title');
        const start = interaction.options.getString("start-time");
        const image = interaction.options.getAttachment("image");
        const desc = interaction.options.getString('description');
        
        const upcomingEvents = client.eventdatabase.get("upcomingEvents") || [];
        const twoHoursInMilliseconds = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
        
        const unixTimestamp = parseInt(start);
        const startTime = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
    
        // Check if the timestamp is valid
        if (isNaN(unixTimestamp) || unixTimestamp <= 0 || startTime.getTime() < Date.now()) {
            return interaction.followUp("Please provide a valid future Hammertime code.");
        }
    
        if (upcomingEvents.length > 0) {
            // Get the start time and host of the closest upcoming event
            const nextEvent = upcomingEvents[0]; // Assuming the events are sorted by start time
            const nextEventStartTime = nextEvent.startTime || 0; // Get the closest event start time
            const eventHost = nextEvent.hostId; // Get the host of the next event
    
            if (nextEventStartTime) {
                const currentTime = Date.now(); // Current time in milliseconds
                const timeUntilEvent = nextEventStartTime - currentTime; // Time until the next event
    
                // Check if the event is happening within 2 hours before or after
                if ((timeUntilEvent <= twoHoursInMilliseconds && timeUntilEvent > 0) || 
                    (timeUntilEvent >= -twoHoursInMilliseconds && timeUntilEvent < 0) && 
                    interaction.user.id !== eventHost) {
                    return interaction.followUp({
                        content: "There is a shift or special event happening soon in <#1267959202433732608>. Please plan your event for another time."
                    });
                }
            }
        }
    
        try {
            
            const pingSelectMenu = new StringSelectMenuBuilder()
                .setCustomId('pingSelect')
                .setPlaceholder('Select roles to ping')
                .addOptions(pingOptions)
                .setMinValues(1)
                .setMaxValues(pingOptions.length); 
        
            const row = new ActionRowBuilder().addComponents(pingSelectMenu);
        
            const roles = await interaction.followUp({ content: 'Please select roles to ping for the event:', components: [row], ephemeral: true });
        
            // Create a collector to handle the interaction
            const filter = i => i.customId === 'pingSelect' && i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });
        
            collector.on('collect', async i => {
                const selectedValues = i.values; // Get selected values
        
                const voiceChannelId = "1253027857173713060";
                const channelID = client.shiftdatabase.get("planAhead-"); // Plan-ahead channel ID
                const min = 100000; // Smallest 6-digit number
                const max = 999999; // Largest 6-digit number
                const eventNum = Math.floor(Math.random() * (max - min + 1)) + min;
        
                const eventDurationMinutes = 120;
                const endTime = new Date(startTime.getTime() + eventDurationMinutes * 60000);
        
                let imageUrl;

                if (image) {
                    imageUrl = image.url;
                }
        
                // Create the scheduled event
                interaction.guild.scheduledEvents.create({
                    name: title,
                    description: desc,
                    scheduledStartTime: startTime.toISOString(),
                    scheduledEndTime: endTime.toISOString(),
                    privacyLevel: 2, // GUILD_ONLY
                    entityType: 3, // Voice events
                    entityMetadata: {
                        channel_id: voiceChannelId,
                        location: "Bloxburg",
                    },
                    image: imageUrl,
                })
                .then((event) => {

                    const pingRoles = selectedValues.includes('none') ? '' : selectedValues.map(roleId => `<@&${roleId}>`).join(' ');

                    const eventDetails = {
                        startTime: startTime.getTime(), // Event start time in milliseconds
                        name: title,
                        hostId: interaction.user.id,
                        eventId: event.id,
                        type: "special",
                        eventNum: eventNum,
                        announcementMessageId: null,
                        initialMessageID: null,
                        pingRoles: pingRoles,
                    };
        
                    const upcomingEvents = client.eventdatabase.get("upcomingEvents") || [];
                    upcomingEvents.push(eventDetails);
                    upcomingEvents.sort((a, b) => a.startTime - b.startTime); // Sort events by start time
                    client.eventdatabase.set("upcomingEvents", upcomingEvents);

                    // Create confirmation message based on whether roles are pinged or not
                    const confirmationMessage = pingRoles
                    ? `These roles have been added to the announcement: ${pingRoles}\nSend announcement?`
                    : `No roles will be mentioned in the announcement.\nSend announcement?`;

                    const confirmationRow = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('confirmSend')
                                .setLabel('Yes')
                                .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                                .setCustomId('cancelSend')
                                .setLabel('No')
                                .setStyle(ButtonStyle.Danger)
                        );
        
                    i.update({ roles, content: confirmationMessage, components: [confirmationRow], ephemeral: true });
        
                    // Handle button interactions
                    const buttonFilter = buttonInteraction => {
                        return buttonInteraction.customId === 'confirmSend' || buttonInteraction.customId === 'cancelSend';
                    };
        
                    const buttonCollector = interaction.channel.createMessageComponentCollector({ filter: buttonFilter, time: 15000 }); // 15 seconds for button response
        
                    buttonCollector.on('collect', async buttonInteraction => {
                        if (buttonInteraction.customId === 'confirmSend') {
                            // Define the announcement message with optional ping
                            const announcementMessage = `
${pingRoles}
## ${title} 🎈
### Host: <@${interaction.user.id}>
Join us for this special event! Check <#1267959203486502963> for details!

https://discord.com/events/${interaction.guild.id}/${event.id}

<:BEEwarn:1268469054931210291> Starting a shift within 2 hours of this scheduled session or event will result in demotion!
-# Event Number to edit or cancel event: \`${eventNum}\``;
        
                            interaction.guild.channels.fetch(channelID)
                                .then(async (announcementChannel) => {
                                    const sentMessage = await announcementChannel.send(announcementMessage);
                                    const messageId = sentMessage.id;
                                    eventDetails.announcementMessageId = messageId;
        
                                    // Save the updated eventDetails with the message ID in the database
                                    client.eventdatabase.set("upcomingEvents", upcomingEvents);
        
                                    await sentMessage.react('🎈');
                                if (announcementChannel.type === ChannelType.GuildAnnouncement) {
                                    try {
                                        await sentMessage.crosspost();
                                    } catch (error) {
                                        console.error("Failed to crosspost announcement:", error);
                                    }
                                }
                                    buttonInteraction.update({ content: `Successfully created and sent the event announcement: **${event.name}** starting at **<t:${Math.floor(startTime.getTime() / 1000)}:F>**!\nEvent Number to edit or cancel: \`${eventNum}\``, components: []});
                                })
                                .catch((error) => {
                                    console.error("Error sending announcement:", error);
                                    buttonInteraction.reply({ content: "Error sending the announcement message.", ephemeral: true });
                                });
                        } else if (buttonInteraction.customId === 'cancelSend') {  
                            const index = upcomingEvents.findIndex(event => event.eventId === eventDetails.eventId);
                            if (index !== -1) {
                                upcomingEvents.splice(index, 1); // Remove the event
                                client.eventdatabase.set("upcomingEvents", upcomingEvents); // Update the database
                            }
                            await interaction.guild.scheduledEvents.delete(eventDetails.eventId);
                            buttonInteraction.update({ content: "Announcement has been canceled and event has been deleted.", components: [], ephemeral: true });
                        }
        
                        buttonCollector.stop();
                    });
        
                    buttonCollector.on('end', collected => {
                        if (collected.size === 0) {
                            const index = upcomingEvents.findIndex(event => event.eventId === eventDetails.eventId);
                            if (index !== -1) {
                                upcomingEvents.splice(index, 1); // Remove the event
                                client.eventdatabase.set("upcomingEvents", upcomingEvents); // Update the database
                            }
                            interaction.guild.scheduledEvents.delete(eventDetails.eventId);
                            interaction.followUp({ content: 'You did not respond to the confirmation in time.', ephemeral: true });
                        }
                    });
                })
                .catch((error) => {
                    console.error("Error creating event:", error);
                    interaction.followUp("There was an error creating the event. Please try again.");
                });
        
                collector.stop();
            });
        
            collector.on('end', async (collected) => {
                if (collected.size === 0) {
                    interaction.editReply({ content: 'You did not select any roles, so the event has been canceled.', components: [], ephemeral: true });    
                }
            });            
        
        } catch (error) {
            console.log("Unexpected error:", error);
            interaction.followUp("There was an unexpected error creating the event.");
        }        
    } else if (subCommand === 'edit') {
            const host = interaction.options.getUser("new-host");
            const title = interaction.options.getString('new-title');
            const start = interaction.options.getString("new-time");
            const image = interaction.options.getAttachment("new-image");
            const desc = interaction.options.getString('new-description');
            const eventNum = interaction.options.getNumber('event-num');
            const upcomingEvents = client.eventdatabase.get("upcomingEvents") || [];
            const twoHoursInMilliseconds = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

            const unixTimestamp = start ? parseInt(start) : null;
            const startTime = unixTimestamp ? new Date(unixTimestamp * 1000) : null; // Convert seconds to milliseconds

            // Check if the timestamp is valid
            if (startTime && (isNaN(unixTimestamp) || unixTimestamp <= 0 || startTime.getTime() < Date.now())) {
                return interaction.followUp("Please provide a valid future Hammertime code.");
            }

            if (upcomingEvents.length > 0) {
                // Filter out the current event being edited
                const otherEvents = upcomingEvents.filter(event => event.eventNum !== eventNum);

                const conflictEvent = otherEvents.find(event => {
                    const eventStartTime = new Date(event.startTime).getTime();
                    return Math.abs(startTime - eventStartTime) < twoHoursInMilliseconds;
                });

                // If a conflicting event is found, prevent scheduling
                if (conflictEvent) {
                    return interaction.followUp({
                        content: `Another event is happening within 2 hours of this event. Please plan your event or shift for another time.`
                    });
                }
            }

            // Event duration in minutes
            const eventDurationMinutes = 120;
            const endTime = startTime ? new Date(startTime.getTime() + eventDurationMinutes * 60000) : null;

            // Find the event with the matching eventNum
            const matchingEvent = upcomingEvents.find(event => event.eventNum === eventNum);

            if (matchingEvent) {
                if (matchingEvent.hostId === interaction.member.id || interaction.member.permissions.has('Administrator')) {
                    const voiceChannelId = "1253027857173713060";
                    const channelID = client.shiftdatabase.get("planAhead-");

                    const updatedEvent = await interaction.guild.scheduledEvents.edit(matchingEvent.eventId, {
                        name: title || matchingEvent.name,
                        description: desc || matchingEvent.description,
                        scheduledStartTime: startTime ? startTime.toISOString() : new Date(matchingEvent.startTime).toISOString(),
                        scheduledEndTime: endTime ? endTime.toISOString() : matchingEvent.scheduledEndTime,
                        image: image ? image.url : matchingEvent.image,
                        privacyLevel: 2, // GUILD_ONLY
                        entityType: 3, // Voice event
                        entityMetadata: {
                            channel_id: voiceChannelId,
                            location: "Speaker Box",
                        },
                    });

                    if (host) {
                      matchingEvent.hostId = host.id;
                   }
                    // Update the event details in the database
                    matchingEvent.startTime = startTime ? startTime.getTime() : matchingEvent.startTime;
                    matchingEvent.eventId = updatedEvent.id;
                    matchingEvent.name = updatedEvent.name;

                    // Sort the upcomingEvents array from earliest to latest
                    upcomingEvents.sort((a, b) => a.startTime - b.startTime);
                    client.eventdatabase.set("upcomingEvents", upcomingEvents);

                    try {
                        // Fetch and edit the original announcement message
                        const announcementChannel = await interaction.guild.channels.fetch(channelID);
                        const announcementMessageId = matchingEvent.announcementMessageId; // Ensure this is stored when the event is created
                        const announcementMessage = await announcementChannel.messages.fetch(announcementMessageId);
                        const pingRoles = matchingEvent.pingRoles || '';
                        
                        // Construct the updated announcement message based on eventType
                        let updatedAnnouncementMessage;
                        if (matchingEvent.type === 'special') {
                            updatedAnnouncementMessage = `
${pingRoles || ''}
## ${updatedEvent.name} 🎈
### Host: <@${matchingEvent.hostId}>
Join us for this special event, check <#1267959203486502963> for details!

https://discord.com/events/${interaction.guild.id}/${updatedEvent.id}

<:BEEwarn:1268469054931210291> Starting a shift within 2 hours of this scheduled shift will result in demotion!
-# Event Number: \`${eventNum}\``;
                        } else if (matchingEvent.type === 'shift') {
                            updatedAnnouncementMessage = `
# <@&1267959041687027765>
## Shift: ${updatedEvent.name}
### Host: <@${matchingEvent.hostId}>
Respond to the shift if you're coming, and stay tuned to <#1267959203486502963> for the session start!

https://discord.com/events/${interaction.guild.id}/${updatedEvent.id}

<:BEEwarn:1268469054931210291> Starting a shift within 2 hours of this scheduled shift will result in demotion!
-# Event Number: \`${eventNum}\``;
                        }

                        // Update the announcement message
                        await announcementMessage.edit(updatedAnnouncementMessage);

                        await interaction.followUp({
                            content: `Successfully updated the event: **${updatedEvent.name}** starting at **<t:${start || matchingEvent.startTime / 1000}:F>**!\nEvent Number to edit or cancel: \`${eventNum}\``,
                            ephemeral: true
                        });
                    } catch (error) {
                        console.error("Error editing announcement:", error);
                        interaction.followUp("Error editing the announcement message.");
                    }
                } else {
                    await interaction.followUp({
                        content: `You are not the host of this event`
                    });
                }
            } else {
                await interaction.followUp({
                    content: `No events found with the number: ${eventNum}`
                });
            }
          } else if (subCommand === 'end') {
            
            const eventNum = interaction.options.getNumber('event-num');
            const upcomingEvents = client.eventdatabase.get("upcomingEvents") || [];
            
            // Find the event with the matching eventNum
            const matchingEvent = upcomingEvents.find(event => event.eventNum === eventNum);
        
            if (matchingEvent) {
                // Check if the user is the host of the matching event or an administrator
                if (matchingEvent.hostId === interaction.member.id || interaction.member.permissions.has('Administrator')) {
                    try {
                        const channelID = client.shiftdatabase.get("planAhead-"); // Plan-ahead channel
                        const channel = await interaction.guild.channels.fetch(channelID);
        
                        if (channel) {
                            // Fetch and delete the message using the announcementMessageId
                            const messageToDelete = await channel.messages.fetch(matchingEvent.announcementMessageId);
                            
                            if (messageToDelete) {
                                await messageToDelete.delete();
                                const channelID2 = client.shiftdatabase.get("channelID-");
                                const channel2 = await interaction.guild.channels.fetch(channelID2);

                                const initialMessageID = matchingEvent.initialMessageID;

                                if (!initialMessageID) {
                                    await interaction.followUp({ content: 'No start message found for this event.' });
                                } else {
                                    try {
                                        const messageToReply = await channel2.messages.fetch(initialMessageID);
                                
                                        if (messageToReply) {
                                            await messageToReply.reply({
                                                content: `The event ${matchingEvent.name} has concluded. Thank you to everyone who participated!`
                                            });
                                        } else {
                                            await interaction.followUp({ content: 'No initial message found for this event.' });
                                        }
                                    } catch (error) {
                                        // Handle errors in fetching the message
                                        console.error('Error fetching initial message:', error);
                                        await interaction.followUp({ content: 'There was an error fetching the initial message.' });
                                    }
                                }
        
                                // Remove the event from the upcomingEvents array
                                const index = upcomingEvents.indexOf(matchingEvent);
                                if (index > -1) {
                                    upcomingEvents.splice(index, 1);
                                }
        
                                // Update the database with the modified array
                                await interaction.client.eventdatabase.set("upcomingEvents", upcomingEvents);
        
                                // Delete the scheduled event from the guild
                                if (interaction.guild.scheduledEvents) {
                                    try {
                                        await interaction.guild.scheduledEvents.delete(matchingEvent.eventId);
                                    } catch (error) {
                                        await interaction.followUp({ content: 'There was an error deleting the scheduled event.' });
                                    }
                                }
        
                                await interaction.followUp({ content: 'The event and its message have been successfully deleted.' });
                            } else {
                                await interaction.followUp({ content: 'No message found related to this event.' });
                            }
                        } else {
                            await interaction.followUp({ content: 'The channel for this event could not be found.' });
                        }
                    } catch (error) {
                        const index = upcomingEvents.indexOf(matchingEvent);
                                if (index > -1) {
                                    upcomingEvents.splice(index, 1);
                                }
        
                                // Update the database with the modified array
                                await interaction.client.eventdatabase.set("upcomingEvents", upcomingEvents);
        
                                // Delete the scheduled event from the guild
                                if (interaction.guild.scheduledEvents) {
                                    try {
                                        await interaction.guild.scheduledEvents.delete(matchingEvent.eventId);
                                    } catch (error) {
                                        await interaction.followUp({ content: 'There was an error deleting the scheduled event.' });
                                    }
                                }
                        await interaction.followUp({ content: 'Event has been deleted.' });
                    }
                } else {
                    await interaction.followUp({ content: `You are not the host of this event` });
                }
            } else {
                await interaction.followUp({ content: `No events found with the number: ${eventNum}` });
            }
        } else if (subCommand === 'start') {
            const eventNum = interaction.options.getNumber('event-num');
            const channelId = client.shiftdatabase.get("channelID-");
            const targetChannel = interaction.guild.channels.cache.get(channelId);
            const upcomingEvents = client.eventdatabase.get("upcomingEvents") || [];

            function getCurrentTimeInGMT3() {
                const now = new Date();
                const utcTime = now.getTime();
                const gmtPlus3Offset = 3 * 60 * 60 * 1000;
                const gmtPlus3Time = new Date(utcTime + gmtPlus3Offset);
            
                const hours = gmtPlus3Time.getUTCHours();
                const minutes = gmtPlus3Time.getUTCMinutes();
            
                return { hours, minutes };
            }
            
            const currentTime = getCurrentTimeInGMT3();
            const currentHours = currentTime.hours;
            const currentMinutes = currentTime.minutes;
            const currentTimeInMinutes = currentHours * 60 + currentMinutes;
            
            const range1Start = 14 * 60;  // 2:00 PM in minutes
            const range1End = 23 * 60;    // 11:00 PM in minutes
            const range2Start = 23 * 60;  // 11:00 PM in minutes
            const range2End = 6 * 60;     // 6:00 AM in minutes
            const range3Start = 6 * 60;   // 6:00 AM in minutes
            const range3End = 14 * 60;    // 2:00 PM in minutes
            const coeptusID = client.shiftdatabase.get("coeptus-");
            const bloxyID = client.shiftdatabase.get("bloxy-");
            const riversideID = client.shiftdatabase.get("riverside-");
            let role;
            if (currentTimeInMinutes >= range1Start && currentTimeInMinutes < range1End) {
                role = coeptusID;
            } else if (currentTimeInMinutes >= range2Start || currentTimeInMinutes < range2End) {
                role = bloxyID;
            } else if (currentTimeInMinutes >= range3Start && currentTimeInMinutes < range3End) {
                role = riversideID;
            }
            const dominus = client.shiftdatabase.get("dominus-")
            const roleID = role;

            if (!targetChannel) {
                console.error("Failed to fetch target channel.");
                await interaction.followUp("Could not find the target channel.");
                return;
            }

            // Find the event that matches the event number
            const matchingEvent = upcomingEvents.find(event => event.eventNum === eventNum);

            if (matchingEvent) {
                // Check if the user is the host of the event
                if (matchingEvent.hostId === interaction.member.id) {
                    const dynamicTimestamp = Math.floor(matchingEvent.startTime / 1000);
            
                    // Create the initial announcement message
                    const messageContent = `
<@&${roleID}> <@&${dominus}>
# Join us for ${matchingEvent.name} with your host <@${matchingEvent.hostId}>!

-# Event Number: \`${matchingEvent.eventNum}\`
https://discord.com/events/${interaction.guild.id}/${matchingEvent.eventId}`;

                    try {
                        // Send the initial message and get its reference
                        const initialMessage = await targetChannel.send({ content: messageContent });
                        const initialMessageID = initialMessage.id;

                        // Save the initialMessageID into the event database
                        matchingEvent.initialMessageID = initialMessageID;
                        interaction.client.eventdatabase.set('upcomingEvents', upcomingEvents);
                        await interaction.followUp(`Event successfully announced!`);
            
                        // Calculate the current time and the delay duration for the follow-up message
                        const currentTime = Date.now();
                        const eventStartTime = matchingEvent.startTime;
                        const delayDuration = eventStartTime - currentTime;
            
                        // Schedule the follow-up message to reply to the initial message
                        if (delayDuration > 0) {
            
                            setTimeout(async () => {
                                try {
                                    // Fetch the event from Discord
                                    const guildScheduledEvent = await interaction.guild.scheduledEvents.fetch(matchingEvent.eventId);
            
                                    // Fetch users interested in the event at the time of follow-up
                                    let interestedUsers = [];
                                    try {
                                        const attendees = await guildScheduledEvent.fetchSubscribers();
                                        interestedUsers = attendees.map(user => `<@${user.user.id}>`);
                                    } catch (error) {
                                        console.error("Failed to fetch interested users:", error);
                                    }
            
                                    const interestedMention = interestedUsers.length > 0 ? interestedUsers.join(", ") : "No interested users at this time";
            
                                    // Prepare the follow-up message content
                                    const followUpMessageContent = `
# The event ${matchingEvent.name} is starting now!
Join your host <@${matchingEvent.hostId}> for the session!
**Attendees**: ${interestedMention}`;
            
                                    // Reply to the initial message
                                    await initialMessage.reply({ content: followUpMessageContent });
                                } catch (error) {
                                    console.error("Failed to send the follow-up reply:", error);
                                }
                            }, delayDuration);
                        } else {
                            console.log("The event start time has already passed. No follow-up message scheduled.");
                        }
                    } catch (error) {
                        console.error("Failed to send the initial message or schedule follow-up:", error);
                        await interaction.followUp("There was an error announcing the event.");
                    }
                } else {
                    await interaction.followUp("You are not the host of this event.");
                }
            } else {
                await interaction.followUp("Event not found.");
            }
        } 
    }
  };