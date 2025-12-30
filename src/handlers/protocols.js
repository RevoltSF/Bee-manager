const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    StringSelectMenuBuilder,
    ComponentType,
    Embed,
  } = require("discord.js");

const embed = require("../commands/admin/embed");

const color = require("@root/config").EMBED_COLORS.BOT_EMBED
  
  /**
   * @param {import("discord.js").ButtonInteraction} interaction
   */

async function handleChart(interaction) {
    await interaction.deferReply({ephemeral: true });

    await interaction.editReply(
    `# BEE Hive Organizational Chart

## __High Ranks__
###  <@271078843786330114>

### Administrators
* Human Resources - <@798398834510266398>
* Bot Development - <@324660105784066048>
* Partnerships & Recruitment- <@1189930203426857060>

### Department Heads
* Engagement/Events - VACANT (<@271078843786330114>)
* Head Chef - <@919254227040227399>
* Business Bureau - <@271078843786330114>
* Head Architect - <@798398834510266398>
* Social Media - VACANT

## __Mid Ranks__
### Moderators
* <@919254227040227399>
* <@1106356654628409354>
* <@&1267958988126027848>

###  Shift Manager (moderates neighborhood activity) 
* <@1106356654628409354>
* <@1155205923879534673>

## __Lower Ranks__

## Department Interns
Business - *VACANT*
Catering - *VACANT*
Builders - *VACANT*

## Marketplace Staff
Caterers - Food Staff
Builders - Build/Design Staff 
Entrepreneurs - Roleplay Staff

__The public__
<@&1267959041687027765>

__the condemned__
<@&1267959009227571373> (accounting rejects)
<@&1267959008552157325>  (mute but not blind)`);
}

  async function handleProtectServe(interaction){
    await interaction.deferReply({ephemeral: true });

    const embed = {
        color: 16427271,
        title: 'Protect & Serve',
        description: `**Monitor the messages**

> * Set your notifications to "all messages" and be sure every white dot is read. 
> If you saw another mod chat earlier, you are okay to assume everything above was fine, which means that you need to address any you see after another mod. 
> 
> * If someone is spamming something against the rules, you are welcome to time them out for up to one hour and ping Mod+.

**Answer Questions**
> * Stay engaged in the community. If someone wants a shift, show them the <#1267959192992616458> channel. If someone needs the neighborhood, use the \`nbh\` code. If someone is wondering about their catering order, ping the caterers in the <#1267959221966606366> about it. If someone just asks wyd, stay and chat.

**Delete Smut**
> * If a person curses, that's fine. If a person curses three times in one message, that's a kind reminder to stay respectful. If a person curses at someone, that's a Circle warn to be respectful.
> * If a person uses any slurs like ||fag/faggot, nigga/nigger, cunt, fatty, kys, stfu, dumb bitch, stupid noob||, 1) screenshot it, 2) post to <#1274730206782820394> with context (who said it, if you warned them), 3) delete it and 4) send a Circle warn. 
> * If a person poses a question about a touchy subject in an antagonizing way, that's a friendly nudge to change topics. If they press hot topics of politics, religion, social norms or other dividing topics despite the warning of discomfort, that's a timeout, deletion, and warning, as seen in the previous one
> * An exception could possibly be a deeper-discussion with a trigger warning and bold reminder to stay respectful while exploring others' perspectives. We'll see if it ever happens.

**De-escalate drama**
> * When you see workers going at it for any reason, first step in as a friendly mediator to find common ground or at least remind everyone to be kind with one another.
> * If they persist one having the final word, warn them to drop it, DM it, or get timed out for 15 minutes or ejected from the neighborhood. 
> * If they ignore all that, give a Circle warning & the mute. You can create a ticket and invite them both if you think they need to talk it out with a mediator present.

**Answering tickets**
> * If a ticket has not been updated in 24 hours, the mod that answered the ticket should ping the individual again.
> * If a ticket hasn't been updated in 36 hours, __any__ mod may ping the individual and are allowed to take over the ticket.
> * Tickets should not take longer than 3 days (72 hrs).`
        
}
const embed2 = {
    color: 16427271,
    title: 'Granting Level Bonuses',
    description: `**1. When the member __asks__ for the bonus, find the level 2/level 5 message from <@437808476106784770> about the level.**
* You can search \`"earned the Established"\` or \`"earned the Penny"\` to home in on it.
* Don't hunt them down if they didn't open a ticket, but you can hint at it if you like.
* If you are comfortable with granting the higher rank bonuses, you are welcome to.
* If you see a rank up, but are uncomfortable granting the bonus, react with an :exclamation:

**2. Set up to meet the player in-game and give the amount stated.**
2 = $3500, 5 = $5000, 15 = $10000, 30 = $25000, 50 = $50000 if you are able to give
> You can use any game server.
> You are eligible to receive reimbursement as well as your own bonuses.

**3. Take a screenshot of the successful transaction pop-up**

**4. React with <:BBcheckyes:1268087702306422816> or your fav emoji to the Arcane message and reply with the screenshot.**
If you leveled up in a ticket or somewhere weird or private, use \`/level\` in <#1267959204715434046> or pay-stubs on them and reply to that with \`"@[user] earned the [role] role!"\`
`}


    await interaction.editReply({
     embeds: [embed, embed2]});
}

async function handlePoliceSlap(interaction) {
    await interaction.deferReply({ephemeral: true });

    const embed = new EmbedBuilder().setColor(color)
    .setTitle(`Police & Slap!`)
    .setDescription(`Every now and then, though we aim to be kind, we may have to ***lay down tha law.*** Even through these interactions, we want to remain level-headed, just, and understanding. If the issue is making you emotional, or there is any doubt, simply time them out and ping Mod+ until we can get another mod involved.`)
    .addFields(
        {
            name: `New Bees`, value: `> * Cut the newbies some slack, but still be stern in that they'll need to get familiar with the rules if they want to stay here.
> 
> * If they've already broken 3 rules while they still have the <@&1267959010380877904> or New Member icon, it's time for a Circle warn.
> 
> * If they are still causing problems, go through the consequences with them until you get to the Ban Hammer time.`
        },
        {
            name: `Appropriate channels`, value: `> * There should hardly ever be an instance where you need to Circle warn someone for using the wrong channel. Just link the channel or ping them in it.
> 
> * <#1267959205843832916> should be about work, and <#1267959226559365275> should not be about work, but it's not too big a deal.`
        },
        {
            name: `Reports & Rule-Breaks`, value: `Steps to respond to a report or a spotted rule-breaking post.
> 1. **Screenshot** the offensive messages and **delete** them.
> 
> 2. **Open a ticket with the reporter** and a **separate ticket with the offender(s)** (Get Support in <#1267959190337618022> then \`/ticket add @user\`)
> 
> - If they are still causing trouble, **\`/mute\` them** with Circle for 15-60 minutes.
> 
> - **Thank the reporter** and tell them we will handle it in private. **Tell them not to bring it up in public** anymore to protect the offender's feelings. (People who feel attacked are less likely to be open to honest conversation.)
> 
> - **Welcome the offender** into the ticket and kindly **ask them if they're aware why** they're being brought into this ticket.
> 
> - Post the screenshot and **explain to them how** what they posted broke the rules simply and plainly. **Ask them if they understand** how/why it broke the rule. 
> 
> - **Give them space** to explain themselves and come to terms with it or apologize for misunderstanding.`
        },
        {
            name: `Warnings through Circle`, value: `> * If after the ticket is resolved you still feel the report was justified, make the Circle warn case. This is your judgment call whether this incident needs to stay on their record toward being banned. If it's a second warning and they're no longer a New Bee, it's time for a warn.
>  
> * A Circle warn command could look something like this: 
> \`/warn user:@Ara (@4r4) reason:Rule 2: Bullied Dee about her age.\`
> 
> * After you warned someone, head to <#1267959213540507688> and see how many warnings they have to be sure they are not due for a consequence.`
        },
        {
            name: `The Ban Hammer`, value: `> * This is the absolute last resort and must be approved by one other Sr. Mod or Administrator before acting.
> 
> * Once a player has exhausted their warnings, put them on another one-day mute through Carl-bot, and then we shall deliberate if they can remain a part of the server. 
> 
> * Create a ticket with them, call the channel \`quarantine\` and lay out all the evidence explaining why they may be banned. If you see a quarantine ticket, respond immediately so we don't run out the mute timer.`
        },
)

    await interaction.editReply({
     embeds: [embed]});
}

async function handlePolishSide (interaction) {
    await interaction.deferReply({ephemeral: true });

    const embed = new EmbedBuilder().setColor(color)
    .setTitle(`Polish & Side (with staff)`)
    .setDescription(`We want to look like a well-oiled united front here, so we don't want to come across and imcompetent leaders, nor argue or make other staff look stupid/ignorant/unqualified in front of others.`)
    .addFields(
        {
            name: `Read & Fact-check`, value: `> * **Read & re-read protocols and rules or ask in a private channel** before answering a question about how we do things or responding to a ticket or Mod situation.
> 
> * **Take your time.** It's okay if you don't have the answer right away. What we don't want is to confuse people with misinformation.`
        },
        {
            name: `Correct in Private`, value: `> * **Do not bicker** with other mods or shift managers in front of other workers. Take it to <#1267959211040571472> or <#1267959221966606366>.
> 
> * If someone is steering someone in the wrong direction or leaning toward breaking a rule themselves, **ping them in the mod or staff channels** to address it and allow *them* to correct themselves in public. 
> 
> * If a mod is not paying attention to your pings and still making poor decisions, you may intervene in public with a link to the private channel.
> 
> * If you feel uncomfortable confronting a fellow mod about their behavior, you are authorized to DM Dee or create a Report ticket in <#1267959190337618022> for only <@&1267958988126027848> to see.
> 
> * If ever you feel uncomfortable about confronting the owner about something, first, understand that Dee is very open, understanding, and level-headed, but second, that you can talk to one of the administrators to bring it up with Dee, and even use anonymity.`
        },
)

    await interaction.editReply({
     embeds: [embed]});
}

async function handleSendPartner(interaction) {
    await interaction.deferReply({ephemeral: true });

    const embed = new EmbedBuilder().setColor(color)
    .setTitle(`Partner & Solicit: Sending a Partnership Request`)
    .setDescription(`**1. Join the server and follow Steps 3 & 4 of Answering a Ticket.**
> * Check that they meet the requirements laid out in <#1267959190337618022>
> * (search ||faggot, nigga, nigger, retard, fatty, kys|| and if there are more than 3 of any of these, consult with other mods or decline.)
> * See how many non-server staff are engaging in chat and reactions around the server. 
> * 35+ subscribers to the Partner ping or it's another reason to decline.

**2. If they pass, find their partnership info channel and be sure we meet their requirements**
If they meet all requirements and have over 5,000 members (Looks like 200+ active), you may request permission for an everyone ping if that is what they request.

**3. If all checks out, open a ticket to partner.**
\`\`\`Hello, I'm a moderator for the Bloxburg Excellent Employees, and we'd like to partner. We've already checked that both servers meet each other's requirements and are ready to exchange ads!

We offer: 
* A well-moderated Bloxburg community
* 600+ players with over 20% actively engaged and 15% subscribed to the Partner Ping
* Self-promo opportunities with Announcement following & an advertising forum
* Event Collaborations\`\`\`

**4. Send out the ad and ask them to follow our announcement channel.**
You can link it directly with this:
\`https://discord.com/channels/1256349528190222386/1267959189259554886\`

**5. If they accept, send their ad with the Partner Ping & Representative.**
Try to get them online at the same time as you so you can both post at the same time.

**6. Give them the Partner role and thank them.**

**7. Fill out the required in the B.E.E. Hive Tracking sheet.**
This can be found pinned in <#1267959217004871774>. If you can't access it for any reason, notify an admin and they will be able to do it for you.

If you already have ideas for collaborating events, do share them with us!`)

    
    await interaction.editReply({
     embeds: [embed]});
}

async function handleAnswerPartner(interaction) {
    await interaction.deferReply({ephemeral: true });

    const embed = new EmbedBuilder().setColor(color)
    .setTitle(`Partner & Solicit: Answering a Partnership Ticket`)
    .setDescription(`### <:Bee1:1332021780126371992> Greet them, ask if they read the requirements.
\`\`\`Hello! Have you read over our partner requirements in <#1267959190337618022>? If you meet the requirements, please send your ad below!\`\`\`
### <:Bee2:1332021782810464327> Review their ad.
Read over their ad and make sure everything looks good, come back to this step later to make sure it makes sense for the server.

### <:Bee3:1332021784157097984> Join the server.
> * Use the Onboarding if you can to find out if 35+ people have a partner ping.
> * Search for the partnership channel without help or guidance.

### <:Bee4:1341817301472641044> Verify they meet the requirements. Search their server for rule breaks and/or good moderation, and activity.
> * (search ||faggot, nigger, retard, fatty, kys, kms, nobody asked, fuck you, stfu, gtfo||, and any other toxic words or phrases you can think of, and if there are more than 3 of any concerning instances of these, consult with other mods in the Partnership & Recruitment Office or decline.)
> * See how many non-server staff are engaging in chat and reactions around the server. 
> * 35+ subscribers to the Partner ping or ask if they are willing to use another ping first. Otherwise, we may decline.

### <:Bee5:1341817348327215174> If they pass, explain the terms of our partnership.
\`\`\`Thank you for reaching out! We would love to partner with you. \nUnlike some partnerships, we really like to foster a lasting collaborative relationship. Let's host events together and promote each other's events!\n:Bee1:  You can use our #🩳﹒partner-planning channel to cook up some fun collabs.\n:Bee2:  We offer to follow one of your channels, as long as you follow our #💸﹒plan-ahead channel. \n> Our Publication terms are:\n> - Your announcements may be unfollowed if there are more than 3 publications a day,\n> - If there are less than 0 posts a month or their posts are unimportant or unappealing.\n> - We find that you have unfollowed our channel.\n:Bee3:  Lastly, we know that being a representative can pile up on red pings, so we can remove any subscription pings so you only get pinged for things that actually pertain to you! Just let us know you want your ping roles removed.\nDo you accept this offer?\`\`\`
### <:Bee6:1341817377519698014> If they accept, follow theirs to one of these 3 channels.
> * <#1281521137414705173>, <#1281779757209489418>, or <#1281779824553099274> depending on the type of server they are.

### <:Bee7:1341817404304392305> <:BEEwarn:1268469054931210291> **Have them post their ad first so we are certain they use the right ping, then post theirs.**
\`\`\`Please post our ad with a ping now! We will post your ad right after!\`\`\`
:warning: Be sure that you ping both use a __Partner Ping (ours is red not teal) & the representative.__

### <:Bee8:1341817427528253560> Fill out the required in the B.E.E. Hive Tracking sheet.
This can be found pinned in ⁠Partnerships & Recruitment. If you have any issues, reach out to Steven or another admin (before asking Dee) for assistance!`)


    await interaction.editReply({
     embeds: [embed]});
}

async function handleConsequences(interaction) {
    await interaction.deferReply({ephemeral: true });

    const embed = new EmbedBuilder().setColor(color)
    .setTitle(`**<:BEEmod:1268805750898294907> Consequences**`)
    .setDescription(`Punishments may vary depending on the specific case. We may create a private ticket to discuss the situation directly with the offender, and in some instances, this could result in an immediate ban.`)
    .addFields(
        {
            name: `**Rule 1: Abide by Discord & Roblox ToS & Guidelines - Punishment**`, value: `> * Permanent Ban.`
        },
        {
            name: `**Rule 2: Keep it PG-13. We are SFW - Punishments**`, value: `> * Removal of the NSFW content.
> * 1 warning, 2nd offense is one-day mute. 3rd offense is server ban.`
        },
        {
            name: `**Rule 3: Don't be annoying or hurtful - Punishments**`, value: `> * Removal of the content.
> * 2 warnings, 3rd offense is one-day mute. 4th offense is server ban.`
        },
        {
            name: `**Rule 4: Avoid sensitive topics - Punishments**`, value: `> * This is allowed in <#1267959229633790096> but to some extend.
> * 2 warnings, 3rd offense is one-day mute. 4th offense is server ban.`
        },
        {
            name: `**Rule 5: Be original - Punishments**`, value: `> * 1 warning, 2nd offense is kick. 3d offense is server ban.
> * Removal of the copied content.`
        },
        {
            name: `**Rule 6: Don't advertise Discord servers - Punishments**`, value: `> * **Rule 6a:** 2 warnings, 3rd offense is one-day mute. 4th offense is server ban.
> * **Rule 6b:** 1 warning, 2nd offense is kick. 3rd offense is server ban.`
        },
        {
            name: `**Rule 7: File reports, don't mini-mod - Punishment**`, value: `> * The 1st and 2nd offenses will result in a note for mini-modding, while the third offense will lead to a formal warning.`
        },
        {
            name: `**Rule 8: Do not DM Mods - Punishment**`, value: `> * 3 warnings, 4th offense results in one-day mute. 5th offense results in perm mute or ban.`
        },
        {
            name: `**Rule 9: Show up - Punishments**`, value: `> * **Rule 9a:** 2 warnings, 3rd offense is a one-day timeout on the shifts (you won't be able to see any shifts). 4th offense is a permanent shift time-out and neighborhood ban. 
> * **Rule 9b:** 1 warning, 2nd offense is a one week ban from hosting shifts. 3rd offense is perm-ban from hosting shifts.
> * *Info:* If you let the shift host know that you can't join the shift for any reasons, then you may`
        },
        {
            name: `**Rule 10: Keep us organized - Punishments**`, value: `> * Most of the times this will result in verbal warnings or a note rather than official warnings. 
> * 2 notes, 3rd offense is a warning.`
        },
        {
            name: `**Rule 11: Check before you ask - Punishments**`, value: `> * 1st and 2nd offense is a friendly reminder
> * 3rd offense is a verbal warning
> * 4th is a warn`
        },
)

    await interaction.editReply({
     embeds: [embed]});
}

async function handleSubscription(interaction) {
    await interaction.deferReply({ephemeral: true });

    const embed = new EmbedBuilder().setColor(color)
    .setTitle(`__Subscription Purposes__`)
    .setDescription(`<@&1267959041687027765>: All Announcements. (Sr. Mod+ only; 1 per day.)
<@&1267959042685407345>: Server job openings. (1 per week.)
<@&1268789824769495074>: Social Media content. (YouTube, Twitch, etc; 2 per day.)
<@&1267959089171005633>: Non-work and/or non-Bloxburg live events, Game Nights. (1 per day)
<@&1267959044401008680>  Discord server functional updates. (1 per 8 hours.)
<@&1268995995375505458>: Pinging all mods & admin. (important/time-sensitive only.)
<@&1267959050612506706>: New partnerships. (1 per 4 hours.)
<@&1267959051594240082>: Money can be won. (1 per 6 hours.)
<@&1269679477919715350>: A big roleplay is starting. (1 per 12 hours.)
<@&1267959053108383765>: A shift or Event is happening 1+ hours from now. (1 per 4 hours.)
<@&1267959053959561337>: I'm bored, let's chat or play right now. (1 per 2 hours.)`)

    await interaction.editReply({
     embeds: [embed]});
}

  module.exports = {
    handleChart,
    handleProtectServe,
    handlePoliceSlap,
    handlePolishSide,
    handleSendPartner,
    handleAnswerPartner,
    handleConsequences,
    handleSubscription,
   };