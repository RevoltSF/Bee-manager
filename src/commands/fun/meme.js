const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const fetch = require("node-fetch");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "meme",
  description: "Get a random meme",
  category: "FUN",
  botPermissions: ["EmbedLinks"],
  cooldown: 20,
  command: {
    enabled: false,
    usage: "[category]",
  },
  slashCommand: {
    enabled: true,
  },

  async interactionRun(interaction) {
    fetch(`https://www.reddit.com/r/memes.json?sort=top&t=week&limit=100`)
      .then((res) => res.json())
      .then(async (json) => {
        let i = Math.floor(Math.random() * json.data.children.length);
        let image = json.data.children[i].data.url;
        let caption = json.data.children[i].data.title;
        let embed = new EmbedBuilder()
          .setTitle(caption)
          .setImage(image)
          .setColor(require("@root/config").EMBED_COLORS.BOT_EMBED)
          .setFooter({
            text: `👍 ${json.data.children[i].data.ups} | 💬 ${json.data.children[i].data.num_comments}`,
          });

        let buttonsRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("new")
            .setStyle(ButtonStyle.Primary)
            .setLabel("New Meme")
            .setEmoji("🔄")
        );

        const message = await interaction.followUp({
          embeds: [embed],
          components: [buttonsRow],
        });

        const filter = (i) => i.user.id === interaction.user.id;
        let memeCount = 1;

        const collector = message.createMessageComponentCollector({
          filter,
          time: 120_000,
          max: 10, 
        });

        collector.on("collect", async (reply) => {
          if (reply.customId === "new" && memeCount < 10) {
            memeCount++;
            let newIndex = Math.floor(Math.random() * json.data.children.length);
            let newImage = json.data.children[newIndex].data.url;
            let newCaption = json.data.children[newIndex].data.title;
            let newEmbed = new EmbedBuilder()
              .setTitle(newCaption)
              .setImage(newImage)
              .setColor(require("@root/config").EMBED_COLORS.BOT_EMBED)
              .setFooter({
                text: `👍 ${json.data.children[newIndex].data.ups} | 💬 ${json.data.children[newIndex].data.num_comments}`,
              });

            let newButtonsRow = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("new")
                .setStyle(ButtonStyle.Primary)
                .setLabel("New Meme")
                .setEmoji("🔄")
            );

            await reply.update({
              embeds: [newEmbed],
              components: [newButtonsRow],
            });
          } else {
            await reply.update({
              content: "You have reached the limit of 10 memes.",
              components: [],

            });
          }
        });

        collector.on("end", (collected, reason) => {
          if (reason === "time") {
            message.edit({ components: [] });
          }
        });
      })
      .catch((error) => {
        console.error(error);
        interaction.followUp({
          content: "An error occurred. Please try again later.",
        });
      });
  },
};
