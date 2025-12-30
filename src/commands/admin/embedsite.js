const {
    ApplicationCommandOptionType,
    ChannelType,
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    EmbedBuilder,
    ApplicationCommand,
  } = require("discord.js");

const Guild = require("@root/src/database/schemas/Guild");
  
  /**
   * @type {import("@structures/Command")}
   */
  module.exports = {
    name: "embedsite",
    description: "send embed message, get JSON from the site",
    category: "ADMIN",
    userPermissions: ["ManageMessages"],
    command: {
      enabled: false,
      usage: "<#channel>",
      minArgsCount: 1,
      aliases: ["say"],
    },
    slashCommand: {
      enabled: true,
      ephemeral: true,
      options: [
        { type: ApplicationCommandOptionType.String, name: "json", description: "JSON input for embed creation", required: false },
        { type: ApplicationCommandOptionType.Channel, name: "channel", description: "Where should the embed be sent?", required: false, channelTypes: [ChannelType.GuildText] },
    ]
    },
  
 
  
    async interactionRun(interaction) {
        const json = interaction.options.getString("json")
        if(!json){
            return interaction.followUp({
                content: `Hey! Want to create an embed? Get a JSON Code from [this site](<https://ara4r4.github.io/discordEmbedMaker/>) and use it here!`,

            })
        }
        const channel = interaction.options.getChannel("channel") || interaction.channel;
        if(channel && channel.type !== 0){
            return interaction.followUp({
                content: `Make sure the selected channel is a text channel`,
            })
        }

        const embedData = JSON.parse(json);

        const embed = new EmbedBuilder();

        

        if (embedData.embeds && embedData.embeds.length > 0) {
            const firstEmbed = embedData.embeds[0];

            if (firstEmbed.title) {
                embed.setTitle(firstEmbed.title);
            }

            if (firstEmbed.description) {
                embed.setDescription(firstEmbed.description);
            }

            if (firstEmbed.color) {
                embed.setColor(firstEmbed.color);
            }

            if (firstEmbed.timestamp) {
                embed.setTimestamp(new Date(firstEmbed.timestamp));
            }

            if (firstEmbed.url) {
                embed.setURL(firstEmbed.url);
            }

            if (firstEmbed.author) {
                embed.setAuthor({
                    name: firstEmbed.author.name,
                    iconURL: firstEmbed.author.icon_url,
                    url: firstEmbed.author.url
                });
            }

            if (firstEmbed.thumbnail && firstEmbed.thumbnail.url) {
                embed.setThumbnail(firstEmbed.thumbnail.url);
            }

            if (firstEmbed.image && firstEmbed.image.url) {
                embed.setImage(firstEmbed.image.url);
            }

            if (firstEmbed.footer && firstEmbed.footer.text) {
                embed.setFooter({
                    text: firstEmbed.footer.text,
                    iconURL: firstEmbed.footer.icon_url
                });
            }

            if (firstEmbed.fields && firstEmbed.fields.length > 0) {
                firstEmbed.fields.forEach(field => {
                    embed.addFields({
                        name: field.name,
                        value: field.value,
                        inline: field.inline || false
                    });
                });
            }
        
        if (embedData.content) {
            if(firstEmbed.title){
                channel.safeSend({ content: embedData.content, embeds: [embed] });
                interaction.followUp({
                    content: "Successfully sent embed"
                })
                return;
            }
               interaction.followUp({
                    content: "Successfully sent message"
                })
            return channel.safeSend({ content: embedData.content });
        }else{
            if(firstEmbed.title){
                   interaction.followUp({
                    content: "Successfully sent embed"
                })
                channel.send({ embeds: [embed] });
            }else{
                return interaction.followUp({
                    content: "You need to bring me a JSON with title filled out for the embed to work"
                })
            }
        }
    }
    },
  };
  