const { counterHandler, inviteHandler, presenceHandler } = require("@src/handlers");
const { cacheReactionRoles } = require("@schemas/ReactionRoles");
const { getSettings } = require("@schemas/Guild");
const { channel } = require("diagnostics_channel");

/**
 * @param {import('@src/structures').BotClient} client
 */
module.exports = async (client) => {
  client.logger.success(`Logged in as ${client.user.tag}! (${client.user.id})`);

  // Initialize Music Manager
  if (client.config.MUSIC.ENABLED) {
    client.musicManager.connect(client.user.id);
    client.logger.success("Music Manager initialized");
  }

  // Initialize Giveaways Manager
  if (client.config.GIVEAWAYS.ENABLED) {
    client.logger.log("Initializing giveaways manager...");
    client.giveawaysManager._init().then((_) => client.logger.success("Giveaway Manager initialized"));
  }

  // Update Bot Presence
  if (client.config.PRESENCE.ENABLED) {
    presenceHandler(client);
  }

  // Register Interactions
  if (client.config.INTERACTIONS.SLASH || client.config.INTERACTIONS.CONTEXT) {
    if (client.config.INTERACTIONS.GLOBAL) await client.registerInteractions();
    else await client.registerInteractions(client.config.INTERACTIONS.TEST_GUILD_ID);
  }

  // Load reaction roles to cache
  await cacheReactionRoles(client);

  for (const guild of client.guilds.cache.values()) {
    const settings = await getSettings(guild);

    // initialize counter
    if (settings.counters.length > 0) {
      await counterHandler.init(guild, settings);
    }

    // cache invites
    if (settings.invite.tracking) {
      inviteHandler.cacheGuildInvites(guild);
    }
  }

  setInterval(() => counterHandler.updateCounterChannels(client), 10 * 60 * 1000);


 
  const guild = client.guilds.cache.get(require("@root/config").WORKSTATS.guild);
  const channel = guild.channels.cache.get(require("@root/config").WORKSTATS.workStatsChannel);
  channel.send(`# Week of <t:1726777560:D> to <t:1727382360:D>\n-# * XP to be given out **after** workaholic weekend.

## Leaderboard:

Empty for now
    `);

    channel.send(`# How to gain XP:
> * You must join the shift and post your __paycheck__ in <#1267959207399788625> or be in a photo with the shift lead to be eligible for XP
> * This XP allows you to level up with <@437808476106784770> and receive bonuses once you reach a certain level
> * Details about levels can be found in <#1267959190337618022>
> * Joining a shift hosted by a <@&1267959004873752647> or a <@&1267959005767274638> grants you __100__ XP
> * Joining a shift hosted by a fellow worker grants you __50__ XP
> * Joining a shift hosted during Workaholic Weekend grants you __2x__ XP
> * By posting a clear group photo with the hashtag \`#beehive\`, you and everyone captured inside the photo can gain an extra __25__ XP.`)
    
	channel.send(`# Snap a good photo
> * Everyone's face is in good lighting
> * Everyone is energized and clean
> * Everyone's in uniform **or** at the job location (don't need both)
> * Someone is saying \`#beehive\` in-game
> * Only pictures with a minimum of __3__ workers will be eligible for the extra 25 XP
> * Work photos must include a minimum of __2__ workers to be eligible for the standard amount of XP. To be eligible for the bonus 25 XP, those photos still require __3__ workers.
> * Everyone's Roblox display name can be easily read, names should not be hidden behind each other
> ### If your Discord nickname is different than your Roblox display name, you must also post your paycheck so that you are easily identifiable 
> ### Group photos without any names will not be counted`)

	channel.send(`> ### When the week ends, every Sunday when XP is being distributed...
> * The employee with the most XP will be <@&1267959000201433160> and receive $50,000 <:BBCbag:1268087700141903974> and bonus giveaway entries for the week.
> * The Shift Manager with the most XP will be <@&1275522324514472119> and receive $50,000 <:BBCbag:1268087700141903974>.
> -# Ties will result in prize being split amongst number of ties`)

    channel.send(`> # 📸Photo of the Week!
> Worker BEEs who post a __*really good*__ group picture as <#1267959207399788625> of their shifts have a shot at even more bonus XP. The __**most creative group picture of the week**__ will win __***300 XP***__ & Special Role: <@&1328099488941740214>! The quicker you level up, the sooner you get level perks (see <#1267959190337618022>).

### A good photo means:
> * Everyone's face is in good lighting
> * Everyone is energized and clean
> * Someone is saying \`#beehive\` in-game
> * The more people - the more XP!

### Tips on being Creative 🎨:
> * Avoid standing still in a line.
> * Find Funny / Unexpected Shots.
> * Diversify the \`#BEEHIVE\` chat bubbles.
> * Dress up in 3D for work!
> * Try crazy formations!

This is a great opportunity for everyone to showcase their creativity while still maintaining the shift proof requirements.
Have fun and stand out! 💥🎨`)

};

