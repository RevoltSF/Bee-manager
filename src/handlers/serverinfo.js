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
async function handleServerStaff(interaction) {
  await interaction.deferReply({ ephemeral: true });
  const embed = new EmbedBuilder().setColor(color)
  .setThumbnail(interaction.guild.iconURL())
  .setTitle("<:BEEmod:1268805750898294907> **Server Staff:**")
  .setDescription("We strive to be a motivated, tight-knit, non-toxic safe space for giving Bloxburg a better buzz. Here are the people who help make that happen. Tell them you appreciate their work from time to time.")
  .addFields(
      {name: "Administrators", value: "<@945299261195710507> **|** <@271078843786330114> **|** <@324660105784066048> **|** <@941968871789842472>"},
      {name: "Department Heads", value: `User Engagement **|** <@563069076013056000>\nCatering Manager **|** <@726935731251183627>\nSelf-Employment **|** <@945299261195710507>`},
      {name: `Shift Managers`, value: `<@351109101511507969> **|** <@563069076013056000> **|** <@1189930203426857060>`},
      {name: `Want to know the history of the B.E.E. Hive?`, value: `There's more to this server than that footer. Click the History button to learn more.`},
      {name: `**__Recruiting Threads__**`,
          value: "[WtB Community - looking for players](<https://discord.com/channels/732384711040696331/1202056949928304710>)\n[Welome to Bloxburg Official - looking for group (Author: Dee)](<https://discord.com/channels/1242031861761441833/1250825093836308681>)\n[Welcome to Bloxburg Official - looking for group (Author: Seawyd)](<https://discord.com/channels/1242031861761441833/1250825093836308681>)"
      }
  )
  .setFooter({
      text: `Founded as Bloxburg Workers Community by Taco_t45 September 1, 2023`
  })
  .setAuthor({name: `The B.E.E. Hive Mind!`})
  const tktBtnRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel("History").setCustomId("HISTORY").setStyle(ButtonStyle.Primary),
  );
await interaction.editReply({
 embeds: [embed],
 components: [tktBtnRow]
});

}

async function handlePartnershipInfo(interaction) {
  await interaction.deferReply({ ephemeral: true });
  const embed = new EmbedBuilder().setColor(color)
  .setThumbnail(interaction.guild.iconURL())
  .setTitle("<:BEEstarH:1268805757835411516> **Partnership Info:**")
  .setAuthor({name: "Requirements to become & mantain a partner"})
  .setDescription(`<:BEEcheckH:1268805754924695602> Have 75 server members (Bots not included)\n\n<:BEEcheckH:1268805754924695602>  Must not influence NSFW content.\n\n<:BEEcheckH:1268805754924695602>  Must not have a toxic group of members and present moderation team.\n\n<:BEEcheckH:1268805754924695602> Must be about Roblox.\n\n<:BEEcheckH:1268805754924695602>  Must have a representative stay in this server at all times.\n\n<:BEEcheckH:1268805754924695602>  Our post must be visible to all members upon joining the server.\n\n<:BEEcheckH:1268805754924695602>  Must not influence raiding any other server for any reason whatsoever. We don't believe in the eye-for-an-eye sentiment\n\n<:BEEcheckH:1268805754924695602>  Must not support terrorist organizations or hate groups.\n\n<:BEEcheckH:1268805754924695602>  Must use a ping. If under 100 members or not Bloxburg = @.everyone\nIf 100+ members = @.partnership ping`)
  .addFields(
      {name: "⚠️ Your ad may be taken down for these reasons: ", value: "* Invite link expired\n* We receive reports of poor management in your server\n* We get raided by your server\n* The partnership representative leaves or is unresponsive to direct pings over a week."},

  )
  .setFooter({
      text: `Apply by opening a ticket on the Get Support button`
  })
  
await interaction.editReply({
  content: `\`\`\`## 🍯  Sweeten Your Bloxburg Experience in the B.E.E. HIVE! 💵 
-# *Get that money, honey.*

What's that? You're trying build and play but you keep running out of money? Enter the Bloxburg Excellent Employees (B.E.E.) Hive– the ultimate destination for Bloxburg enthusiasts looking to make bank!
▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃
### 💶   What We Offer:
- 🌈 **Work Variety**
-# We host shifts at more than Blox Burger. We try them all!
- 🤖 **Custom Bot**
-# Our B.E.E. Manager makes gathering friends a breeze!
- 🎉 **Contests & Giveaways** 
-# Join our exciting & competitive game nights and keep your eyes peeled for surprise giveaways!
- 🤝** Partnerships** 
-# Collaborate and connect with other quality Bloxburg communities.
- 🛡️ **A Safe & Welcoming Community** 
-# Make friends and good memories in a safe space.
- 💼 **Job Opportunities** 
-# Become a caterer, a shift manager, or find a job on our members' plots!
▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃
### 💷   Session Times:
- Work shifts daily!
- Pings tailored to your time zone!

### 💴 Ready to take your Bloxburg experience to the next level? 
Join B.E.E. Hive today and ***get that money, honey!***

🔗 Discord: https://discord.gg/aqmHZJTuUv\`\`\``,
 embeds: [embed]
});

}


async function handleLevelPerks(interaction) {
  await interaction.deferReply({ ephemeral: true });
  const embed = new EmbedBuilder().setColor(color)
  .setThumbnail(interaction.guild.iconURL())
  .setTitle("<:BEEup:1268808091227390004> **Level Perks:**")
  .setAuthor({name: "A leveling system is here and keeping track! "})
  .setDescription(`Get rewards for being an active member of our community besides those *sweet* paychecks.

> - **Level 1:** <@&1267959010380877904> ($1,000)
> Welcome to the server! Take a look around, get to know the place.
> - **Level 2:** <@&1267959015221100671> ($2,500)
> You can now schedule shifts!
> You can now see our <#1267959237028483156> channel, but learn how to play first. You can get fired.
> - **Level 5:** <@&1267959014285639682> ($5,000)
> You can now apply for Shift Manager!
> - **Level 10:** <@&1356527758678949918>
> You've stayed in good graces and hung around long enough to apply for Moderator+!
> - **Level 15:** <@&1267959013509955665> ($10,000)
> Cream of the crop!
> - **Level 30:** <@&1267959012247207968> ($25,000)
> You're the bees' knees!
> Immune from accounting mutes
> - **Level 50:** <@&1267959011324596328> 50 ($50,000)
> If you make it this far, you get honorary Booster perks.
> - **Level 100** 
> If you make it *this* far, I'll buy you Robux or Blockbux.

Whenever you level up to a new rank, start a thread from the <@437808476106784770> message to get your promotion bonus!`)
  
await interaction.editReply({
 embeds: [embed]
});

}

async function handleBoostPerks(interaction) {
  await interaction.deferReply({ ephemeral: true });
  const embed = new EmbedBuilder().setColor(color)
  .setThumbnail(interaction.guild.iconURL())
  .setTitle("<:BEEboost:1268789869283512341> **Boosting Perks:**")
  .setDescription(`- Custom role color (choose your hex code!)
- 3-hour cooldown for hosting shifts (6-hour cooldown for everyone else)
- Have an emoji added
- 10% Arcane XP boost
- Reserve a neighborhood for private shifts/events
- Monthly Bonus <:BBCbag:1268087700141903974> 
> Level 1: $10,000/mo
> Level 2: $20,000/mo
> Level 3: $30,000/mo`)
  
await interaction.editReply({
 embeds: [embed]
});

}

async function handleCateringInformation(interaction) {
  await interaction.deferReply({ ephemeral: true });
  const embed = new EmbedBuilder().setColor(color)
  .setThumbnail(interaction.guild.iconURL())
  .setAuthor({
      name: "Let The Hive Fill Your Fridge!",
      iconURL: "https://images.emojiterra.com/google/noto-emoji/unicode-15.1/color/svg/1f95e.svg"
    })
  .setTitle("<:BEEcater:1268805753704157256> **Catering Info:**")
  .setDescription(`Whether there's limited seasonals available or you're just tired of having the Starving status, we've got Caterers on standby to fulfill your Hunger needs!`)
  .addFields(
      {
          name: `__MAKE YOUR ORDER!__`, value: "Start your Order in <#1267959248990638183> by pressing \"**Order Now!**\"\nBe sure to report back and **leave a review!**"
      },
      {
          name: "__COME COOK FOR US!__",
          value: "We're always hiring new Caterers. \n\n**Qualifications:**\n- Arcane Level 2+ (Established)\n- Cooking Level 5+\n- Active member\n\nStart your application below! Promotions are typically announced on Fridays."
      }
  )
  .setFooter({text: `Head Chef | Day (@nirishorla07)`})
  
await interaction.editReply({
 embeds: [embed]
});

}

async function handleBuildingInfo(interaction) {
  await interaction.deferReply({ ephemeral: true });
  const embed = new EmbedBuilder().setColor(color)
  .setThumbnail(interaction.guild.iconURL())
  .setTitle("<:BEEbuilding:1270130529613774950> **Building Info:**")
  .setDescription(`Struggling on your next build? Found a speedbuild, but don't know how or don't want to build it yourself? Hire a B.E.E. Builder!`)
  .addFields(
      {
          name: `__FIND A BUILDER!__`, value: "Peruse the <#1268983396324081704> forum for our builders' portfolios. \nClick the one that closest matches what you're going for and fill out their template! \nBe sure to report back and leave a review!\n<:blank:1278554259050205287>"
      },
      {
          name: "__COME BUILD FOR US!__",
          value: "We're always hiring new Builders. \n\n**Qualifications:**\n- Arcane Level 2+ (Established)\n- Pass a building skills evaluation test\n- Be an active member of the community\n\nStart your application below!"
      }
  )
  .setFooter({text: `Head Architect | VACANT`})
  
await interaction.editReply({
 embeds: [embed]
});

}

async function handleFAQ(interaction){
  await interaction.deferReply({ ephemeral: true });
  const embed = new EmbedBuilder().setColor(color)
  .setThumbnail(interaction.guild.iconURL())

  .setTitle("<:BEEq:1268805756476592210> **Frequently Asked Questions**")
  .addFields(
      {
          name: `**When is the next shift?**`, value: "> Look in <#1267959203486502963> and <#1267959202433732608>  for any upcoming shifts. "
      },
      {
          name: "**Can I host a shift?** ",
          value: "> Once you reach level 2 in the server (you can use the `/level` command in <#1267959204715434046> to check your level), <@1253026215434911865> will show you all the information to know on how to host a shift."
      },
      {
          name: "**When are mod/shift manager apps open?** ",
          value: `> Please look in <#1267959189259554886>  to see if apps are currently open. If they’re not, you can grab the applicant role to be pinged when mod or shift manager apps are open.`
      },
      {
          name: "**How do I become a caterer? **",
          value: `> To be a caterer, you must apply. Go to <#1267959204715434046> and insert the /apply command and press caterer. Please be patient as you wait for your application to be read.`
      },  {
          name: "**I leveled up, I want my bonus money. When can I get it?** ",
          value: `> Please open up a ticket to claim your bonus for leveling up. Please indicate what levels bonus you wish to acquire (level 2,5, etc) and wait for a mod+ to get back to you.`
      },  {
          name: "**I want to partner with the server!** ",
          value: `> How can I do that? Please read <#1267959190337618022> and open up a ticket. Make sure you have the AD of the server ready and meet all partner requirements.`
      }
  )
  .setFooter({text: `Incase of any more questions, open up a support ticket!`})
  
await interaction.editReply({
 embeds: [embed]
});
}

async function handleHistory(interaction){
  await interaction.deferReply({ ephemeral: true });
  await interaction.editReply({
      content: `# Chapter 1: The Beginning
This community was originally founded in reponse to the July 2023 Blox Burger update as Bloxburg Workers Community on September 1, 2023 by Taco_t45. There had already been a few successful Blox Burger servers by then, so Taco soon took interest in a new project later that month: the bustling Bloxburg University. He appointed his moderators <@1156780066886385694> & <@580585579784437770> as well as Dee--just another member in the server who offered a lot of suggestion to the half-dead server--to take over. With the school year in full swing, not much happened until January 25, 2024 when a prominent Blox Burger server mysteriously disappeared, propelling Dee to use BWC as its replacement. 

# Chapter 2: Growth!
She channeled all her energy and creativity into bringing BWC from under 100 members to 300 by May 2024! Unfortunately,  <@1156780066886385694>'s  offline life was too much to juggle operating BWC & <@580585579784437770> 's time in the server was also sparse, though she wielded the mimu bot to be a valuable resource in the beginning. Eventually, Dee felt the weight of carrying the enter server seemingly by herself, so she hired the active <@941968871789842472> & <@1106747091339972638> to assist. 

# Chapter 3: The Shift
The server really took off then! We hit 500 members in late June, including bot developer <@945299261195710507> and Dragon Awards partner <@773054885016764418> who encouraged Dee that it was time to spread her honeybee wings and start fresh. It took some convincing, but with the Great 8 by her side, <@945299261195710507> <@941968871789842472> <@324660105784066048> <@563069076013056000> <@1189930203426857060> <@351109101511507969> <@726935731251183627> and Worker representative <@763774072319770635>, they flew away to build a new server, the B.E.E. Hive you see today!`
     });
}

async function handleEntre(interaction){
  await interaction.deferReply({ ephemeral: true });
  const embed = new EmbedBuilder().setColor(color)
  .setThumbnail(interaction.guild.iconURL())

  .setTitle("<:BEEcoin:1268603590528729201> **Entrepreneurship Info**").setDescription("The B.E.E. Hive supports entrepreneurs! Open your very own business and let the Hive know all about it.")
  .addFields(
      {
          name: `**Become an entrepreneur!**`, value: "\"Entrepreneur\" is a fancy word for someone who creates a business, usually a small one. If you've got a business that doesn't really need all the bells and whistles of an entire Discord, use ours! Small cafes, hotels, attractions, and stores that need a few employees and a lot of customers will be granted their very own ping role to support their post in our  <#1267959234633666641> forum!\n\nWe also have a program for bigger businesses like threatres, schools, shopping centers. If you're looking to hire plenty people, then you might be a **Certified Boss!**\n\nStart advertising your small business by applying to become an Entrepreneur or Boss today!"
      }
  )
  .setFooter({text: `Fun Fact: The owner, Dee, has been an entrepreneur since the beginning of her time in Bloxburg opening a small music school for private lessons that funded a tiny orphanage in the back.`})
  
await interaction.editReply({
 embeds: [embed]
});
}

async function handleHomeOwner(interaction){
  await interaction.deferReply({ ephemeral: true });
  const embed = new EmbedBuilder().setColor(color)
  .setThumbnail(interaction.guild.iconURL())

  .setTitle("<:BEEheartcomb:1268962836990660628> **Homeownership Info**").setDescription("Bloxburg is only fun __alone__ if you're primarily a builder. For the rest of us, it's nice to wake up to a crying baby, mischievous toddler, and runaway teen in the house we worked for hours to earn enough money to then spend more hours building and decorating each room for these ungrateful kids-- I mean, uh, go to the next section.")
  .addFields(
      {
          name: `**Open your home to the Hive!**`, value: "Get some great pictures of your welcoming home and post them in the ⁠<#1269016614397935616> forum! Use the tags to find the right family members to fill those beds, dirty those plates, and dirty those plates! Yay family!"
      },
      {
          name: `**Get adopted!**`, value: "Search the forum for the perfect parent or create your own post to let homeowners know what kind of kid you'll be."
      },
  )
  .setFooter({text: `Fun Fact: Dee hates family roleplays. She once opened an orphanage behind one of her businesses and took in stinky children off the streets, but blocked any child who called her Mom on accident.`})
  
await interaction.editReply({
 embeds: [embed]
});
}

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

### Agreement G: Adhere to the Roblox ToS

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
  .setDescription(`### Rule 1: Respect.
> * Be respectful to everyone and to the server. Don't curse __at__ anyone, and don't curse excessively in general. Use appropriate language in the appropriate channel.

### Rule 2: Don't be annoying.
> * No trolling, spamming, instigating, or spreading hate.
> * Slurs, drama, excessive teasing, toxicity, extremism--not here.

### Rule 3: No advertising other servers.
> * Check our reqs, then create a ticket for partnership in <#1267959190337618022> 
> * **Rule 3a:** Bloxburg RP businesses that have open job positions can be posted in <#1267959234633666641> as per its guidelines.
> * **Rule 3b:** Hinting about your Discord server, requesting DMs, DMing our members, pointing to a link in your profile is all considered advertising and against this rule if you are not a partner.

---------------------------------------
### Rule 4: Don't ask, just command.
> * Do not ask when the next shift is. Use the \`/cooldown\` command to find out.
> * You can also check <#1267959202433732608> for the Shift Managers' schedules.
> * **Rule 4b:** Do not alert for a shift within 2 hours of a shift or event scheduled in <#1267959202433732608>. If you do, you will be demoted to <@&1267959010380877904>, resetting your Arcane levels. <:BBfail:1268087706282360924> 

### Rule 5: Show up.
> * React to shift pings honestly. If you say you can work, join in a timely manner. Don't be a flake.

### Rule 6: Do not DM Mods.
> * Read pins, check the LEARN Category, search FAQ in <#1267959190337618022>, ask in <#1267959226559365275> 
> * If you're still confused, get support in <#1267959190337618022> 

### Rule 7: Follow the Discord ToS.

============================
<:BEEmod:1268805750898294907>  Consequences <:BEEmod:1268805750898294907> 
**Rules 1-3:** 2 warnings, 3rd offense is one-day mute. 4th offense is server ban. Some instances may result in an instant ban.
**Rules 4-6:** 3 warnings, 4th offense results in one-day mute. 5th offense results in perm mute (you can still see, but you can't speak or react anymore) or ban.
**Rule 7:** Immediate ban.`)
  
await interaction.editReply({
embeds: [embed]});
}



 module.exports = {
 handleServerStaff,
  handlePartnershipInfo,
  handleLevelPerks,
  handleBoostPerks,
  handleCateringInformation,
  handleFAQ,
  handleHistory,
  handleEntre,
  handleHomeOwner,
  handleBuildingInfo,
};
