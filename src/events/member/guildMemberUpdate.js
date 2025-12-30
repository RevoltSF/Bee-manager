const config = require("@root/config").BOOST;
const colorHex = "068ADD"; // Hexadecimal color code

// Ensure the hex code starts with 0x for parsing to work correctly
const embedColor = parseInt(colorHex, 16); // Convert to decimal

/**
 * @param {import('@src/structures').BotClient} client
 * @param {import('discord.js').GuildMember|import('discord.js').PartialGuildMember} member
 */
module.exports = async (client, oldMember, newMember) => {
 
 
    if(newMember.guild.id !== "1256349528190222386") {
        return
    }
    if (!oldMember.premiumSince && newMember.premiumSince) {
      const guild = client.guilds.cache.get("1256349528190222386")
      const channel = guild.channels.cache.get("1268594712919412787")
      channel.edit({
        name: `Boosts: ${guild.premiumSubscriptionCount}`
      })
    }
    const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
	if (addedRoles.size > 0) {
		const roles = addedRoles.map(r => r.id)
        const ig = require("@root/config").CUSTOM.SHIFT_MANAGER
        const idididoftherole = require("@root/config").CUSTOM.NEW_ROLE
        if(roles.includes(ig)) {
            const channel = newMember.guild.channels.cache.get(require("@root/config").SHIFTS.CHANNELPING)
            if (!channel) return console.log("I couldn't find that channel!");
                const m = await channel.send(`<@${newMember.id}>`)
                m.delete()
                newMember.roles.remove(idididoftherole)

                setTimeout(async () => {
                const refreshedMember = await newMember.guild.members.fetch(newMember.id);
                if (refreshedMember.roles.cache.has(idididoftherole)) {
                    await refreshedMember.roles.remove(idididoftherole).catch(console.error);
                    console.log(`Removed 'New Bee' again from ${refreshedMember.user.tag} after re-addition.`);
                }
            }, 2000);
        }
	}

    if (config.STATUS) {
        const channel = newMember.guild.channels.cache.get(config.CHANNELID);
        if (!channel) return console.log("I couldn't find that channel!");

        const contentNotEdited = config.CONTENT;

        function replacePlaceholders(content, newMember) {
            const replacements = {
                '{member:mention}': `<@${newMember.id}>`,
                '{member:username}': newMember.user.username,
                '{member:tag}': newMember.user.tag,
                '{member:id}': newMember.id,
                '{server}': newMember.guild.name,
                '{server:count}': newMember.guild.memberCount,
                '{server:boosts}': newMember.guild.premiumSubscriptionCount,
                '{server:level}': newMember.guild.premiumTier,
                '{server:icon}': newMember.guild.iconURL() || 'No icon available',
                '{server:banner}': newMember.guild.bannerURL() || newMember.guild.iconURL() || 'No banner available',
                '{member:profilePicture}': newMember.user.displayAvatarURL()
            };

            return content.replace(/{member:mention}|{member:username}|{member:tag}|{member:id}|{server}|{server:count}|{server:boosts}|{server:level}|{server:icon}|{server:banner}|{member:profilePicture}/g, match => replacements[match]);
        }

        const customizedContent = replacePlaceholders(contentNotEdited, newMember);
        
        // Replace placeholders in embed fields as well
        const embedTitle = replacePlaceholders(config.EMBED_TITLE, newMember);
        const embedDescription = replacePlaceholders(config.EMBED_DESCRIPTION, newMember);
        const embedFooterText = replacePlaceholders(config.EMBED_FOOTER, newMember);
        const embedFooterIcon = replacePlaceholders(config.EMBED_FOOTER_ICON, newMember);
        const embedThumbnail = replacePlaceholders(config.EMBED_THUMBNAIL, newMember);
        const embedImage = replacePlaceholders(config.EMBED_IMAGE, newMember);

        // Check if any embed content is provided
        const isEmbedEmpty = !embedTitle && !embedDescription && !embedFooterText && !embedThumbnail && !embedImage;

        if (!oldMember.premiumSince && newMember.premiumSince) {
            const messagePayload = {
                content: customizedContent,
            };

            if (!isEmbedEmpty) {
                const embed = {
                    title: embedTitle || undefined,
                    description: embedDescription || undefined,
                    footer: embedFooterText ? { text: embedFooterText, icon_url: embedFooterIcon } : undefined,
                    thumbnail: embedThumbnail ? { url: embedThumbnail } : undefined,
                    image: embedImage ? { url: embedImage } : undefined,
                    timestamp: config.EMBED_TIMESTAMP ? new Date() : undefined,
                    color: embedColor
                };

                messagePayload.embeds = [embed];
            }

            const roleID = config.ROLEID;
            if(roleID !== ""){
                const role = newMember.guild.roles.cache.get(roleID);
                if(!role) return console.log("Wrong role ID!");
                newMember.roles.add(role);
            }
            return channel.send(messagePayload);
        }
    }
};
