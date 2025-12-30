const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    StringSelectMenuBuilder,
    ComponentType,
    ModalBuilder,
    TextInputStyle,
    TextInputBuilder,
    UserSelectMenuBuilder,
  } = require("discord.js");
  const reviews = [
    {
        label: "Caterer Review",
        value: "caterer",
        description: "Review a caterer!",
        emoji: "1268596326812094616"
    },
    {
        label: "Moderator Review",
        value: "mod",
        description: "Review a moderator!",
        emoji: "1278269152376782890"
    },
    {
        label: "Shift Manager Review",
        value: "shiftmanager",
        description: "Review a shift manager!",
        emoji: "1275544243410174085"
    },
    {
        label: "Builder Review",
        value: "builder",
        description: "Review a builder!",
        emoji: "1278269440630456351"
    },
    {
        label: "Entrepreneur Review",
        value: "entrepreneur",
        description: "Review an entrepreneur!",
        emoji: "1278269473161347114"
    }
];
function getReviewByValue(value) {
    return reviews.find(review => review.value === value) || null;
}



const { EMBED_COLORS } = require("@root/config");
const User = require("../database/schemas/User");


  
  /**
   * @param {import("discord.js").ButtonInteraction} interaction
   */
  async function handleReview(interaction) {



    const menuRow = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
        .setCustomId("review-menu")
        .setPlaceholder("Select a role")
        .addOptions([{
                label: "Caterer Review",
                value: "caterer",
                description: "Review a cateter!",
                emoji: "1268596326812094616"
            },
            {
                label: "Moderator Review",
                value: "mod",
                description: "Review a moderator!",
                emoji: "1278269152376782890"
            },
            {
                label: "Shift Manager Review",
                value: "shiftmanager",
                description: "Review a shift manager!",
                emoji: "1275544243410174085"
            },
            {
                label: "Builder Review",
                value: "builder",
                description: "Review a builder!",
                emoji: "1278269440630456351"
            },
            {
                label: "Entrepreneur Review",
                value: "entrepreneur",
                description: "Review a entrepreneur!",
                emoji: "1278269473161347114"
            }
        ])
        .setMaxValues(1)
    );
    await interaction.deferReply({
        ephemeral: true
    })
    const message = await interaction.followUp({
        components: [menuRow],
        content: "What role do you want to review?",
        ephemeral: true,
        fetchReply: true
    })

    const collector = message.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        filter: (i) => i.customId === "review-menu" && i.user.id === interaction.user.id,
        time: 240_000,
    });

    collector.on("collect", async (i) => {
        await i.deferUpdate();
        if (!i.values.length) {
            await i.editReply({
                message,
                content: "You haven't picked anything!",
                components: []
            });
            return;
        }

        const value = i.values[0];
        const type = getReviewByValue(value);
        const label = type.label;
        const emoji = type.emoji;
        const description = type.description;

        const userRow = new ActionRowBuilder().addComponents(
            new UserSelectMenuBuilder()
            .setCustomId("user-menu")
            .setPlaceholder("Select a user")
            .setMaxValues(1)
        );

        const userMessage = await interaction.editReply({
            message,
            components: [userRow],
            content: "Who do you want to review?"
        })

        const userCollector = userMessage.createMessageComponentCollector({
            componentType: ComponentType.UserSelect,
            filter: (i) => i.customId === "user-menu" && i.user.id === interaction.user.id,
            time: 240_000,
        });

        userCollector.on("collect", async (m) => {
            await m.deferUpdate();
            if (!m.values.length) {
                await m.editReply({
                    userMessage,
                    content: "You haven't selected anyone!",
                    components: []
                });
                return;
            }

            const userValue = m.values[0];
            if (userValue == interaction.user.id) {
                await m.editReply({
                    userMessage,
                    content: "You cannot review yourself!",
                    components: []
                })
                return;
            }
            const user = interaction.guild.members.cache.get(userValue).user
            const sentMsg = await m.editReply({
                userMessage,
                content: "Click the button below to get started",
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder().setCustomId("fill_review").setLabel("Fill out form").setStyle(ButtonStyle.Primary)
                    ),
                ],
            });

            const btnInteraction = await interaction.channel
                .awaitMessageComponent({
                    componentType: ComponentType.Button,
                    filter: (b) => b.customId === "fill_review" && b.member.id === interaction.user.id,
                    time: 240_000,
                })
                .catch((ex) => {});

            if (!btnInteraction) return m.editReply({
                userMessage,
                content: "Cancelled",
                components: []
            });

            await btnInteraction.showModal(
                new ModalBuilder({
                    customId: "REVIEW_MODAL",
                    title: `Leave a ${label} for ${user.username}`,
                    components: [
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                            .setCustomId("rating")
                            .setLabel("Rating (Write 0-5 stars)")
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                            .setPlaceholder("Ex: 5 stars")
                        ),
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                            .setCustomId("comments")
                            .setLabel("Comments/Notes")
                            .setStyle(TextInputStyle.Paragraph)
                            .setRequired(false)
                            .setPlaceholder("Ex: They were super nice!")
                        ),
                    ],
                })
            );

            // receive modal input
            const modal = await btnInteraction
                .awaitModalSubmit({
                    time: 3 * 60 * 1000,
                    filter: (t) => t.customId === "REVIEW_MODAL" && t.member.id === interaction.user.id,
                })
                .catch((ex) => {});

            if (!modal) return m.editReply({
                userMessage,
                content: "No response received, cancelling",
                components: []
            });



            const rating = modal.fields.getTextInputValue("rating");
            const comment = modal.fields.getTextInputValue("comments") || "No comments/notes were left";


            const nostar = "<:nostar:1278261977214357515> ";
            const star = "<:BEEstarno:1278320040747466793>";

            function extractFirstDigit(inputString) {
                for (let char of inputString) {
                    if (/\d/.test(char)) {
                        return parseInt(char);
                    }
                }
                return "code"; // Return null if no digit is found
            }

            function getStars(number) {
                const maxStars = 5; // Assuming a 5-star rating system
                let result = "";

                for (let i = 0; i < maxStars; i++) {
                    if (i < number) {
                        result += star + " ";
                    } else {
                        result += nostar + " ";
                    }
                }

                return result.trim(); // Remove trailing space
            }

            const num = extractFirstDigit(rating)
            if (num == "code") {
                await m.editReply({
                    userMessage,
                    content: `Your rating is false! You rated:\n\`${rating}\`, it is supposed to be something like \`5 stars\``,
                    components: []
                })
                return;
            }
            if (Number(num) > 5) {
                await m.editReply({
                    userMessage,
                    content: `You cannot rate more than 5 stars! You rated:\n\`${rating}\``,
                    components: []
                })
                return;
            }

            const stars = getStars(num);

            const channelID = require("@root/config").REVIEWS.channelid;
            const channel = interaction.guild.channels.cache.get(channelID);
            if (!channel) {
                await m.editReply({
                    userMessage,
                    content: `Sorry, I couldn't find the review channel, contact a moderator!`,
                    components: []
                })
                return;
            }

            const embed = new EmbedBuilder().setColor(EMBED_COLORS.BOT_EMBED)
                .setTitle(`New ${label}!`)
                .setAuthor({
                    name: interaction.member.nickname || interaction.user.username,
                    iconURL: interaction.member.displayAvatarURL() || interaction.user.displayAvatarURL()
                })
                .setURL(`https://discord.com/users/${interaction.user.id}`)
                .addFields({
                    name: "Rating",
                    value: stars
                }, {
                    name: "Comments",
                    value: `\`\`\`${comment}\`\`\``
                })
                .setTimestamp()
                .setThumbnail(interaction.member.displayAvatarURL() || interaction.user.displayAvatarURL())
                .setFooter({
                    text: "Use the /review command to leave your own review",
                    iconURL: interaction.client.user.displayAvatarURL()
                });

            channel.send({
                content: `New review for <@${userValue}>`,
                embeds: [embed]
            })
            modal.reply({
                content: `Review sent!\n${rating}\n${comment}`,
                ephemeral: true
            }).catch((ex) => {});
            m.editReply({
                userMessage,
                content: "Done!",
                components: []
            });



        })

        userCollector.on("end", async collected => {
            if (!collected.size) {
                await interaction.editReply({
                    message: userMessage.id,
                    content: "Cancelled because you ignored me",
                    components: []
                })
            }
        })

    });

    collector.on('end', async collected => {
        if (!collected.size) {
            await interaction.editReply({
                message: message.id,
                content: "Cancelled because you ignored me",
                components: []
            })
        }
    });




    collector.on('collect', async i => {

        if (i.customId === 'yes') {
            let buttonsRowShift = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setStyle(ButtonStyle.Primary).setLabel("Shift Manager's Shift").setEmoji("1275544243410174085").setCustomId("shiftmanager").setDisabled(true),
                new ButtonBuilder().setStyle(ButtonStyle.Success).setLabel("Group Photo").setCustomId("group"),
                new ButtonBuilder().setStyle(ButtonStyle.Secondary).setLabel("Double XP").setCustomId("double"),
                new ButtonBuilder().setStyle(ButtonStyle.Primary).setLabel("Users").setCustomId("users").setEmoji("1275748042888183809"),
            );
            const embed = new EmbedBuilder().setColor(EMBED_COLORS.BOT_EMBED)
                .setTitle("Information")
                .addFields({
                    name: "Type",
                    value: `Shift Manager's Shift`
                }, {
                    name: "Users",
                    value: `${interaction.message.embeds[0].fields[1].value}`
                }, {
                    name: "Group Photo",
                    value: `${interaction.message.embeds[0].fields[2].value}`
                }, {
                    name: "Double XP",
                    value: `${interaction.message.embeds[0].fields[3].value}`
                }, )
                .setTimestamp();

            await i.deferUpdate();
            await interaction.editReply({
                embeds: [embed],
                components: [buttonsRowShift, senddelete]
            })
            await i.editReply({
                sentMessage,
                content: "Done!",
                components: []
            })
            collector.stop()


        } else if (i.customId === 'no') {

            await i.deferUpdate();
            await i.editReply({
                message,
                content: "Cancelled!",
                components: []
            })


            return;
        }

    });




}

/**
 * @param {import("discord.js").ButtonInteraction} interaction
 */
async function handleCatererReview(interaction) {
    await interaction.deferReply({ ephemeral: true });
    function extractNumbers(str) {
        const numbers = str.match(/\d+/g);
        return numbers ? numbers : [];
      }
  const userValue = extractNumbers(interaction.message.embeds[0].fields[0].value)[0]
  const client = extractNumbers(interaction.message.embeds[0].fields[1].value)[0]
      
  

  if(userValue == interaction.user.id) return interaction.followUp("You can't review yourself!")
    if(client !== interaction.user.id) return interaction.followUp("Only the customer can review!")

    

    const sentMsg = await interaction.followUp({
        content: "Click the button below to get started",
        components: [
            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("fill_review")
                    .setLabel("Fill out form")
                    .setStyle(ButtonStyle.Primary)
            ),
        ],
        ephemeral: true,
    });

    const btnInteraction = await interaction.channel
        .awaitMessageComponent({
            componentType: ComponentType.Button,
            filter: (b) => b.customId === "fill_review" && b.member.id === interaction.user.id,
            time: 240_000,
        })
        .catch(() => {});

    if (!btnInteraction) {
        return interaction.editReply({
            content: "Cancelled",
            components: [],
        });
    }

    await btnInteraction.showModal(
        new ModalBuilder({
            customId: "REVIEW_MODAL",
            title: `Leave a Caterer Review`,
            components: [
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId("rating")
                        .setLabel("Rating (Write 0-5 stars)")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                        .setPlaceholder("Ex: 5 stars")
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId("comments")
                        .setLabel("Comments/Notes")
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(false)
                        .setPlaceholder("Ex: They were super nice!")
                ),
            ],
        })
    );

    // Receive modal input
    const modal = await btnInteraction
        .awaitModalSubmit({
            time: 3 * 60 * 1000,
            filter: (t) => t.customId === "REVIEW_MODAL" && t.member.id === interaction.user.id,
        })
        .catch(() => {});

    if (!modal) {
        return interaction.editReply({
            content: "No response received, cancelling",
            components: [],
        });
    }

    const rating = modal.fields.getTextInputValue("rating");
    const comment = modal.fields.getTextInputValue("comments") || "No comments/notes were left";

    const nostar = "<:nostar:1278261977214357515> ";
    const star = "<:BEEstarno:1278320040747466793>";

    function extractFirstDigit(inputString) {
        for (let char of inputString) {
            if (/\d/.test(char)) {
                return parseInt(char);
            }
        }
        return "code";
    }

    function getStars(number) {
        const maxStars = 5;
        let result = "";

        for (let i = 0; i < maxStars; i++) {
            if (i < number) {
                result += star + " ";
            } else {
                result += nostar + " ";
            }
        }

        return result.trim();
    }

    const num = extractFirstDigit(rating);
    if (num == "code") {
        await modal.reply({
            content: `Your rating is invalid! You rated:\n\`${rating}\`, it should be something like \`5 stars\``,
            ephemeral: true
        });
        return;
    }
    if (Number(num) > 5) {
        await modal.reply({
            content: `You cannot rate more than 5 stars! You rated:\n\`${rating}\``,
            ephemeral: true
        });
        return;
    }

    const stars = getStars(num);

    const channelID = require("@root/config").REVIEWS.channelid;
    const channel = interaction.guild.channels.cache.get(channelID);
    if (!channel) {
        await modal.reply({
            content: `Sorry, I couldn't find the review channel, contact a moderator!`,
            ephemeral: true
        });
        return;
    }

    const embed = new EmbedBuilder().setColor(EMBED_COLORS.BOT_EMBED)
        .setTitle(`New Caterer Review!`)
        .addFields({
            name: "Rating",
            value: stars
        }, {
            name: "Comments",
            value: `\`\`\`${comment}\`\`\``
        })
        .setTimestamp()
        .setFooter({
            text: "Use the /review command to leave your own review",
            iconURL: interaction.client.user.displayAvatarURL()
        });

    channel.send({
        content: `New review for <@${userValue}>`,
        embeds: [embed]
    });

    modal.reply({
        content: `Review sent!\n${rating}\n${comment}`,
        ephemeral: true
    }).catch(() => {});

    await interaction.editReply({
        content: "Done!",
        components: []
    });
}


 

 



  module.exports = {
    handleReview,
    handleCatererReview
  };
  