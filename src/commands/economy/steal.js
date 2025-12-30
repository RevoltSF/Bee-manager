const { EmbedBuilder } = require("discord.js");
const { getUser } = require("@schemas/User");
const { EMBED_COLORS, ECONOMY } = require("@root/config.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "steal",
  description: "steal from someone",
  category: "ECONOMY",
  cooldown: 300,
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: false,
  },
  slashCommand: {
    enabled: true,
  },

 

  async interactionRun(interaction) {
    const response = await steal(interaction.user);
    await interaction.followUp(response);
  },
};

async function steal(user) {
    let users = [
      "PewDiePie",
      "T-Series",
      "Sans",
      "RLX",
      "Pro Gamer 711",
      "Zenitsu",
      "Jake Paul",
      "Kaneki Ken",
      "KSI",
      "Naruto",
      "Mr. Beast",
      "Ur Mom",
      "A Broke Person",
      "Giyu Tomiaka",
      "Bejing Embassy",
      "A Random Asian Mom",
      "Ur Step Sis",
      "Jin Mori",
      "Sakura (AKA Trash Can)",
      "Hammy The Hamster",
      "Kakashi Sensei",
      "Minato",
      "Tanjiro",
      "ZHC",
      "The IRS",
      "Joe Mama",
    ];
  
    let result = Math.floor(Math.random() * 3); // 0: caught, 1: no money, 2: success
    let amount = 0;
    let message = "";
    const userDb = await getUser(user);
    
    if (result === 0) {
      amount = Math.floor(Math.random() * `${ECONOMY.MAX_STEAL_PENALTY}` + `${ECONOMY.MIN_STEAL_PENALTY}`);
      userDb.coins -= amount;
      message = `**${users[Math.floor(Math.random() * users.length)]}** caught you and you lost **${amount}** ${ECONOMY.CURRENCY}`;
    } else if (result === 1) {
      message = `**${users[Math.floor(Math.random() * users.length)]}** didn't have any money for you to steal.`;
    } else {
      amount = Math.floor(Math.random() * `${ECONOMY.MAX_STEAL_AMOUNT}` + `${ECONOMY.MIN_STEAL_AMOUNT}`);
      userDb.coins += amount;
      message = `You successfully stole **${amount}** ${ECONOMY.CURRENCY} from **${users[Math.floor(Math.random() * users.length)]}**`;
    }
  
    await userDb.save();
  
    const embed = new EmbedBuilder()
      .setColor(EMBED_COLORS.BOT_EMBED)
      .setAuthor({ name: `${user.username}`, iconURL: user.displayAvatarURL() })
      .setDescription(
        `${message}\n**Updated Balance:** **${userDb.coins}** ${ECONOMY.CURRENCY}`
      );
  
    return { embeds: [embed] };
  }
  
