const { EmbedBuilder } = require("discord.js");
const { EMBED_COLORS } = require("@root/config");
const { spawn } = require('child_process');
/**
 * @type {import("@structures/Command")}
 */

module.exports = {
  name: "reload",
  description: "Reloads the bot",
  category: "OWNER",
  botPermissions: [],
  command: {
    enabled: false,
    aliases: ["re"],
    usage: "[reload]",
    minArgsCount: 1
  },
  slashCommand: {
    enabled: true,
    ephemeral: true
  },
  async interactionRun(interaction) {
    const reloading = new EmbedBuilder().setColor(EMBED_COLORS.WARNING).setAuthor({name: interaction.client.user.username, iconURL: interaction.client.user.avatarURL({dynamic: true})}).setDescription(`Reloading ${interaction.client.user.username}'s commands...`).setTimestamp(Date.now());
    const success =  new EmbedBuilder().setColor(EMBED_COLORS.SUCCESS).setAuthor({name: interaction.client.user.username, iconURL: interaction.client.user.avatarURL({dynamic: true})}).setDescription(`${interaction.client.user.username}'s commands has been reloaded successfully!`).setTimestamp(Date.now());

    const reply = await interaction.followUp({embeds: [reloading]});
    interaction.client.commands = [];
    interaction.client.commandIndex.clear();
    interaction.client.slashCommands.clear();
    interaction.client.contextMenus.clear();
    interaction.client.loadContexts("src/contexts");
    interaction.client.loadCommands("src/commands");
    reply.edit({embeds: [success]});
    return;
  }
};