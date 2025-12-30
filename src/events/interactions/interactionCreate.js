const { getSettings } = require("@schemas/Guild");
const { commandHandler, contextHandler, statsHandler, suggestionHandler, ticketHandler, taskHandler, serverInfo, proof, protocols, guide, rules, amongus,} = require("@src/handlers");
const { InteractionType } = require("discord.js");

/**
 * @param {import('@src/structures').BotClient} client
 * @param {import('discord.js').BaseInteraction} interaction
 */
module.exports = async (client, interaction) => {
const i = `${interaction.commandName}`;
try {
    // Check if the interaction is the /donate-saves command
    if (interaction.isCommand() && interaction.commandName === 'donate-saves') {
      // Fetch the latest message from the counting bot in the same channel
      const channel = interaction.channel;
      const messages = await channel.messages.fetch({ limit: 2 }); // Adjust limit if needed

      const countingBotMessage = messages.find(
        (msg) => msg.author.id === '510016054391734273' && msg.embeds.length > 0
      );

      if (countingBotMessage) {
        const embed = countingBotMessage.embeds[0];

        // Ensure it's the correct embed (e.g., containing "Save donated!")
        if (embed.title && embed.title.includes("Save donated!")) {
          // Directly get the user who triggered the command
          const userId = interaction.user.id;

          const guild = interaction.guild;
          const member = await guild.members.fetch(userId).catch((err) => {
            console.error('Error fetching member:', err);
            channel.send("Could not fetch the member.");
            return null;
          });

          // If the member is found, proceed to check their role
          if (member) {
            const roleId = "1267959009227571373"; // Replace with the actual role ID

            // Check if the member has the role and remove it
            if (member.roles.cache.has(roleId)) {
              await member.roles.remove(roleId);
              console.log(`<@${userId}> has donated a save, and their role has been removed.`);

              // Send a confirmation message in the channel
              await channel.send(`<@${userId}> has donated a save and the \`Ruined it\` role has been removed.`);
            } else {
              console.log(`<@${userId}> does not have the role.`);
              await channel.send(`<@${userId}> does not have the role.`);
            }
          } else {
            console.log(`Could not find member with ID ${userId}.`);
            await channel.send("Could not find the member.");
          }
        }
      }
    }
  } catch (error) {
    console.error('An error occurred:', error);
    await interaction.reply("An error occurred while processing your request.");
  }


if (!interaction.guild && i === undefined) {
  console.log("Command is not in a guild and the command name is not shift");
  
  return interaction
    .reply({ content: "Command can only be executed in a discord server", ephemeral: true })
    .catch(() => {});
}

  // Slash Commands
  if (interaction.isChatInputCommand()) {
    await commandHandler.handleSlashCommand(interaction);
  }

  // Context Menu
  else if (interaction.isContextMenuCommand()) {
    const context = client.contextMenus.get(interaction.commandName);
    if (context) await contextHandler.handleContext(interaction, context);
    else return interaction.reply({ content: "An error has occurred", ephemeral: true }).catch(() => {});
  }

  

  else if (interaction.isButton()) {
    switch (interaction.customId) {
        case "TICKET_CREATE":
            return ticketHandler.handleTicketOpen(interaction);
        case "TICKET_CLOSE":
            return ticketHandler.handleTicketClose(interaction);
        case "SUGGEST_APPROVE":
            return suggestionHandler.handleApproveBtn(interaction);
        case "SUGGEST_REJECT":
            return suggestionHandler.handleRejectBtn(interaction);
        case "SUGGEST_DELETE":
            return suggestionHandler.handleDeleteBtn(interaction);
        case "TASK_CREATE":
            return taskHandler.handleTaskOpen(interaction);
        case "BOOST_PERKS":
            return serverInfo.handleBoostPerks(interaction);
        case "CATERING_INFO":
            return serverInfo.handleCateringInformation(interaction);
        case "ENTRE_INFO":
            return serverInfo.handleEntre(interaction);
        case "FAQ":
            return serverInfo.handleFAQ(interaction);
        case "LEVEL_PERKS":
            return serverInfo.handleLevelPerks(interaction);
        case "PARTNERSHIP_INFO":
            return serverInfo.handlePartnershipInfo(interaction);
        case "BUILDING_INFO":
            return serverInfo.handleBuildingInfo(interaction);
        case "SERVER_STAFF":
            return protocols.handleChart(interaction);
        case "HISTORY":
            return serverInfo.handleHistory(interaction);
        case "HOMEOWNERSHIP":
            return serverInfo.handleHomeOwner(interaction);
        case "NEIGHBORHOOD":
            return rules.handleNeighborhood(interaction);
        case "SERVER_RULES":
            return rules.handleServerRules(interaction);
        case "DELETE_CHANNEL":
            return taskHandler.deleteChannel(interaction);
        case "DELETE_REPORT":
            return taskHandler.deleteReport(interaction);
        case "shiftmanager":
            return proof.handleShift(interaction);
        case "fellowworker":
            return proof.handleWorker(interaction);
        case "users":
            return proof.handleUsers(interaction);
        case "group":
            return proof.handleGroup(interaction);
        case "double":
            return proof.handleDouble(interaction);
        case "send":
            return proof.handleSend(interaction);
        case "delete":
            return proof.handleDelete(interaction);
        case "one":
            return proof.number(interaction);
        case "PROTECT_SERVE":
            return protocols.handleProtectServe(interaction);
        case "POLICE_SLAP":
            return protocols.handlePoliceSlap(interaction);
        case "POLISH_SIDE":
            return protocols.handlePolishSide(interaction);
        case "SEND_PARTNER":
            return protocols.handleSendPartner(interaction);
        case "ANSWER_PARTNER":
            return protocols.handleAnswerPartner(interaction);
        case "PUNISHMENTS":
            return protocols.handleConsequences(interaction);
        case "HIERARCHY":
            return protocols.handleChart(interaction);
        case "SUBSCRIPTIONS":
            return protocols.handleSubscription(interaction);
        case "BUILD_GUIDE":
            return guide.handleBuildingGuide(interaction);
        case "CATERING_GUIDE":
            return guide.handleCaterGuide(interaction);
        case "ENTRE_GUIDE":
            return guide.handleEntreGuide(interaction);
        case "MANAGER_GUIDE":
            return guide.handleManagerGuide(interaction);
        case "startgame":
            return amongus.handleStart(interaction);
        case "pausegame":
            return amongus.handlePause(interaction);

        // Newly added cases
        case "oxygen-restore":
            return amongus.handleOxygenRestore(interaction);
        case "oxygen-sabotage":
            return amongus.handleOxygenSabotage(interaction);
        case "reactor-restore":
            return amongus.handleReactorRestore(interaction);
        case "reactor-sabotage":
            return amongus.handleReactorSabotage(interaction);
        case "deadbody":
            return amongus.handleDeadBody(interaction);
        case "lights-restore":
            return amongus.handleLightsRestore(interaction);
        case "lights-sabotage":
            return amongus.handleLightsSabotage(interaction);
        case "gameover-crew":
            return amongus.handleGameoverCrew(interaction);
        case "gameover-imp":
            return amongus.handleGameoverImp(interaction);
        case "announcement":
            return amongus.handleAnnouncement(interaction);
        case "clearhistory":
            return amongus.handleClear(interaction);
        case "alarm":
            return amongus.handleAlarm(interaction);
    }
}

  // Modals
  else if (interaction.type === InteractionType.ModalSubmit) {
    switch (interaction.customId) {
      case "SUGGEST_APPROVE_MODAL":
        return suggestionHandler.handleApproveModal(interaction);

      case "SUGGEST_REJECT_MODAL":
        return suggestionHandler.handleRejectModal(interaction);

      case "SUGGEST_DELETE_MODAL":
        return suggestionHandler.handleDeleteModal(interaction);
    }
  }
  const guild = interaction.guild ||  client.guilds.cache.get(require("../../../config").INTERACTIONS.TEST_GUILD_ID)
  const settings = await getSettings(guild) 

  // track stats
  if (settings.stats.enabled) statsHandler.trackInteractionStats(interaction).catch(() => {});
};
