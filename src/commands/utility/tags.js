const { ApplicationCommandOptionType, EmbedBuilder, ButtonStyle, ButtonBuilder, ButtonInteraction, ButtonComponent, ActionRowBuilder, ComponentType } = require("discord.js");
const { getUser } = require("@schemas/User");
const { parse } = require("path");
const EMBED_COLORS = require("@root/config").EMBED_COLORS

const choices = [
    {
        name: "Boosting Perks",
        value: "boostingPerks"
    },
    {
        name: "Catering Info",
        value: "cateringInfo"
    },
    {
        name: "Entrepreneurship Info",
        value: "entrepreneurshipInfo"
    },
    {
        name: "FAQ",
        value: "faq"
    },
    {
        name: "Homeownership Info",
        value: "homeownershipInfo"
    },
    {
        name: "Level Perks",
        value: "levelPerks"
    },
    {
        name: "Partnership Info",
        value: "partnershipInfo"
    },
    {
        name: "Server Staff",
        value: "serverStaff"
    },
    {
        name: "Get Support",
        value: "getSupport"
    }
]
/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "tags",
  description: "used to show members server info",
  category: "UTILITY",
  command: {
    enabled: false,
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
            {
                name: "message",
                description: "the message to reply to, message id/link",
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: "tag",
                description: "what part of the server info should they read?",
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: choices
            },
            {
              name: "channel",
              description: "the channel the message was sent in",
              type: ApplicationCommandOptionType.Channel,
              required: false,
            },
            
          
    ],
  },
  
  async interactionRun(interaction, data) {
    if(interaction.member.permissions.has("CreateEvents") == false) return interaction.followUp("You cannot use this command!")
    
    function getNameByValue(value) {
        const item = choices.find(choice => choice.value === value);
        return item ? item.name : 'Name not found';
    }
   const messageInput = interaction.options.getString("message")
 
   const channel = interaction.options.getChannel("channel") || interaction.channel;
   let messageID;
   const tag = interaction.options.getString("tag")
   if (/^\d+$/.test(messageInput)) {
     messageID = messageInput
} else {
    const getLastSegment = (url) => {
        const segments = url.split('/');
        return segments.pop();
    }
    
     messageID = getLastSegment(messageInput)
}



channel.messages.fetch(messageID)
.then((message) => {

const name = getNameByValue(tag)
    message.reply({
        content: `Hey there! You might find your answer in the \`${name}\` button in <#1267959190337618022>!`,
        allowedMentions: {
            parse: ["users", "everyone", "roles"],
            repliedUser: true
        }
    })
    return interaction.followUp(`Done!`)
})
.catch(() => {
    return interaction.followUp("You need to provide a correct message ID/Link\n\n**Tip: If the message you are trying to reply to is in a different channel from the channel you are running this command on, fill in the channel option when running the command**")
})

  


  }}

  