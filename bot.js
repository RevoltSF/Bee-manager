require("dotenv").config();
require("module-alias/register");

// register extenders
require("@helpers/extenders/Message");
require("@helpers/extenders/Guild");
require("@helpers/extenders/GuildChannel");


const { initializeMongoose } = require("@src/database/mongoose");
const { BotClient } = require("@src/structures");
const { validateConfiguration } = require("@helpers/Validator");
const embed = require("./src/commands/admin/embed");
const { EmbedBuilder, ChannelType, ThreadAutoArchiveDuration, ThreadChannel, PermissionFlagsBits } = require("discord.js")
validateConfiguration();

// initialize client
const client = new BotClient();
client.loadCommands("src/commands");
client.loadContexts("src/contexts");
client.loadEvents("src/events");

// find unhandled promise rejections
process.on("unhandledRejection", (err) => client.logger.error(`Unhandled exception`, err));
const cron = require('node-cron');
const options = require("./src/handlers/tips");
const { name } = require("./src/structures/BaseContext");
const { EMBED_COLORS } = require("@root/config");

(async () => {


  // start the dashboard
  if (client.config.DASHBOARD.enabled) {
    client.logger.log("Launching dashboard");
    try {
      const { launch } = require("@root/dashboard/app");

      // let the dashboard initialize the database
      await launch(client);
    } catch (ex) {
      client.logger.error("Failed to launch dashboard", ex);
    }
  } else {
    // initialize the database
    await initializeMongoose();
  }

  // start the client
  try {
    await client.login(process.env.BOT_TOKEN);
  } catch (error) {}
})();
const info = require("@root/config").STATSINFO
async function myFunction() {
  const guild = client.guilds.cache.get(info.guildID);
  const allChannel = guild.channels.cache.get(info.allMembers);
  const activeChannel = guild.channels.cache.get(info.active);
  const humanChannel = guild.channels.cache.get(info.human);
  const boostChannel = guild.channels.cache.get(info.boost);

  let active = 0;
  let human = 0;
  let boost = guild.premiumSubscriptionCount;

  // Fetch all members with presences
  const members = await guild.members.fetch({ withPresences: true });

  members.forEach(member => {
    if (member.presence?.status && member.presence.status !== "offline") {
      active++;
    }
  });

  // Calculate the number of human members
  guild.members.cache.forEach(member => {
    if (!member.user.bot) {
      human++;
    }
  });

  // Update the channel names with the calculated values
  await allChannel.edit({
    name: `All Members: ${guild.memberCount}`
  });
  await humanChannel.edit({
    name: `Members: ${human}`
  });
  await activeChannel.edit({
    name: `Active Members: ${active}`
  });
  await boostChannel.edit({
    name: `Boosts: ${boost}`
  });
}

// Convert 0.2 minutes to milliseconds (0.2 minutes * 60 seconds/minute * 1000 milliseconds/second)
const interval = 10 * 60 * 1000;

// Use setInterval to run the function at the specified interval
setInterval(myFunction, interval);


const interval1 = 60 * 60 * 1000;

function extractDiscordID(mention) {
  const regex = /<@!?(\d+)>/g;
  let matches = [];
  let match;
  while ((match = regex.exec(mention)) !== null) {
      matches.push(match[1]);
  }
  return matches;
}
function extractNumber(str) {
  // Use regular expression to match all numbers in the string
  const matches = str.match(/\d+/g);

  // Convert the matched strings to numbers
  const numbers = matches ? matches.map(Number) : [];

  return numbers;
}

async function myFunction1() {
  let filteredKeys = [];

  // Collect shiftIDs and values from the shift database
  await client.shiftdatabase.forEach((value, key) => {
    if (key.endsWith('-shiftID')) {
      filteredKeys.push({
        key: key,
        value: value
      });
    }
  });

  // Collect all threads from the thread database
  let allThreads = [];
  await client.threadsdatabase.forEach((value, key) => {
    const ee = extractNumber(key);
    const obj = {
      id: ee[0],
      thread: value
    };
    allThreads.push(obj);
  });

  // Loop through the filtered keys to process each shift
  for (const db of filteredKeys) {
    const ee = extractNumber(db.key);
    const shiftID = ee[0];
    const server = client.guilds.cache.get(info.guildID);
    const messageID = db.value;
    const channelID = client.shiftdatabase.get("channelID-");
    const channel = server.channels.cache.get(channelID);

    let message;
    try {
      message = await channel.messages.fetch(messageID);
    } catch {
      continue; // Skip to the next shift if fetching the message fails
    }

    const hostID = extractDiscordID(message.embeds[0].description)[0];
    const host = server.members.cache.get(hostID);

    // Check if a thread already exists for the shiftID
    const existingThread = allThreads.find(info => info.id === shiftID);

    if (existingThread) {
      // If thread exists, send the reminder embed
      const thread = server.channels.cache.get(existingThread.thread);
      if (thread) {
        const reminderEmbed = new EmbedBuilder()
          .setColor(EMBED_COLORS.BOT_EMBED)
          .setTitle("Shift Reminder!")
          .setDescription("Hey there! This is just a reminder that your shift is still ongoing. If you forgot to end your shift, please end the shift now with the `/shift end` command!")
          .setFooter({
            text: "If your shift is still ongoing and is not meant to end, then please ignore this message"
          });

        try {
          await thread.send({
            embeds: [reminderEmbed],
            content: `<@${hostID}>`
          });
        } catch {
          // If sending the message fails, simply continue to the next shift
        }
        continue;  // Skip to the next shift since the thread exists
      }
    }

    // If no thread exists, create a new one
    let newThread;
    try {
      newThread = await channel.threads.create({
        name: `Shift ${shiftID} Reminder!`,
        autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
        reason: "To remind the shift host to end the shift if they are finished!",
        type: ChannelType.PrivateThread
      });

      // Add the host to the newly created thread
      await newThread.members.add(host);

      // Add the new thread to the threadsdatabase
      client.threadsdatabase.set(`shift-${shiftID}`, newThread.id);

      // Send the reminder embed in the newly created thread
      const reminderEmbed = new EmbedBuilder()
        .setColor(EMBED_COLORS.BOT_EMBED)
        .setTitle("Shift Reminder!")
        .setDescription("Hey there! This is just a reminder that your shift is still ongoing. If you forgot to end your shift, please end the shift now with the `/shift end` command!")
        .setFooter({
          text: "If your shift is still ongoing and is not meant to end, then please ignore this message"
        });

      await newThread.send({
        embeds: [reminderEmbed],
      });
    } catch {
      // If creating the thread fails, simply continue to the next shift
    }
  }
}

async function myfunction2() {
  const guild = await client.guilds.fetch('1256349528190222386');
  const channel = await guild.channels.fetch('1270635130893107283');
  const verified = guild.roles.cache.get('1267959086943699098');
  const HR_dept = guild.roles.cache.get('1319783410117382225');
  const mod = guild.roles.cache.get('1267959002164232292');
  const supervisor = guild.roles.cache.get('1267959000830578792');

  if (!channel || !verified) return;

  const overwrite = channel.permissionOverwrites.cache.get(verified.id);
  const viewDenied = overwrite?.deny.has(PermissionFlagsBits.ViewChannel);
  const everyoneRole = guild.roles.everyone;

  if (viewDenied) {
    await channel.permissionOverwrites.edit(everyoneRole.id, {
      SendMessages: false,
    });

    await channel.permissionOverwrites.edit(verified.id, {
      ViewChannel: true,
      SendMessages: false,
      CreatePublicThreads: false,
      CreatePrivateThreads: false,
      ReadMessageHistory: false,
      UseApplicationCommands: true,
    });

    await channel.permissionOverwrites.edit(HR_dept.id, {
      ManageChannels: true,
      ManagePermissions: true,
      ManageWebhooks: true,
      ManageMessages: true,
      ManageThreads: true,
    });

    await channel.permissionOverwrites.edit(mod.id, {
      ViewChannel: true,
      SendMessages: true,
      UseApplicationCommands: true,
    });

    await channel.permissionOverwrites.edit(supervisor.id, {
      ManageMessages: true,
      ManageThreads: true,
      UseApplicationCommands: true,
    })
  }
}

setInterval(myFunction1, interval1);
setInterval(myfunction2, interval1);







