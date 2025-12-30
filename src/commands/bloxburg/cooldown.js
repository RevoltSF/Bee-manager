const { SlashCommandBuilder } = require('@discordjs/builders');
const { ephemeral } = require('@root/src/structures/BaseContext');
const { PermissionFlagsBits } = require('discord-api-types/v10');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "cooldown",
  description: "Manage cooldowns for the server or individuals",
  category: "BLOXBURG",
  botPermissions: ["EmbedLinks"],
  
  // Slash command configuration
  slashCommand: {
    enabled: true,
    ephemeral: false,
    options: [
      {
        name: "set",
        description: "Set a cooldown for either the server or a specific user",
        type: 1, // Subcommand type
        options: [
          {
            name: "time",
            description: "The duration of the cooldown",
            type: 3, // STRING type
            required: true,
            choices: [
              { name: "5 Minutes", value: "5m"},
              { name: "10 Minutes", value: "10m"},
              { name: "15 Minutes", value: "15m"},
              { name: "30 Minutes", value: "30m"},
              { name: "1 Hour", value: "1h"},
              { name: "2 Hours", value: "2h"},
              { name: "4 Hours", value: "4h"},
              { name: "6 Hours", value: "6h"},
              { name: "1 Day", value: "1d" },
              { name: "1 Week", value: "1w" },
              { name: "1 Month", value: "1m" },
              { name: "Permanent", value: "permanent" },
            ]
          },
          {
            name: "user",
            description: "Do not select to set Server Cooldown",
            type: 6, // USER type
            required: false,
          },
        ]
      },
      {
        name: "status",
        description: "Check your own cooldown",
        type: 1, // Subcommand type
        options: [
          {
            name: "user",
            description: "Check another user's cooldown",
            type: 6, // USER type
          },
        ]
      },
    ]
  },

  async interactionRun(interaction) {
    const subCommand = interaction.options.getSubcommand();
    const embedColor = require("@root/config").EMBED_COLORS.BOT_EMBED;

    if (subCommand === "status") {
      const targetUser = interaction.options.getUser('user'); // Get the target user from command options, if any
      const currentTimestamp = Date.now();
      const idid = require("@root/config").CUSTOM.LEADER; // Shift Manager role ID
      const idid1 = require("@root/config").CUSTOM.LVL_FIFTY; // Level 50 role

      // Determine cooldown durations
      const serverCooldownDuration = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
      let individualCooldownDuration;

      let targetMember;
      let userID;

      // Check if targetUser is provided
      if (targetUser) {
        targetMember = interaction.guild.members.cache.get(targetUser.id); // Get member object from the guild
        if (!targetMember) {
          return interaction.followUp({
            content: "The user specified could not be found in this server.",
            ephemeral: true
          });
        }
        userID = targetUser.id; // Set the user ID to target user
      } else {
        targetMember = interaction.member;
        userID = interaction.user.id;
      }

      const nickname = targetMember.displayName.split(' ')[0];

      // Determine the individual cooldown based on the target member's roles
      if (targetMember.premiumSince !== null || targetMember.roles.cache.has(idid1)) {
        individualCooldownDuration = 3 * 60 * 60 * 1000; 
      } else if (targetMember.roles.cache.has(idid)) {
        individualCooldownDuration = 4 * 60 * 60 * 1000; 
      } else {
        individualCooldownDuration = 6 * 60 * 60 * 1000; 
      }

      // Retrieve last command timestamps from the database for the target user or invoking user
      const lastUserCommandTimestamp = parseInt(interaction.client.shiftdatabase.get(`${userID}-lastCommand`)) || 0;
      const lastServerCommandTimestamp = parseInt(interaction.client.shiftdatabase.get("lastServerCommand")) || 0;

      // Calculate when the cooldowns will end
      const serverCooldownEndTimestamp = lastServerCommandTimestamp + serverCooldownDuration;
      const userCooldownEndTimestamp = lastUserCommandTimestamp + individualCooldownDuration;

      const isServerCooldownActive = currentTimestamp < serverCooldownEndTimestamp;
      const isUserCooldownActive = currentTimestamp < userCooldownEndTimestamp;

      // Prepare messages
      let serverCooldownMessage = "No cooldown";
      let userCooldownMessage = "No cooldown";

      if (isServerCooldownActive) {
        const serverCooldownRemaining = Math.floor(serverCooldownEndTimestamp / 1000); // Convert to seconds
        serverCooldownMessage = `Server cooldown ends <t:${serverCooldownRemaining}:R>`;
      }

      if (isUserCooldownActive) {
        const userCooldownRemaining = Math.floor(userCooldownEndTimestamp / 1000); // Convert to seconds
        const oneHundredYearsInSeconds = 100 * 365 * 24 * 60 * 60; // 100 years in seconds

        if (userCooldownRemaining > oneHundredYearsInSeconds) {
          userCooldownMessage = targetUser ? `${nickname} has a permanent ban from hosting shifts.` : `You have a permanent ban from hosting shifts.`;
        } else {
          userCooldownMessage = targetUser ? `${nickname}'s cooldown ends <t:${userCooldownRemaining}:R>` : `Your cooldown ends <t:${userCooldownRemaining}:R>`; // Remaining cooldown time
        }
      }

      // Create and send the embed
      const cooldownEmbed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle(targetUser ? `${nickname}'s Cooldown Status` : 'Cooldown Status')
        .addFields(
          { name: 'Server Cooldown', value: serverCooldownMessage, inline: true },
          { name: targetUser ? `${nickname}'s Cooldown` : 'Your Cooldown', value: userCooldownMessage, inline: true }
        );

      await interaction.followUp({
        embeds: [cooldownEmbed],
        ephemeral: true
      });

    } else if (subCommand === "set") {
      const allowedRoles = [
          "1268995995375505458", // Mod+
          "1267959004009857034"  // Trial Mod
      ];
  
      // Check if the user has at least one of the allowed roles
      const memberRoles = interaction.member.roles.cache;
      const hasAllowedRole = allowedRoles.some(role => memberRoles.has(role));
  
      if (!hasAllowedRole) {
          return interaction.followUp({
              content: "You do not have permission to use this command.",
              ephemeral: true
          });
      }
  
      const targetUser = interaction.options.getUser("user");
      const timeOption = interaction.options.getString("time");
  
      // Mapping for time options
      const timeMappings = {
          "5m": { name: "5 Minutes", duration: 5 * 60 * 1000 },
          "10m": { name: "10 Minutes", duration: 10 * 60 * 1000 },
          "15m": { name: "15 Minutes", duration: 15 * 60 * 1000 },
          "30m": { name: "30 Minutes", duration: 30 * 60 * 1000 },
          "1h": { name: "1 Hour", duration: 1 * 60 * 60 * 1000 },
          "2h": { name: "2 Hours", duration: 2 * 60 * 60 * 1000 },
          "4h": { name: "4 Hours", duration: 4 * 60 * 60 * 1000 },
          "6h": { name: "6 Hours", duration: 6 * 60 * 60 * 1000 },
          "1d": { name: "1 Day", duration: 24 * 60 * 60 * 1000 },
          "1w": { name: "1 Week", duration: 7 * 24 * 60 * 60 * 1000 },
          "1m": { name: "1 Month", duration: 30 * 24 * 60 * 60 * 1000 },
          "permanent": { name: "Permanent", duration: 1000 * 365 * 24 * 60 * 60 * 1000 } // Approx 1000 years
      };
  
      const timeData = timeMappings[timeOption];
      if (!timeData) {
          return interaction.followUp({
              content: "Invalid time option. Please select a valid duration.",
              ephemeral: true
          });
      }
  
      const { name: timeName, duration: baseDuration } = timeData;
      const currentTimestamp = Date.now();
  
      if (targetUser) {
          // Handle user-specific cooldown
          const targetMember = interaction.guild.members.cache.get(targetUser.id);
          if (!targetMember) {
              return interaction.followUp({
                  content: "The user specified could not be found in this server.",
                  ephemeral: true
              });
          }
  
          // Extract the user's nickname or username, and take only the part before the first space
          let nickname = targetMember.nickname || targetUser.username;
          nickname = nickname.split(" ")[0];

          const cooldownEndTimestamp = currentTimestamp + baseDuration - (6 * 60 * 60 * 1000);
  
          // Update the user's cooldown in the database
          interaction.client.shiftdatabase.set(`${targetUser.id}-lastCommand`, cooldownEndTimestamp);
  
          const cooldownEmbed = new EmbedBuilder()
              .setColor(embedColor)
              .setTitle(`Set ${nickname}'s Cooldown`)
              .setDescription(`Cooldown set for ${timeName}.`);
  
          await interaction.followUp({
              embeds: [cooldownEmbed],
              ephemeral: true
          });
      } else {
          // Handle server-wide cooldown
          if (timeOption === "permanent") {
              return interaction.followUp({
                  content: "You cannot set the server cooldown to be permanent.",
                  ephemeral: true
              });
          }
  
          // Subtract 2 hours for server-wide cooldown adjustment
          const cooldownEndTimestamp = currentTimestamp + baseDuration - (2 * 60 * 60 * 1000);
  
          // Update the server-wide cooldown in the database
          interaction.client.shiftdatabase.set(`lastServerCommand`, cooldownEndTimestamp);
  
          const serverCooldownEmbed = new EmbedBuilder()
              .setColor(embedColor)
              .setTitle('Set Server Cooldown')
              .setDescription(`Server cooldown set for ${timeName}.`);
  
          await interaction.followUp({
              embeds: [serverCooldownEmbed],
              ephemeral: true
          });
      }
    }    
  },
};