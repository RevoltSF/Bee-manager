const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    StringSelectMenuBuilder,
    ComponentType,
  } = require("discord.js");
const embed = require("../commands/admin/embed");

const color = require("@root/config").EMBED_COLORS.BOT_EMBED
  
  /**
   * @param {import("discord.js").ButtonInteraction} interaction
   */
   async function handleNeighborhood(interaction){
    await interaction.deferReply({ ephemeral: true });
    
    const embed = new EmbedBuilder().setColor(color)
    .setThumbnail(interaction.guild.iconURL())
 
    .setTitle("<:BEEroblox:1269142828190011423> **Neighborhood Agreements**")
    .setDescription(`### Agreement A: Only use official Neighborhoods.
> * You can find the code in <#1267959203486502963> 
> * If you are not cooperating with your coworkers, you might get banned from the neighborhood.
> * If there are any issues, take screenshots to support your request to have someone removed.

### Agreement B: Whoever pinged for the shift is the Host, or Shift Lead.
> * The Shift Lead encourages fun & friendliness, settles differences, manages mood breaks, and starts a family at Blox Burger in case people go AFK in their position and slow down efficiency.
> * Shift Managers & Moderators may pop in to check that everything's okay or join to make money, but the Pinger is still the Host.

### Agreement C: Listen to your Shift Lead and join their Family.
> * They can ping the server owner and have you kicked for insubordination.
> **Agreement C.ii:** Family is only required for Blox Burger.
> <:BEEwarn:1268469054931210291> It is advised that you adjust your Permission Settings (Found in the House > Permissions & Family menu) to protect your investments in one of two ways:
> 1️⃣  Turn off Content Access under Food for Roommates, and/or
> 2️⃣ Change the Default Family Permission to Guest
> * Food theft can be hard to prove, but if it is proven, this is an immediate neighborhood ban.

### Agreement D: If you need to go AFK, leave your position.
> Especially at Blox Burger. Sit in the lobby, step away from a register or dance on the dishwasher to keep the workplace clear.

### Agreement E: You're responsible for your friend's behavior.
> * Friends are welcome to join even if they're not in this server, but make them aware of the Agreements. You will be held accountable for their actions.

### Agreement F: Work together, or apart.
> * If your work ethic (or internet connection) is slowing down the team, they can vote in whisper to your shift lead to send you to another job.
>  * Please comply when asked or see Agreement C.

### Agreement G: No big plots.
> * If your plot causes lag for other players, you will need to remove it, or other workers can vote privately to request that your shift lead remove you.

### Agreement H: Adhere to the Roblox ToS

=============================

⛔ Repercussions ⛔
> 3 reminders, 4th reminder of any rule will result in ban from the neighborhoods. You will need to open a ticket to have it removed.`)

  await interaction.editReply({
   embeds: [embed]});
  }

async function handleServerRules(interaction){
    await interaction.deferReply({ ephemeral: true });
    const embed = new EmbedBuilder().setColor(color)
    .setThumbnail(interaction.guild.iconURL())
 
    .setTitle("<:BEEdizzy:1269142832682111006> **Server Rules**")
    .setDescription(`These rules cover all communications whether in public, in private, in-game, or in a voice channel to maintain a wholesome community and safe space. Your profile picture, status, username, nickname, bio (and its links), and external emotes/stickers/sounds must also adhere. These rules are subject to change.
`)
    .addFields (
        {name: '**Rule 1: Abide by Discord & Roblox ToS & Guidelines**', value: `> * Discord's [ToS](https://discord.com/terms) & [Guidelines](https://discord.com/guidelines) boil down to: __Respect Each Other, Respect Discord, Obey The Law.__ This also means you must be 13+ even if Roblox is for all ages.
> * Roblox's [ToS](https://en.help.roblox.com/hc/en-us/articles/115004647846-Roblox-Terms-of-Use) and [community standards](https://en.help.roblox.com/hc/en-us/articles/203313410-Roblox-Community-Standards) are essentially: __Be Safe, Be Civil, Be Ethical__.
> * Mayor Tom's [Guidelines for Bloxburgers](https://static.wikia.nocookie.net/25bd076c-a0cc-4fa1-8357-158018ea6429/scale-to-width/755) agree with all that by asking us to __be Friendly & Responsible.__
<:blank:1278554259050205287>`},
        {name: `Rule 2: Keep it PG-13. We are SFW.`, value: `> * We do not allow any NSFW content here. This content includes excessive profanity, graphic violence, pornography, nudity, slurs, or other potentially disturbing subject matter.
<:blank:1278554259050205287>`},
        {name: `Rule 3: Don't be annoying or hurtful.`, value: `> This is a reiteration of Rule 1 for those who have trouble with long text.
> * No trolling, spamming, instigating, or spreading hate.
> * No slurs, drama, excessive teasing, toxicity, extremism, politicism.
> * Threats, violence, drama, ban-evading, impersonation, sharing personal information, doxxing, excessive pings or suspicious links is not allowed!
<:blank:1278554259050205287>`},
        {name: `Rule 4: Avoid sensitive topics.`, value: `> * Bloxburg is designed to be a clean & stress-free simulation of real life. We follow suit. Let's leave any religious, political or any controversial topics/arguments for another community. 
> * If you have nowhere else to vent, <#1267959229633790096> may be an exception BUT discussions must include a trigger warning tag, remain respectful and may not escalate into arguments/insults or be discussed outside of that post.
<:blank:1278554259050205287>`},
        {name: `Rule 5: Be original.`, value: `> * Do not copy any content from this server for your own use. It is disrespectful to both your creativity and ours.
> * This includes the server name, logos, and any media created specifically for this server. 
> * We retain the legal rights to the bot "Bee Manager"; unauthorized use will result in potential consequences. 
> * If you are found using our server's name or logos on Discord without permission, you will be ousted, banned and reported.
<:blank:1278554259050205287>`},
        {name: `Rule 6: Don't advertise Discord servers.`, value: `> * **Rule 6a:** Bloxburg RP businesses that have open job positions can be posted in ⁠<#1267959234633666641> as per its guidelines.
> * **Rule 6b:** Hinting about your Discord server, requesting DMs, messaging our members, pointing to a link in your profile is all considered advertising and against this rule.
> * If you made a Roblox game, YouTube channel, or Twitch stream, you may post it in your introduction thread so long as its content abides by the rules.
> * **Info:** If you want to partner with us, read <#1267959190337618022>.
<:blank:1278554259050205287>`},
        {name: `Rule 7: File reports, don't mini-mod.`, value: `> * When someone is breaking the rules in any of our channels, don't make a big fuss about it in the channel to make it a bigger deal, instead open a ticket in <#1267959190337618022>.
> * If the case is **very urgent**, then you may ping <@&1268995995375505458>.
<:blank:1278554259050205287>`},
        {name: `Rule 8: Do not DM Mods.`, value: `> * Any business having to do with this server should be handled in a ticket opened in <#1267959190337618022> or <#1276572413970092082> so that the next available moderator can get to you as soon as possible. DMing one moderator may slow down you getting your response.
<:blank:1278554259050205287>`},
        {name: `Rule 9: Show up.`, value: `> * **Rule 9a:** React to shift pings and events honestly. If you say you can work or attend the event, join in a timely manner. Don't be a flake.
> * **Rule 9b:** If you are the shift host, then you have to join the shift. Don't start a shift unless you are 100% sure you can attend it.
> * *Info:* If you notify your shift host that you can't join the shift after you've already clocked in, but before the start of the shift, you will be exempt from this rule for that specific shift only.
<:blank:1278554259050205287>`},
        {name: `Rule 10: Keep us organized.`, value: `> * Every channel has a description at the top for its purpose. Be sure you're chatting in the appropriate channel. If your convo changes topics, just hop over.
> * If you don't see a channel you think fits, double check the \`Channels & Roles\` section at the top or your settings to \`Show All Channels.\` Still not there? Head to <#1267959229633790096>.
<:blank:1278554259050205287>`},
        {name: `Rule 11: Check before you ask.`, value: `> * Do not ask when the next shift is, check <#1267959203486502963> or <#1267959202433732608>, or better yet host your own shift, for more information read <#1267959190337618022>.
> * Most of the frequently asked questions are already answered in <#1267959190337618022>, so read that before asking!
> * If you still can't find your answer, you can ask in <#1267959226559365275> or open a **General Support** ticket in <#1267959190337618022> or <#1276572413970092082>.
<:blank:1278554259050205287>`},
    )
    .setFooter({text: `Consequences are either a 1- to  24-hour mute or a permanent ban. The lower the rule number, the harsher the consequence.`})
    
  await interaction.editReply({
  embeds: [embed]});
}

module.exports = {
    handleNeighborhood,
    handleServerRules,
   };