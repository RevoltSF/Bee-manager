const { SlashCommandBuilder } = require('@discordjs/builders');
const { ephemeral } = require('@root/src/structures/BaseContext');
const { PermissionFlagsBits } = require('discord-api-types/v10');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuBuilder, ComponentType, ModalBuilder} = require('discord.js');
const { slashCommand } = require('./embed');
const embedColor = require("@root/config").EMBED_COLORS.BOT_EMBED;

module.exports = {
  name: "partner",
  description: "Add a new partner",
  category: "ADMIN",

  slashCommand: {
    enabled: true,
    options: [
      {
        name: "new",
        description: "Add a new partner",
        type: 1,
        options: [
          {
            name: "server-link",
            description: "The link to their server",
            type: 3,
            required: true,
          },
          {
            name: "partner-representative",
            description: "Who is their representative?",
            type: 6,
            required: true,
          },
          {
            name: "our-rep",
            description: "Who is our rep?",
            type: 6,
            required: true,
          },
          {
            name: "follow",
            description: "Do we follow them?",
            type: 3,
            required: true,
            choices: [
              {
                name: "Community Circuit",
                value: "cc"
              },
              {
                name: "Business Bulletin",
                value: "bb",
              },
              {
                name: "Roleplay Release",
                value: "rr",
              },
              {
                name: "No",
                value: "no"
              }
            ]
          },
          {
            name: "channel-id",
            description: "Provide the channel id of the followed channel (Input 0 if a channel is not followed)",
            type: 3,
            required: true,
          }
        ]
      },
      {
        name: "terminate",
        description: "terminate a partner",
        type: 1,
        options: [
          {
            name: "reason",
            description: "State the reason for termination",
            type: 3,
            required: true,
          },
          {
            name: "server-name",
            description: "Name of the server",
            type: 3,
            required: false,
          },
          {
            name: "representative",
            description: "Select the Representative",
            type: 6,
            required: false,
          },
        ]
      },
      {
        name: "change-rep",
        description: "Change the representative of a server",
        type: 1,
        options: [
          {
            name: "rep-type",
            description: "Which representative to change",
            type: 3, // STRING type
            required: true,
            choices: [
              { name: "Partner Representative", value: "partner" },
              { name: "Our Representative", value: "our" }
            ],
          },
          {
            name: "current-rep",
            description: "The current representative",
            type: 6, // USER type
            required: true,
          },
          {
            name: "new-rep",
            description: "The new representative",
            type: 6, // USER type
            required: true,
          }
        ]
      },
      {
        name: 'list',
        description: 'Get a list of partnered servers',
        type: 1,
        options: [
          {
            name: 'status',
            description: 'Choose the partner status to list',
            type: 3, // STRING type
            required: true,
            choices: [
              { name: 'Current Partners', value: 'current' },
              { name: 'Terminated Partners', value: 'terminated' },
            ],
          },
        ],
      }
    ]
  },

  async interactionRun(interaction) {
    const subCommand = interaction.options.getSubcommand();

      if (subCommand === "new") {

      const representative = interaction.options.getUser("partner-representative");
      const link = interaction.options.getString("server-link");
      const ourRep = interaction.options.getUser("our-rep");
      const follow = interaction.options.getString("follow");
      const channelId = interaction.options.getString("channel-id")

      const partnerdb = interaction.client.partnerdatabase.get("partners") || [];
      const terminatedb = interaction.client.partnerdatabase.get("terminated") || [];
      let serverName = interaction.options.getString("server-name");
      let serverId;
      let iconURL;

      try {
        const invite = await interaction.client.fetchInvite(link);
        serverId = invite.guild?.id;
        serverName = invite.guild?.name;
        iconURL = guild?.iconURL({ dynamic: true, size: 512 });
        if (!serverId) {
          return interaction.followUp({
            content: "The invite link is invalid or does not point to a server.",
            ephemeral: true,
          });
        }
      } catch (error) {}

      if (channelId !== "0") {
        const numericChannelId = Number(channelId);
        if (
          !Number.isInteger(numericChannelId) ||
          numericChannelId < 10000000000000000 ||
          numericChannelId > 9999999999999999999
        ) {
          return interaction.followUp({
            content: "Invalid channel ID. Must be '0' or a valid Discord channel ID.",
            ephemeral: true,
          });
        }
      }

      const embedColor = require("@root/config").EMBED_COLORS.BOT_EMBED;
      const existsActive = partnerdb.find(p => p.serverId === serverId);
      if (existsActive) {
        const embed = new EmbedBuilder()
          .setTitle("Already Partnered")
          .setColor(embedColor)
          .setDescription(`**${serverName}** is already partnered with us.`)
          .addFields(
            { name: "Representative", value: `<@${existsActive.representative}>`},
            { name: "Partnered On", value: `<t:${existsActive.partneredAt}:D>`},
          )
          .setThumbnail(iconURL)
          .setTimestamp();

        return interaction.followUp({ embeds: [embed], ephemeral: true });
      }

      // Check terminated partners
      const existsTerminated = terminatedb.find(p => p.serverId === serverId);
      iconURL = null;
      if (existsTerminated?.link) {
        try {
          const invite = await interaction.client.fetchInvite(existsTerminated.link);
          if (invite.guild) {
            iconURL = invite.guild.iconURL({ dynamic: true, size: 512 });
          }
        } catch (error) {
          // Link may be expired or invalid, iconURL stays null
        }
      }
      if (existsTerminated) {

        const embed = new EmbedBuilder()
          .setTitle("Previously Terminated")
          .setColor(embedColor)
          .setDescription(`**${serverName}** was previously a partner but has been terminated.`)
          .addFields(
            { name: "Representative", value: `<@${existsTerminated.representative}>`},
            { name: "Terminated On", value: `<t:${existsTerminated.terminatedAt}:D>`},
            { name: "Reason", value: existsTerminated.terminationReason}
          )
          .setThumbnail(iconURL)
          .setTimestamp();

          const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("remove_termination")
            .setLabel("Remove Termination")
            .setStyle(ButtonStyle.Danger)
        );

        const reply = await interaction.followUp({
          embeds: [embed],
          components: [row],
          ephemeral: true,
          fetchReply: true,
        });

         const collector = reply.createMessageComponentCollector({
          componentType: ComponentType.Button,
          time: 300_000,
        });

        collector.on("collect", async i => {
          if (i.customId === "remove_termination") {
            // Remove from termination db
            const updatedTerminated = terminatedb.filter(p => p.serverId !== serverId);
            interaction.client.partnerdatabase.set("terminated", updatedTerminated);

            await i.update({
            content: "",
            embeds: [
              new EmbedBuilder()
                .setTitle("Termination Removed")
                .setColor(embedColor)
                .setDescription(`**${serverName}** has been removed from the terminated list.`)
                .setTimestamp()
            ],
            components: [],
          });
          }
        });

        collector.on("end", () => {
          if (!reply.deleted) {
            reply.edit({ components: [] }).catch(() => {});
          }
        });

        return;
      }

      // Add the new partner
      partnerdb.push({
        serverName,
        representative: representative.id,
        ourRep: ourRep.id,
        partneredAt: Math.floor(Date.now() / 1000),
        link,
        follow,
        serverId,
        channelId,
      });

      partnerdb.sort((a, b) =>
      a.serverName.toLowerCase().localeCompare(b.serverName.toLowerCase())
      );

      interaction.client.partnerdatabase.set("partners", partnerdb);

      const repRoleId = "1267959007314841724";
      try {
        const member = await interaction.guild.members.fetch(representative.id);
        if (!member.roles.cache.has(repRoleId)) {
          await member.roles.add(repRoleId);
        }
      } catch (err) {
        console.error(`Failed to assign partner rep role: ${err}`);
      }

      try {
        const invite = await interaction.client.fetchInvite(link);
        const guild = invite.guild;
        const iconURL = guild.iconURL({ dynamic: true, size: 512 });

        const followLabels = {
          cc: "Community Circuit",
          bb: "Business Bulletin",
          rr: "Roleplay Release",
          no: "No",
        };

        let followedValue = followLabels[follow] || "Unknown";
        if (follow !== "no" && typeof channelId === "string" && channelId !== "0" && channelId.length >= 17 && channelId.length <= 19) {
          followedValue = `[${followLabels[follow]}](https://discord.com/channels/${serverId}/${channelId})`;
        } else if (follow === "no") {
          followedValue = "No";
        }

        const confirmEmbed = new EmbedBuilder()
          .setTitle("Partner Added")
          .setColor(embedColor)
          .setDescription(`**${serverName}** has been added as a partner.`)
          .addFields(
            { name: "Representative", value: `<@${representative.id}>` },
            { name: "Our Representative", value: `<@${ourRep.id}>` },
            { name: "Followed into ", value: `${followedValue}`}
          )
          .setThumbnail(iconURL)
          .setTimestamp();

        await interaction.followUp({
          embeds: [confirmEmbed],
          ephemeral: true,
        });
      } catch (error) {}

    } else if (subCommand === "terminate") {
      const serverName = interaction.options.getString("server-name");
      const representative = interaction.options.getUser("representative");
      const reason = interaction.options.getString("reason");

      const partnerdb = interaction.client.partnerdatabase.get("partners") || [];
      const terminatedb = interaction.client.partnerdatabase.get("terminated") || [];

      if (serverName) {
        const partner = partnerdb.find(
          (p) => p.serverName.toLowerCase() === serverName.toLowerCase()
        );

        if (!partner) {
          return interaction.followUp({
            content: `**${serverName}** is not a current partner.`,
            ephemeral: true,
          });
        }

        // Create a new array with the terminated partner added
        terminatedb.push({
          ...partner,
          terminatedAt: Math.floor(Date.now() / 1000),
          terminationReason: reason,
        });

        // Remove the partner from the active list
        const updatedPartners = partnerdb.filter(
          (p) => p.serverName.toLowerCase() !== serverName.toLowerCase()
        );

        // Save both updated arrays to the database
        interaction.client.partnerdatabase.set("partners", updatedPartners);
        interaction.client.partnerdatabase.set("terminated", terminatedb);

        const stillARep = updatedPartners.some(p => p.representative === representative.id);

        const partnerRoleId = "1267959007314841724";
        const server = interaction.guild;
        const repMember = await server.members.fetch(representative.id).catch(() => null);

        if (!stillARep && repMember?.roles.cache.has(partnerRoleId)) {
          await repMember.roles.remove(partnerRoleId).catch(console.error);
        }

        const embedColor = require("@root/config").EMBED_COLORS.BOT_EMBED;
        let iconURL = null;
        try {
          const invite = await interaction.client.fetchInvite(partner.link);
          const guild = invite?.guild;

          if (guild) {
            iconURL = guild.iconURL({ dynamic: true, size: 512 }) || null;
          }
        } catch (err) {}

        const terminatedEmbed = new EmbedBuilder()
          .setTitle("Partner Terminated")
          .setColor(embedColor)
          .setDescription(`**${partner.serverName}** has been terminated as a partner.`)
          .addFields(
            { name: "Representative", value: `<@${partner.representative}>` },
            { name: "Our Representative", value: `<@${partner.ourRep}>` },
            { name: "Reason", value: reason || "No reason provided" }
          )
          .setThumbnail(iconURL)
          .setTimestamp();

        return interaction.followUp({
          embeds: [terminatedEmbed],
          ephemeral: true,
        });
      }
      if (representative) {
        // Find all partners for this rep
        const repsPartners = partnerdb.filter(p => p.representative === representative.id);

        if (repsPartners.length === 0) {
          return interaction.followUp({
            content: `<@${representative.id}> is not a representative of a currently partnered server.`,
            ephemeral: true,
          });
        }

        // If only one, remove directly
        if (repsPartners.length === 1) {
          const partner = repsPartners[0];

          const partnerRoleId = "1267959007314841724"; // replace with actual partner role ID
          const server = interaction.guild;
          const repId = partner.representative;
          const repMember = await server.members.fetch(repId).catch(() => null);

          if (repMember?.roles.cache.has(partnerRoleId)) {
            await repMember.roles.remove(partnerRoleId).catch(console.error);
          }

          // Remove from partners
          const updatedPartners = partnerdb.filter(p => p.serverName !== partner.serverName);
          interaction.client.partnerdatabase.set("partners", updatedPartners);

          // Push to terminated
          const terminatedb = interaction.client.partnerdatabase.get("terminated") || [];
          terminatedb.push({
            ...partner,
            terminatedAt: Math.floor(Date.now() / 1000),
            terminationReason: reason,
          });
          interaction.client.partnerdatabase.set("terminated", terminatedb);

          const embedColor = require("@root/config").EMBED_COLORS.BOT_EMBED;
          let iconURL = null;
          try {
            const invite = await interaction.client.fetchInvite(partner.link);
            const guild = invite?.guild;

            // Try for the guild icon URL
            if (guild) {
              iconURL = guild.iconURL({ dynamic: true, size: 512 }) || null;
            }
          } catch (err) {}
          const terminatedEmbed = new EmbedBuilder()
            .setTitle("Partner Terminated")
            .setColor(embedColor)
            .setDescription(`**${partner.serverName}** has been terminated as a partner.`)
            .addFields(
              { name: "Representative", value: `<@${representative.id}>` },
              { name: "Our Representative", value: `<@${partner.ourRep}>` },
              { name: "Reason", value: reason ||  "No reason provided"}
            )
            .setThumbnail(iconURL) // if you have an icon URL available for the server
            .setTimestamp();

            return interaction.followUp({
              embeds: [terminatedEmbed],
              ephemeral: true,
          });
        }

        // Multiple servers — create buttons to select which to remove
        const buttons = new ActionRowBuilder();

        repsPartners.forEach((partner, index) => {
          buttons.addComponents(
            new ButtonBuilder()
              .setCustomId(`remove_partner_${partner.serverName}`)
              .setLabel(partner.serverName)
              .setStyle(ButtonStyle.Danger)
          );
        });

        await interaction.followUp({
          content: `<@${representative.id}> represents multiple servers. Please choose which server to terminate:`,
          components: [buttons],
          ephemeral: true,
        });

        // Create a collector to handle button interactions
        const filter = i => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 300000 });

        collector.on('collect', async i => {
        if (!i.customId.startsWith('remove_partner_')) return;

        const selectedServer = i.customId.replace('remove_partner_', '');

        const partner = partnerdb.find(p => p.serverName === selectedServer);
        if (!partner) {
          await i.update({
            content: `Could not find partner data for **${selectedServer}**.`,
            components: [],
          });
          collector.stop();
          return;
        }

        // Push to terminated list
        const terminatedb = interaction.client.partnerdatabase.get("terminated") || [];
        terminatedb.push({
          ...partner,
          terminatedAt: Math.floor(Date.now() / 1000),
          terminationReason: reason,
        });
        interaction.client.partnerdatabase.set("terminated", terminatedb);

        // Remove from active list
        const updatedPartners = partnerdb.filter(p => p.serverName !== selectedServer);
        interaction.client.partnerdatabase.set("partners", updatedPartners);

        let iconURL = null;
        try {
          const invite = await interaction.client.fetchInvite(partner.link);
          const guild = invite.guild;
          iconURL = guild?.iconURL({ dynamic: true, size: 512 }) || null;
        } catch {

        }
        const embedColor = require("@root/config").EMBED_COLORS.BOT_EMBED;
        const terminatedUpdateEmbed = new EmbedBuilder()
          .setTitle("Partner Terminated")
          .setColor(embedColor)
          .setDescription(`Terminated partner server **${selectedServer}** for <@${representative.id}>.`)
          .setThumbnail(iconURL)
          .setTimestamp();

          await i.update({
            content: null,
            embeds: [terminatedUpdateEmbed],
            components: [],
        });

        collector.stop();
      });

        collector.on('end', collected => {
          if (collected.size === 0) {
            interaction.followUp({
              content: 'No selection made. Partner removal cancelled.',
              ephemeral: true,
            });
          }
        });

        return; // Exit early since followUp and collector handle response
      }

      // No valid input provided
      return interaction.followUp({
        content: `Server name or representative not found.`,
        ephemeral: true,
      });

    } else if (subCommand === 'change-rep') {
      const repType = interaction.options.getString("rep-type");
      const currentRep = interaction.options.getUser("current-rep");
      const newRep = interaction.options.getUser("new-rep");

      const partnerdb = interaction.client.partnerdatabase.get("partners") || [];

      // Determine which field to check/update based on repType
      const repField = repType === "our" ? "ourRep" : "representative";

      // Find all partners with currentRep in the correct field
      const repsPartners = partnerdb.filter(p => p[repField] === currentRep.id);

      if (repsPartners.length === 0) {
        return interaction.followUp({
          content: `<@${currentRep.id}> is not ${repType === "our" ? "our" : "a partner"} representative of a currently partnered server.`,
          ephemeral: true,
        });
      }

      // Check if newRep is already a rep for any of these servers
      const isAlreadyRep = repsPartners.some(p => p[repField] === newRep.id);
      if (isAlreadyRep) {
        return interaction.followUp({
          content: `<@${newRep.id}> is already ${repType === "our" ? "our" : "the partner"} representative for that partnership.`,
          ephemeral: true,
        });
      }

      // If only one server, update directly
      if (repsPartners.length === 1) {
        const partner = repsPartners[0];
        const oldRepId = partner[repField];
        const partnerRoleId = '1267959007314841724'; // Replace with actual ID
        const partnerRole = interaction.guild.roles.cache.get(partnerRoleId);

        // Fetch and remove role from current (old) rep
        const guildMemberOld = await interaction.guild.members.fetch(oldRepId).catch(() => null);
        if (guildMemberOld && guildMemberOld.roles.cache.has(partnerRole.id)) {
          await guildMemberOld.roles.remove(partnerRole);
        }

        // Fetch and add role to new rep
        const guildMemberNew = await interaction.guild.members.fetch(newRep.id).catch(() => null);
        if (guildMemberNew && !guildMemberNew.roles.cache.has(partnerRole.id)) {
          await guildMemberNew.roles.add(partnerRole);
        }

        // Update the partner database
        partner[repField] = newRep.id;
        interaction.client.partnerdatabase.set("partners", partnerdb);

        // Confirmation message
        return interaction.followUp({
          content: `Representative for **${partner.serverName}** changed from <@${oldRepId}> to <@${newRep.id}>.`,
        });
      }

      // Multiple servers - send buttons to select which to update
      const buttons = new ActionRowBuilder();

      repsPartners.forEach(partner => {
        buttons.addComponents(
          new ButtonBuilder()
            .setCustomId(`change_rep_${repType}_${partner.serverName}`) // include repType for clarity
            .setLabel(partner.serverName)
            .setStyle(ButtonStyle.Primary)
        );
      });

      await interaction.followUp({
        content: `<@${currentRep.id}> is representative for multiple servers. Please choose which server's representative to change:`,
        components: [buttons],
        ephemeral: true,
      });

      const filter = i => i.user.id === interaction.user.id;
      const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

      collector.on('collect', async i => {
        if (!i.customId.startsWith(`change_rep_${repType}_`)) return;

        const selectedServer = i.customId.replace(`change_rep_${repType}_`, '');
        const partner = partnerdb.find(p => p.serverName === selectedServer && p[repField] === currentRep.id);

        if (!partner) {
          await i.update({ content: 'Selected server not found or representative mismatch.', components: [], ephemeral: true });
          collector.stop();
          return;
        }

        const partnerRoleId = '1267959007314841724';
        const partnerRole = i.guild.roles.cache.get(partnerRoleId);
        
        if (!partnerRole) {
          await i.update({ content: 'Partner role not found in this server.', components: [], ephemeral: true });
          collector.stop();
          return;
        }

        const guildMemberNew = await i.guild.members.fetch(newRep.id).catch(() => null);
        if (guildMemberNew && !guildMemberNew.roles.cache.has(partnerRole.id)) {
          await guildMemberNew.roles.add(partnerRole);
        }
        partner[repField] = newRep.id;
        interaction.client.partnerdatabase.set("partners", partnerdb);

        await i.update({
          content: `Representative for **${selectedServer}** changed from <@${currentRep.id}> to <@${newRep.id}>.`,
          components: [],
        });

        collector.stop();
      });

      collector.on('end', collected => {
        if (collected.size === 0) {
          interaction.followUp({
            content: 'No selection made. Representative change cancelled.',
            ephemeral: true,
          });
        }
      });

    } else if (subCommand === 'list') {
      const embedColor = require("@root/config").EMBED_COLORS.BOT_EMBED;

      const status = interaction.options.getString('status');

      const partnerdb = interaction.client.partnerdatabase.get(
        status === 'terminated' ? 'terminated' : 'partners'
      ) || [];

      if (partnerdb.length === 0) {
        return interaction.followUp({
          content: status === 'terminated'
            ? "There are currently no terminated partners."
            : "There are currently no partnered servers.",
          ephemeral: true,
        });
      }

      const pageSize = 10;
      let currentPage = 0;
      const totalPages = Math.ceil(partnerdb.length / pageSize);

      const generateEmbed = (page) => {
      const start = page * pageSize;
      const slice = partnerdb.slice(start, start + pageSize);
      const title = status === 'terminated' ? "Terminated Partnered Servers" : "Currently Partnered Servers";

      let description = slice
        .map((p, i) => {
          const serverName = p.serverName || "Unknown Server";
          const rep = p.representative || "Unknown";
          return `\`${start + i + 1}.\` **${serverName}** — <@${rep}>`;
        })
        .join("\n");

      // Discord requires description to be non-empty
      if (!description || description.trim().length === 0) {
        description = "No partners found on this page.";
      }

      const embed = new EmbedBuilder()
        .setTitle(title)
        .setColor(embedColor)
        .setDescription(description)
        .setFooter({ text: `Page ${page + 1} of ${totalPages}` })
        .setTimestamp();

      return embed;
    };

      const generateSelectMenu = (page) => {
        const start = page * pageSize;
        const slice = partnerdb.slice(start, start + pageSize).slice(0, 25); // hard limit

        if (slice.length === 0) {
          return new StringSelectMenuBuilder()
            .setCustomId(`partner_select_${page}`)
            .setPlaceholder("No partners available")
            .addOptions([
              {
                label: "No partners available",
                value: "none",
                description: "There are no partners to select.",
                default: true,
              },
            ])
            .setDisabled(true);
        }

        const options = slice.map((p, i) => ({
          label: (p.serverName || "Unknown Server").slice(0, 100),
          value: `${start + i}`,
        }));

        return new StringSelectMenuBuilder()
          .setCustomId(`partner_select_${page}`)
          .setPlaceholder("Select a partner to view details")
          .addOptions(options);
      };

      const generateNavButtons = (page) => {
        return new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`prev_${page}`)
            .setLabel("◀️ Previous")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(page <= 0),
          new ButtonBuilder()
            .setCustomId(`next_${page}`)
            .setLabel("Next ▶️")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(page >= totalPages - 1)
        );
      };

      const embed = generateEmbed(currentPage);
      const selectMenu = new ActionRowBuilder().addComponents(generateSelectMenu(currentPage));
      const navButtons = generateNavButtons(currentPage);

      const msg = await interaction.followUp({
        embeds: [embed],
        components: [selectMenu, navButtons],
        ephemeral: true,
        fetchReply: true,
      });

      // --- Collectors Setup ---
      const filter = (i) => i.user.id === interaction.user.id;

      // Pagination Button Collector
      const buttonCollector = msg.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 900_000,
        filter,
      });

      buttonCollector.on("collect", async (i) => {
        if (
          i.customId.startsWith("remove_termination_") ||
          i.customId.startsWith("update_invite_") ||
          i.customId.startsWith("update_channel_") ||
          i.customId.startsWith("update_follow_")
        ) return;

        const [type, pageStr] = i.customId.split("_");
        let page = parseInt(pageStr);

        if (type === "prev") page = Math.max(0, page - 1);
        if (type === "next") page = Math.min(totalPages - 1, page + 1);

        currentPage = page;

        const newEmbed = generateEmbed(page);
        const newSelectMenu = new ActionRowBuilder().addComponents(generateSelectMenu(page));
        const newNavButtons = generateNavButtons(page);

        await i.update({
          embeds: [newEmbed],
          components: [newSelectMenu, newNavButtons],
        });
      });

      // Dropdown Collector
      const dropdownCollector = msg.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        time: 900_000,
        filter,
      });

      dropdownCollector.on("collect", async (i) => {
        if (i.customId.startsWith("submit_follow_")) return;
        const selectedIndex = parseInt(i.values[0]);
        const partnerdb = i.client.partnerdatabase.get("partners") || [];
        const terminatedb = i.client.partnerdatabase.get("terminated") || [];

        let partner;
        let status = interaction.options.getString('status');

        if (status === "current") {
          partner = partnerdb[selectedIndex];
        } else if (status === "terminated") {
          partner = terminatedb[selectedIndex];
        }

        if (!partner) {
          return i.reply({ content: "Partner not found.", ephemeral: true });
        }

        let iconURL = null;
        try {
          const invite = await i.client.fetchInvite(partner.link);
          const guild = invite.guild;
          iconURL = guild.iconURL({ dynamic: true, size: 512 })?.toString() || null;
        } catch {}

        const detailEmbed = createDetailEmbed(partner, status, embedColor, iconURL);

        const actionRows = [
          new ActionRowBuilder().addComponents(generateSelectMenu(currentPage)),
          generateNavButtons(currentPage)
        ];

        if (status === 'terminated' && partner.terminatedAt) {
          actionRows.push(
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId(`remove_termination_${partner.serverId}`)
                .setLabel("Remove Termination")
                .setStyle(ButtonStyle.Danger)
            )
          );
        } else {
          actionRows.push(
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId(`update_invite_${partner.serverId}`)
                .setLabel("Update Invite Link")
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId(`update_channel_${partner.serverId}`)
                .setLabel("Update Channel ID")
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId(`update_follow_${partner.serverId}`)
                .setLabel("Update Follow")
                .setStyle(ButtonStyle.Primary)
            )
          );
        }

        await i.update({ embeds: [detailEmbed], components: actionRows });
      });

      const updateCollector = msg.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 900_000,
        filter,
      });

      updateCollector.on("collect", async (i) => {
        const partnerdb = i.client.partnerdatabase.get("partners") || [];

        if (i.customId.startsWith("remove_termination_")) {
          const serverId = i.customId.replace("remove_termination_", "");
          const terminatedb = i.client.partnerdatabase.get("terminated") || [];

          const partner = terminatedb.find(p => p.serverId === serverId);
          if (!partner) {
            return i.reply({
              content: `Partner not found in the terminated list.`,
              ephemeral: true,
            });
          }

          const updatedTerminated = terminatedb.filter(p => p.serverId !== serverId);
          i.client.partnerdatabase.set("terminated", updatedTerminated);

          const removedEmbed = new EmbedBuilder()
            .setTitle("Termination Removed")
            .setColor(embedColor)
            .setDescription(`**${partner.serverName}** has been removed from the terminated partners list.`)
            .setTimestamp();

          return i.update({
            embeds: [removedEmbed],
            components: [],
            ephemeral: true,
          });
        }

        if (i.customId.startsWith("update_invite_")) {
          const serverId = i.customId.split("update_invite_")[1];

          await i.deferUpdate();

          const promptEmbed = new EmbedBuilder()
            .setTitle("Update Invite Link")
            .setDescription("Please send the new invite link (within 60 seconds):")
            .setColor(embedColor)
            .setTimestamp();

          await i.followUp({ embeds: [promptEmbed], ephemeral: true });

          const filter = (m) => m.author.id === i.user.id;
          try {
            const collected = await i.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
            const collectedMessage = collected.first();
            const newInvite = collected.first().content.trim();

            // Validate invite
            let invite;
            try {
              invite = await i.client.fetchInvite(newInvite);
              if (!invite.guild || invite.guild.id !== serverId) {
                const errorEmbed = new EmbedBuilder()
                  .setTitle("Invalid Invite")
                  .setDescription("Invite link does not match the partner's server.")
                  .setColor(embedColor)
                  .setTimestamp();

                try {
                  await collectedMessage.delete();
                } catch (err) {
                  console.error("Failed to delete user's message:", err);
                }

                return i.followUp({ embeds: [errorEmbed], ephemeral: true });
              }
            } catch {
              const errorEmbed = new EmbedBuilder()
                .setTitle("Invalid Invite")
                .setDescription("Invalid invite link provided.")
                .setColor(embedColor)
                .setTimestamp();

              try {
                await collectedMessage.delete();
              } catch (err) {
                console.error("Failed to delete user's message:", err);
              }

              return i.followUp({ embeds: [errorEmbed], ephemeral: true });
            }

            const partnerIndex = partnerdb.findIndex(p => p.serverId === serverId);
            if (partnerIndex === -1) {
              const errorEmbed = new EmbedBuilder()
                .setTitle("Error")
                .setDescription("Partner not found in database.")
                .setColor(embedColor)
                .setTimestamp();
              
              try {
                await collectedMessage.delete();
              } catch (err) {
                console.error("Failed to delete user's message:", err);
              }

              return i.followUp({ embeds: [errorEmbed], ephemeral: true });
            }

            if (partnerdb[partnerIndex].link === newInvite) {
              const noChangeEmbed = new EmbedBuilder()
                .setTitle("No Changes")
                .setDescription("The new invite link is the same as the current one. No changes made.")
                .setColor(embedColor)
                .setTimestamp();

              try {
                await collectedMessage.delete();
              } catch (err) {
                console.error("Failed to delete user's message:", err);
              }

              return i.followUp({ embeds: [noChangeEmbed], ephemeral: true });
            }

            partnerdb[partnerIndex].link = newInvite;
            i.client.partnerdatabase.set("partners", partnerdb);

            const partner = partnerdb[partnerIndex];

            // Fetch iconURL again
            let iconURL = null;
            try {
              const invite = await i.client.fetchInvite(partner.link);
              const guild = invite.guild;
              iconURL = guild.iconURL({ dynamic: true, size: 512 })?.toString() || null;
            } catch {}

            // Regenerate embed & components
            const newEmbed = createDetailEmbed(partner, partner.status || 'current', embedColor, iconURL);
            const newActionRows = [
              new ActionRowBuilder().addComponents(generateSelectMenu(currentPage)),
              generateNavButtons(currentPage)
            ];

            if ((partner.status || 'current') === 'terminated' && partner.terminatedAt) {
              newActionRows.push(
                new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setCustomId(`remove_termination_${partner.serverId}`)
                    .setLabel("Remove Termination")
                    .setStyle(ButtonStyle.Danger)
                )
              );
            } else {
              newActionRows.push(
                new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setCustomId(`update_invite_${partner.serverId}`)
                    .setLabel("Update Invite Link")
                    .setStyle(ButtonStyle.Primary),
                  new ButtonBuilder()
                    .setCustomId(`update_channel_${partner.serverId}`)
                    .setLabel("Update Channel ID")
                    .setStyle(ButtonStyle.Primary),
                  new ButtonBuilder()
                    .setCustomId(`update_follow_${partner.serverId}`)
                    .setLabel("Update Follow")
                    .setStyle(ButtonStyle.Primary)
                  )
              );
            }

            await msg.edit({ embeds: [newEmbed], components: newActionRows });

            // Confirm success to user
            const successEmbed = new EmbedBuilder()
              .setTitle("Invite Link Updated")
              .setDescription(`Invite link updated successfully for **${partner.serverName}**.`)
              .setColor(embedColor)
              .setTimestamp();

            await i.followUp({ embeds: [successEmbed], ephemeral: true });

            try {
              await collectedMessage.delete();
            } catch (err) {
              console.error("Failed to delete user's message:", err);
            }

          } catch {
            const timeoutEmbed = new EmbedBuilder()
              .setTitle("Timeout")
              .setDescription("Timed out waiting for your message.")
              .setColor(embedColor)
              .setTimestamp();

            await i.followUp({ embeds: [timeoutEmbed], ephemeral: true });
          }
        }

        if (i.customId.startsWith("update_channel_")) {
          const serverId = i.customId.split("update_channel_")[1];

          const promptEmbed = new EmbedBuilder()
            .setTitle("Update Channel ID")
            .setDescription("Please send the new channel ID within 60 seconds.")
            .setColor(embedColor)
            .setTimestamp();

          await i.reply({ embeds: [promptEmbed], ephemeral: true });

          const filter = msg => msg.author.id === i.user.id;
          try {
            const collected = await i.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ["time"] });
            const collectedMessage = collected.first();
            const newChannelId = collectedMessage.content.trim();

            // Try to fetch the channel
            const channel = await i.client.channels.fetch(newChannelId).catch(() => null);
            if (!channel) {
              const errorEmbed = new EmbedBuilder()
                .setTitle("Invalid Channel ID")
                .setDescription("Could not find a channel with that ID.")
                .setColor(embedColor)
                .setTimestamp();

              try {
                await collectedMessage.delete();
              } catch (err) {
                console.error("Failed to delete user's message:", err);
              }

              return i.followUp({ embeds: [errorEmbed], ephemeral: true });
            }

            // Find the partner
            const partnerIndex = partnerdb.findIndex(p => p.serverId === serverId);
            if (partnerIndex === -1) {
              const notFoundEmbed = new EmbedBuilder()
                .setTitle("Partner Not Found")
                .setDescription("This partner doesn't exist in the database.")
                .setColor(embedColor)
                .setTimestamp();

              try {
                await collectedMessage.delete();
              } catch (err) {
                console.error("Failed to delete user's message:", err);
              }

              return i.followUp({ embeds: [notFoundEmbed], ephemeral: true });
            }

            // Check if the channel is the same
            if (partnerdb[partnerIndex].channelId === newChannelId) {
              const noChangeEmbed = new EmbedBuilder()
                .setTitle("No Change")
                .setDescription("This is already the current channel ID.")
                .setColor(embedColor)
                .setTimestamp();

              try {
                await collectedMessage.delete();
              } catch (err) {
                console.error("Failed to delete user's message:", err);
              }

              return i.followUp({ embeds: [noChangeEmbed], ephemeral: true });
            }

            // Update the database
            partnerdb[partnerIndex].channelId = newChannelId;
            i.client.partnerdatabase.set("partners", partnerdb);

            const successEmbed = new EmbedBuilder()
              .setTitle("Channel Updated")
              .setDescription(`Channel ID updated for **${partnerdb[partnerIndex].serverName}**.`)
              .setColor(embedColor)
              .setTimestamp();

            const partner = partnerdb[partnerIndex];
            let iconURL = null;
            try {
              const invite = await i.client.fetchInvite(partner.link);
              const guild = invite.guild;
              iconURL = guild.iconURL({ dynamic: true, size: 512 })?.toString() || null;
            } catch {}

            const newEmbed = createDetailEmbed(partner, partner.status || 'current', embedColor, iconURL);
            const newActionRows = [
              new ActionRowBuilder().addComponents(generateSelectMenu(currentPage)),
              generateNavButtons(currentPage)
            ];

            if ((partner.status || 'current') === 'terminated' && partner.terminatedAt) {
              newActionRows.push(
                new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setCustomId(`remove_termination_${partner.serverId}`)
                    .setLabel("Remove Termination")
                    .setStyle(ButtonStyle.Danger)
                )
              );
            } else {
              newActionRows.push(
                new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setCustomId(`update_invite_${partner.serverId}`)
                    .setLabel("Update Invite Link")
                    .setStyle(ButtonStyle.Primary),
                  new ButtonBuilder()
                    .setCustomId(`update_channel_${partner.serverId}`)
                    .setLabel("Update Channel ID")
                    .setStyle(ButtonStyle.Primary),
                  new ButtonBuilder()
                    .setCustomId(`update_follow_${partner.serverId}`)
                    .setLabel("Update Follow")
                    .setStyle(ButtonStyle.Primary)
                )
              );
            }

            await msg.edit({ embeds: [newEmbed], components: newActionRows });

            try {
              await collectedMessage.delete();
            } catch (err) {
              console.error("Failed to delete user's message:", err);
            }

            await i.followUp({ embeds: [successEmbed], ephemeral: true });
          } catch {
            const timeoutEmbed = new EmbedBuilder()
              .setTitle("Timeout")
              .setDescription("No response received. Cancelled channel update.")
              .setColor(embedColor)
              .setTimestamp();

            await i.followUp({ embeds: [timeoutEmbed], ephemeral: true });
          }
        }

        if (i.customId.startsWith("update_follow_")) {
          const serverId = i.customId.split("update_follow_")[1];

          const partnerdb = i.client.partnerdatabase.get("partners") || [];
          const partnerIndex = partnerdb.findIndex(p => p.serverId === serverId);
          const partner = partnerdb[partnerIndex];

          if (!partner) {
            return i.reply({
              content: "Partner not found.",
              ephemeral: true,
            });
          }

          const followOptions = [
            { label: "Community Circuit", value: "cc" },
            { label: "Business Bulletin", value: "bb" },
            { label: "Roleplay Release", value: "rr" },
            { label: "No", value: "no" }
          ];

          const selectMenu = new StringSelectMenuBuilder()
            .setCustomId(`submit_follow_${serverId}`)
            .setPlaceholder("Select follow type")
            .addOptions(followOptions);

          const row = new ActionRowBuilder().addComponents(selectMenu);

          const followReply = await i.reply({
            content: "Select the new follow type:",
            components: [row],
            ephemeral: true,
            fetchReply: true,
          });

          try {
            const followInteraction = await followReply.awaitMessageComponent({
              componentType: ComponentType.StringSelect,
              time: 900_000,
            });

            const selectedValue = followInteraction.values[0];

            // Reload the partner database to be safe
            const partnerdbReloaded = i.client.partnerdatabase.get("partners") || [];
            const partnerIndexReloaded = partnerdbReloaded.findIndex(p => p.serverId === serverId);

            if (partnerIndexReloaded === -1) {
              return followInteraction.reply({
                content: "This partner doesn't exist in the database.",
                ephemeral: true,
              });
            }

            if (partnerdbReloaded[partnerIndexReloaded].follow === selectedValue) {
              return followInteraction.reply({
                content: "This is already the current follow type.",
                ephemeral: true,
              });
            }

            // Update follow type
            partnerdbReloaded[partnerIndexReloaded].follow = selectedValue;
            i.client.partnerdatabase.set("partners", partnerdbReloaded);

            // Fetch icon URL for updated partner embed
            let iconURL = null;
            try {
              const invite = await i.client.fetchInvite(partnerdbReloaded[partnerIndexReloaded].link);
              const guild = invite.guild;
              iconURL = guild.iconURL({ dynamic: true, size: 512 })?.toString() || null;
            } catch {}

            // Regenerate the updated embed and components
            const newEmbed = createDetailEmbed(
              partnerdbReloaded[partnerIndexReloaded],
              partnerdbReloaded[partnerIndexReloaded].status || 'current',
              embedColor,
              iconURL
            );

            const newActionRows = [
              new ActionRowBuilder().addComponents(generateSelectMenu(currentPage)),
              generateNavButtons(currentPage),
            ];

            if ((partnerdbReloaded[partnerIndexReloaded].status || 'current') === 'terminated' && partnerdbReloaded[partnerIndexReloaded].terminatedAt) {
              newActionRows.push(
                new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setCustomId(`remove_termination_${partnerdbReloaded[partnerIndexReloaded].serverId}`)
                    .setLabel("Remove Termination")
                    .setStyle(ButtonStyle.Danger)
                )
              );
            } else {
              newActionRows.push(
                new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setCustomId(`update_invite_${partnerdbReloaded[partnerIndexReloaded].serverId}`)
                    .setLabel("Update Invite Link")
                    .setStyle(ButtonStyle.Primary),
                  new ButtonBuilder()
                    .setCustomId(`update_channel_${partnerdbReloaded[partnerIndexReloaded].serverId}`)
                    .setLabel("Update Channel ID")
                    .setStyle(ButtonStyle.Primary),
                  new ButtonBuilder()
                    .setCustomId(`update_follow_${partnerdbReloaded[partnerIndexReloaded].serverId}`)
                    .setLabel("Update Follow")
                    .setStyle(ButtonStyle.Primary)
                )
              );
            }
            await msg.edit({ embeds: [newEmbed], components: newActionRows });

            const followOptions = [
              { label: "Community Circuit", value: "cc" },
              { label: "Business Bulletin", value: "bb" },
              { label: "Roleplay Release", value: "rr" },
              { label: "No", value: "no" }
            ];

            // Find label by value
            const selectedLabel = followOptions.find(opt => opt.value === selectedValue)?.label || selectedValue;

            return followInteraction.update({
              content: `Follow type updated to **${selectedLabel}** for **${partnerdbReloaded[partnerIndexReloaded].serverName}**.`,
              components: [],
              ephemeral: true,
            });

          } catch (err) {}
          return;
        }
      });

      const followCollector = msg.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        time: 900_000,
        filter,
      });

      followCollector.on("collect", async (i) => {
        if (!i.customId.startsWith("submit_follow_")) return;

        await i.deferReply({ ephemeral: true });
        const serverId = i.customId.split("submit_follow_")[1];
        const selectedValue = i.values[0];

        const partnerdb = i.client.partnerdatabase.get("partners") || [];
        const partnerIndex = partnerdb.findIndex(p => p.serverId === serverId);
        if (partnerIndex === -1) {
          const notFoundEmbed = new EmbedBuilder()
            .setTitle("Partner Not Found")
            .setDescription("This partner doesn't exist in the database.")
            .setColor(embedColor)
            .setTimestamp();

          return i.editReply({ embeds: [notFoundEmbed] });
        }

        if (partnerdb[partnerIndex].follow === selectedValue) {
          const noChangeEmbed = new EmbedBuilder()
            .setTitle("No Change")
            .setDescription("This is already the current follow type.")
            .setColor(embedColor)
            .setTimestamp();

          return i.editReply({ embeds: [noChangeEmbed] });
        }

        partnerdb[partnerIndex].follow = selectedValue;
        i.client.partnerdatabase.set("partners", partnerdb);

        const successEmbed = new EmbedBuilder()
          .setTitle("Follow Type Updated")
          .setDescription(`Follow type updated to **${selectedValue.toUpperCase()}** for **${partnerdb[partnerIndex].serverName}**.`)
          .setColor(embedColor)
          .setTimestamp();

        await i.editReply({ embeds: [successEmbed] });
      });

      const cleanup = async () => {
        try {
          await msg.edit({ components: [] });
        } catch {}
      };

      buttonCollector.on("end", cleanup);
      dropdownCollector.on("end", cleanup);
      updateCollector.on("end", cleanup);
      followCollector.on("end", cleanup);
    }
  }
}

function createDetailEmbed(partner, status, embedColor, iconURL) {
  const followMap = {
    cc: "Community Circuit",
    bb: "Business Bulletin",
    rr: "Roleplay Release",
    no: "No"
  };

  let followedValue = "Not Available";
  if (
    typeof partner.channelId === "string" &&
    partner.channelId !== "0" &&
    partner.channelId.length >= 17 &&
    partner.channelId.length <= 19
  ) {
    followedValue = `[${followMap[partner.follow] || "Unknown"}](https://discord.com/channels/${partner.serverId}/${partner.channelId})\n-# The hyperlink may not work`;
  } else {
    followedValue = followMap[partner.follow] || "Not Available";
  }

  const detailEmbed = new EmbedBuilder()
    .setTitle(`${partner.serverName}`)
    .setColor(embedColor)
    .setThumbnail(iconURL)
    .addFields(
      { name: "Representative", value: `<@${partner.representative}>` },
      { name: "Our Representative", value: `<@${partner.ourRep}>` },
      { name: "Server Link", value: `<${partner.link}>` },
      { name: "Became Partners on", value: `<t:${partner.partneredAt}:D>` },
      { name: "Followed into", value: followedValue || "Not Available" }
    )
    .setTimestamp();

  if (status === 'terminated' && partner.terminatedAt) {
    const fields = [{ name: "Terminated On", value: `<t:${partner.terminatedAt}:D>` }];
    if (partner.terminationReason) fields.push({ name: "Reason", value: `${partner.terminationReason}` });
    detailEmbed.addFields(...fields);
  }

  return detailEmbed;
}