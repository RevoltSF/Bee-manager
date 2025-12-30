const { inviteHandler, greetingHandler } = require("@src/handlers");
const { getSettings } = require("@schemas/Guild");
const { EmbedBuilder} = require("discord.js")

/**
 * @param {import('@src/structures').BotClient} client
 * @param {import('discord.js').GuildMember|import('discord.js').PartialGuildMember} member
 */
module.exports = async (client, member) => {
  if (member.partial) await member.user.fetch();
  if (!member.guild) return;

  const { guild } = member;
  const settings = await getSettings(guild);

  // Check for counter channel
  if (settings.counters.find((doc) => ["MEMBERS", "BOTS", "USERS"].includes(doc.counter_type.toUpperCase()))) {
    if (member.user.bot) {
      settings.data.bots -= 1;
      await settings.save();
    }
    if (!client.counterUpdateQueue.includes(guild.id)) client.counterUpdateQueue.push(guild.id);
  }

  // Invite Tracker
  const inviterData = await inviteHandler.trackLeftMember(guild, member.user);

  // Farewell message
  greetingHandler.sendFarewell(member, inviterData);


  const roles = member.roles.cache.map(role => role.id);
  if (roles.includes("1267959007314841724")) {
    const partnerdb = member.client.partnerdatabase.get("partners") || [];

    // Match partner by representative ID
    const partnerEntry = partnerdb.find(p => p.representative === member.id);

    const serverName = partnerEntry?.serverName || "Unknown Server";
    const ourRep = partnerEntry?.ourRep ? `<@${partnerEntry.ourRep}>` : "Unknown";
    const link = partnerEntry?.link || "Not Provided";
    const partneredAt = partnerEntry?.partneredAt
      ? `<t:${partnerEntry.partneredAt}:D>`
      : "Unknown";
    const follow = partnerEntry?.follow || "Not Specified";

    const embed = new EmbedBuilder()
      .setColor(require("@root/config").EMBED_COLORS.BOT_EMBED)
      .setTitle("A Partner Rep Just Left")
      .setDescription(`<@${member.id}>`)
      .addFields(
        { name: "Server Name", value: serverName },
        { name: "Our Representative", value: ourRep },
        { name: "Server Link", value: link },
        { name: "Became Partners On", value: partneredAt },
        { name: "Followed In", value: follow },
        { name: "Username", value: member.user.username, inline: true },
        { name: "User ID", value: member.id, inline: true },
        {
          name: "Member Since",
          value: `<t:${Math.floor(member.joinedAt / 1000)}:F>`,
          inline: true
        }
      )
      .setTimestamp()
      .setFooter({
        text: "The mention may not work",
        iconURL: member.guild.iconURL()
      })
      .setAuthor({
        name: member.user.username,
        iconURL: member.user.displayAvatarURL()
      });

    const channel = member.client.channels.cache.get("1389842365329575956");
    if (channel?.isThread) {
      if (channel.archived) {
        await channel.setArchived(false);
      }
      
      await channel.send({
        embeds: [embed],
        content: `<@&1379872877326893087>` // Partner alert role ping
      });
    }
  }
};
