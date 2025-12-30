const { EmbedBuilder, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const { getUser } = require("@schemas/User");
const { EMBED_COLORS, ECONOMY } = require("@root/config.js");
const { getRandomInt } = require("@helpers/Utils");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "blackjack",
  description: "play a game of blackjack",
  category: "ECONOMY",
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: false,
    usage: "<amount>",
    minArgsCount: 1,
    aliases: ["bj"],
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "coins",
        description: "number of coins to bet",
        required: true,
        type: ApplicationCommandOptionType.Integer,
      },
    ],
  },

  async interactionRun(interaction) {
    const betAmount = interaction.options.getInteger("coins");
    const response = await startBlackjack(interaction, betAmount);
    if(response) await interaction.followUp(response);
  },
};

function drawCard() {
  const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const suits = ["♠", "♥", "♣", "♦"];
  const value = values[getRandomInt(values.length)];
  const suit = suits[getRandomInt(suits.length)];
  return { value, suit };
}

function calculateHandValue(hand) {
  let value = 0;
  let aces = 0;

  hand.forEach((card) => {
    if (["J", "Q", "K"].includes(card.value)) {
      value += 10;
    } else if (card.value === "A") {
      aces += 1;
      value += 11;
    } else {
      value += parseInt(card.value);
    }
  });

  while (value > 21 && aces) {
    value -= 10;
    aces -= 1;
  }

  return value;
}

async function startBlackjack(interaction, betAmount) {
  if (isNaN(betAmount)) return "Bet amount needs to be a valid number input";
  if (betAmount < 0) return "Bet amount cannot be negative";
  if (betAmount < 10) return "Bet amount cannot be less than 10";

  const userDb = await getUser(interaction.user);
  if (userDb.coins < betAmount)
    return `You do not have sufficient coins to bet!\n**Coin balance:** ${userDb.coins || 0}${ECONOMY.CURRENCY}`;

  let playerHand = [drawCard(), drawCard()];
  let dealerHand = [drawCard(), drawCard()];

  const playerValue = calculateHandValue(playerHand);
  const dealerVisibleValue = calculateHandValue([dealerHand[0]]);

  const embed = new EmbedBuilder()
  .setColor(EMBED_COLORS.BOT_EMBED)
    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
    .setDescription(`**Your Hand:** ${formatHand(playerHand)} (\`${playerValue}\`)\n**Dealer's Hand:** ${dealerHand[0].value}${dealerHand[0].suit} ?? (\`${dealerVisibleValue}\`)`);

  let buttonsRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("hit").setLabel("Hit").setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId("stand").setLabel("Stand").setStyle(ButtonStyle.Primary)
  );

  const message = await interaction.followUp({
    embeds: [embed],
    components: [buttonsRow],
  });

  const collector = message.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 120_000,
  });

  collector.on('collect', async (i) => {
    if (i.user.id !== interaction.user.id) return;

    if (i.customId === "hit") {
      playerHand.push(drawCard());
      const playerValue = calculateHandValue(playerHand);

      if (playerValue > 21) {
        collector.stop("bust");
      } else {
        const updatedEmbed = new EmbedBuilder()
        .setColor(EMBED_COLORS.BOT_EMBED)
          .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
          .setDescription(`**Your Hand:** ${formatHand(playerHand)} (\`${playerValue}\`)\n**Dealer's Hand:** ${dealerHand[0].value}${dealerHand[0].suit} ?? (\`${dealerVisibleValue}\`)`);

        await i.update({ embeds: [updatedEmbed], components: [buttonsRow] });
      }
    } else if (i.customId === "stand") {
      collector.stop("stand");
    }
  });

  collector.on('end', async (_, reason) => {
    let resultMessage = "";
    let dealerValue = calculateHandValue(dealerHand);
    const playerValue = calculateHandValue(playerHand);
    await message.edit({
        components: []
    })
    if (reason === "bust") {
      resultMessage = `You busted with a hand of ${formatHand(playerHand)} (\`${playerValue}\`)! You lost ${betAmount}${ECONOMY.CURRENCY}.`;
      userDb.coins -= betAmount;
    } else {
      while (dealerValue < 17) {
        dealerHand.push(drawCard());
        dealerValue = calculateHandValue(dealerHand);
      }

      if (dealerValue > 21 || playerValue > dealerValue) {
        resultMessage = `You win with ${formatHand(playerHand)} (\`${playerValue}\`) against the dealer's ${formatHand(dealerHand)} (\`${dealerValue}\`)! You won ${betAmount * 2}${ECONOMY.CURRENCY}.`;
        userDb.coins += betAmount;
      } else if (playerValue === dealerValue) {
        resultMessage = `It's a draw! You both have ${playerValue}. You get your bet back.`;
      } else {
        resultMessage = `You lost with ${formatHand(playerHand)} (\`${playerValue}\`) against the dealer's ${formatHand(dealerHand)} (\`${dealerValue}\`). You lost ${betAmount}${ECONOMY.CURRENCY}.`;
        userDb.coins -= betAmount;
      }
    }

    await userDb.save();

    const resultEmbed = new EmbedBuilder()
      .setColor(EMBED_COLORS.BOT_EMBED)
      .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
      .setDescription(resultMessage)
      .setFooter({ text: `Updated Wallet balance: ${userDb.coins}${ECONOMY.CURRENCY}` });

    

    await message.edit({ embeds: [resultEmbed] });
  });
}

function formatHand(hand) {
  return hand.map(card => `${card.value}${card.suit}`).join(" ");
}
