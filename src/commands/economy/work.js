const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require("discord.js");
const { getUser } = require("@schemas/User");
const { EMBED_COLORS, ECONOMY } = require("@root/config.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "work",
  description: "choose a job and work to earn money",
  category: "ECONOMY",
  cooldown: 3600,
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: false,
  },
  slashCommand: {
    enabled: true,
  },

  async interactionRun(interaction) {
    const jobsMenu = ECONOMY.JOBS.map((job) => ({
      label: job.label,
      value: job.value,
      description: job.description,
      emoji: job.emoji,
    }));

    const menuRow = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("jobs-menu")
        .setPlaceholder("Choose a job")
        .addOptions(jobsMenu)
        .setMaxValues(1)
    );

    const message = await interaction.followUp({
      content: "Select a job to work:",
      components: [menuRow],
    });

    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      filter: (i) => i.customId === "jobs-menu" && i.user.id === interaction.user.id,
      time: 240_000, // 4 minutes
    });

    collector.on("collect", async (m) => {
      if (!m.values.length) {
        return m.reply({
          content: "You have not picked any options!",
          ephemeral: true,
        });
      }

      const jobSelected = ECONOMY.JOBS.find((job) => job.value === m.values[0]);
      if (!jobSelected) {
        return m.reply({
          content: "Invalid job selection!",
          ephemeral: true,
        });
      }

      const amount = Math.floor(Math.random() * (ECONOMY.MAX_WORK_AMOUNT - ECONOMY.MIN_WORK_AMOUNT + 1)) + ECONOMY.MIN_WORK_AMOUNT;
      const userDb = await getUser(m.user);
      userDb.coins += amount;
      await userDb.save();

      const embed = new EmbedBuilder()
        .setColor(EMBED_COLORS.BOT_EMBED)
        .setAuthor({ name: `${m.user.username}`, iconURL: m.user.displayAvatarURL() })
        .setDescription(
          `You worked as a ${jobSelected.label} and earned **${amount}** ${ECONOMY.CURRENCY}!\n` +
          `**Updated Balance:** **${userDb.coins}** ${ECONOMY.CURRENCY}`
        );

      await m.reply({ embeds: [embed] }).catch(async () => {
        await interaction.followUp({ embeds: [embed] });
      });

      collector.stop();
    });
  },
};
