
const { ApplicationCommandOptionType, EmbedBuilder, ButtonStyle, ButtonBuilder, ButtonInteraction, ButtonComponent, ActionRowBuilder, ComponentType, ChannelType, ThreadAutoArchiveDuration } = require("discord.js");
const { config } = require("dotenv");
const color = require("@root/config").EMBED_COLORS.BOT_EMBED
const { getUser } = require("@schemas/User");
const { channel } = require("diagnostics_channel");

const SHIFTS = require("../../../config").SHIFTS;
function extractNumber(str) {
  // Use regular expression to match all numbers in the string
  const matches = str.match(/\d+/g);

  // Convert the matched strings to numbers
  const numbers = matches ? matches.map(Number) : [];

  return numbers;
}
function extractNumbersFrom(str) {
  // Use a regular expression to match all occurrences of numbers in the string
  const matches = str.match(/\d+/g);
  
  // If no matches are found, return an empty array
  if (!matches) {
      return [];
  }
  
  // Convert matches to numbers and return
  const i = matches.map(Number)
  return i[0];
}
function getJobDetails(niceJobName) {
  
  const jobMap = {
    "Ben's Ice Cream": "benIceCream",
    "BFF Market": "bffMarket",
    "Blox Burger": "bloxBurger",
    "The Fishing Hut": "fishing",
    "Mike's Motors": "mechanic",
    "Bloxburg Mines": "bloxburgMines",
    "Pizza Planet Kitchen": "pizzaBaking",
    "Pizza Planet Delivery": "pizzaDelivery",
    "Stylez Salon": "stylezSalon",
    "Green Clean": "janitor",
    "Lovely Lumber": "woodCutter",
    "Bloxburg High": "bloxburgHigh",
    "Academic Leveling": "academic",
    "Skills Leveling": "skills",
    "Halloween Event": "halloween",
  };
  

  const jobKey = Object.keys(jobMap).find(key => niceJobName.includes(key));
  
  if (jobKey && SHIFTS[jobMap[jobKey]]) {
    return {
      Emoji: SHIFTS[jobMap[jobKey]].Emoji,
      Role: SHIFTS[jobMap[jobKey]].ROLE_ID
    };
  } else {
    return {
      Emoji: "",
      Role: ""
    };
  }
}
function timeAgo(dateString) {
  const givenDate = new Date(dateString);
  const now = new Date();
  const diffInMs = now - givenDate;

  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  } else {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }
}

// Function to extract numbers from the input and assign to variables
function extractNumbers(input) {
  const inputString = input.toString();
  const parts = inputString.split('_');
  
  if (parts.length !== 4) {
      throw new Error("Input does not have the correct format");
  }

  const guildid = parts[0];
  const channelid = parts[1];
  const messageid = parts[2];
  const userid = parts[3];
  return { guildid, channelid, messageid, userid };
}

function extractAndFormatNumbers(inputString) {
  // Regular expression to match numbers between <@ and >
  let regex = /<@(\d+)>/g;
  let matches;
  let result = "";

  // Iterate over all matches
  while ((matches = regex.exec(inputString)) !== null) {
      // Append the matched number enclosed in <@ and > to the result string
      result += `<@${matches[1]}>\n`;
  }

  // Remove the trailing newline character if it exists
  if (result.endsWith("\n")) {
      result = result.slice(0, -1);
  }

  return result;
}

function extractEmoji(input) {
  const inputString = input.toString();
  const parts = inputString.split(' ');
  
  const emoji = parts[0];
  const part1 = parts[1]
  const part2 = parts[2] 
  const part3 = parts[3] || null

  if(part3 !== null) return `${part1} ${part2} ${part3}`
  else{
    return `${part1} ${part2}`
  }
}

function extractText(input) {
  const inputString = input.toString();
  const parts = inputString.split(' ');
  
  const emoji = parts[0];
 

  return `${emoji}`
}

const jobOptions = [
  { name: `${SHIFTS.benIceCream.Emoji} Ben's Ice Cream`, value: "benIceCream" },
  { name: `${SHIFTS.bffMarket.Emoji} BFF Market`, value: "bffMarket" },
  { name: `${SHIFTS.bloxBurger.Emoji} Blox Burger`, value: "bloxBurger" },
  { name: `${SHIFTS.fishing.Emoji} Fishing Hut`, value: "fishing" },
  { name: `${SHIFTS.mechanic.Emoji} Mike's Motors`, value: "mechanic" },
  { name: `${SHIFTS.bloxburgMines.Emoji} Bloxburg Mines`, value: "bloxburgMines" },
  { name: `${SHIFTS.pizzaBaking.Emoji} Pizza Planet Kitchen`, value: "pizzaBaking" },
  { name: `${SHIFTS.pizzaDelivery.Emoji} Pizza Planet Delivery`, value: "pizzaDelivery" },
  { name: `${SHIFTS.stylezSalon.Emoji} Stylez Salon`, value: "stylezSalon" },
  { name: `${SHIFTS.woodCutter.Emoji} Lovely Lumber`, value: "woodCutter" },
  { name: `${SHIFTS.bloxburgHigh.Emoji} Bloxburg High`, value: "bloxburgHigh" },
  { name: `${SHIFTS.academic.Emoji} Academic Leveling`, value: "academic" },
  { name: `${SHIFTS.skills.Emoji} Skills Leveling`, value: "skills" },
  { name: `${SHIFTS.spooky.Emoji} Halloween Event`, value: "halloween" },
];
const timeOptions = [
  { name: "5 minutes", value: "5" }, //Change in final code
  { name: "10 minutes", value: "10" },
  { name: "15 minutes", value: "15" },
  { name: "20 minutes", value: "20" },
  { name: "25 minutes", value: "25" },
  { name: "30 minutes", value: "30" },
  { name: "35 minutes", value: "35" },
  { name: "40 minutes", value: "40" },
  { name: "45 minutes", value: "45" },
];


/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "shift",
  description: "used to manage shifts",
  category: "BLOXBURG",
  command: {
    enabled: false,
  },
  slashCommand: {
    enabled: true,
    ephemeral: false,
    options: [
      {
        name: "start",
        description: "start a shift",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "job-location",
            description: "pick where to host the shift",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: jobOptions
          },
          {
            name: "start-time",
            description: "pick when the shift will start",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: timeOptions
          },
          {
              name: "required-reactions",
              description: "how many reactions are needed to start?",
              type: ApplicationCommandOptionType.Number,
              required: true,
              min_value: 2, //Change in final code
              max_value: 8
          },
          {
              name: "neighborhood-code",
              description: "What is the correct neighborhood code?",
              type: 3,
              required: true,
              choices: [
                { name: "Primary (SkillsLevelUpBro)", value: "SkillsLevelUpBro" },
                { name: "Private Rayne (feetjie2611) [Shift Managers Only]", value: "feetjie2611" },
                { name: "Private Zor (Kingofthemoonyeepy) [Shift Managers Only]", value: "Kingofthemoonyeppy"},
              ]
          },
          {
              name: "vc",
            description: "Will vc be used for this shift? It is set to 'No' by default",
            type: 3,
            required: false,
            choices: [
                { name: "Yes ", value: "Yes"},
            ]
          }
        ],
      },
      {
        name: "end",
        description: "end a shift",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "shift-id",
            description: "the id of the shift to end",
            type: ApplicationCommandOptionType.Number,
            required: true,
            autocomplete: true
          }
        ],
      },
      {
        name: "list",
        description: "lists all active shifts",
        type: ApplicationCommandOptionType.Subcommand
      },
      {
        name: "plan",
        description: "Plan a shift",
        type: 1, // Subcommand type
        options: [
          {
            name: "job",
            description: "Pick where to host the shift",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: jobOptions
          },
          {
            name: "start-time",
            description: "Input the hammertime code when the shift will start, choose the very last option",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
          {
            name: "reactions",
            description: "How many reactions are needed to start? (2-5)",
            type: ApplicationCommandOptionType.Number,
            required: true,
            min_value: 1,
            max_value: 5,
          },
          {
            name: "image",
            description: "Provide an image URL for the shift",
            type: ApplicationCommandOptionType.Attachment,
            required: false, 
          }
        ],
      },
      {
        name: 'cancel',
        description: 'Cancel a planned shift',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'event-num',
            description: 'Your provided event number',
            type: ApplicationCommandOptionType.Number,
            required: true,
            autocomplete: true
          }
        ]
      }
    ],
  },
  
  async interactionRun(interaction, data) {
    const client = interaction.client
    

    const messageChannelID = interaction.channel.id;
    const allowedchannelID = client.shiftdatabase.get("allowedchannelID-");
    if (allowedchannelID && messageChannelID !== allowedchannelID && (interaction.member.permissions.has("Administrator")) == false) {
        return interaction.followUp({
            content: `You cannot use that command here! You can only use the \`/shift\` command in <#${allowedchannelID}>.`
        });
    }
    const iiichanel = client.shiftdatabase.get(`channelID-`)
   
    if (!iiichanel) return await interaction.followUp("Shifts channel not configured!");
  const shiftChannel = interaction.member.guild.channels.cache.get(iiichanel);
    if (!shiftChannel) return await interaction.followUp("Shifts channel not found!");

   
    const idid = require("@root/config").CUSTOM.SHIFT_MANAGER;
      if((interaction.member.roles.cache.has(idid)) == false){
        return interaction.followUp("You don't have permission to use this bot. You need to be level 2 to be able to host your own shifts!")
      }

    const sub = interaction.options.getSubcommand();

   
    if (sub === "start") {

      const messageChannelID = interaction.channel.id;
       
       

        function getCurrentTimeInGMT3() {
          const now = new Date();
          const utcTime = now.getTime();
          const gmtPlus3Offset = 3 * 60 * 60 * 1000;
          const gmtPlus3Time = new Date(utcTime + gmtPlus3Offset);
      
          const hours = gmtPlus3Time.getUTCHours();
          const minutes = gmtPlus3Time.getUTCMinutes();
      
          return { hours, minutes };
      }
      
      const currentTime = getCurrentTimeInGMT3();
      const currentHours = currentTime.hours;
      const currentMinutes = currentTime.minutes;
      const currentTimeInMinutes = currentHours * 60 + currentMinutes;
      
      const range1Start = 14 * 60;  // 2:00 PM in minutes
      const range1End = 23 * 60;    // 11:00 PM in minutes
      const range2Start = 23 * 60;  // 11:00 PM in minutes
      const range2End = 6 * 60;     // 6:00 AM in minutes
      const range3Start = 6 * 60;   // 6:00 AM in minutes
      const range3End = 14 * 60;    // 2:00 PM in minutes
      const emojiFullID = client.shiftdatabase.get("emojiFullID")
      const emojiID = client.shiftdatabase.get("emojiID")
      const coeptusID = client.shiftdatabase.get("coeptus-");
      const bloxyID = client.shiftdatabase.get("bloxy-");
      const riversideID = client.shiftdatabase.get("riverside-");
      let role;
      if (currentTimeInMinutes >= range1Start && currentTimeInMinutes < range1End) {
          role = coeptusID;
      } else if (currentTimeInMinutes >= range2Start || currentTimeInMinutes < range2End) {
          role = bloxyID;
      } else if (currentTimeInMinutes >= range3Start && currentTimeInMinutes < range3End) {
          role = riversideID;
      }  

      function getDynamicTimestampByMinutes(minutesToAdd) {
          const now = new Date();
          const dynamicTime = new Date(now.getTime() + (minutesToAdd * 60000));
          const unixTimestamp = Math.floor(dynamicTime.getTime() / 1000);
          return unixTimestamp;
      }
      
      const start = interaction.options.getString("start-time");
      const job = interaction.options.getString("job-location");
      const vc = interaction.options.getString("vc");
      let niceJobName;
      if (job == "benIceCream") {
          niceJobName = "🍦 Ben's Ice Cream";
      } else if (job == "bffMarket") {
          niceJobName = "🛒 BFF Market";
      } else if (job == "bloxBurger") {
          niceJobName = "🍔 Blox Burger";
      } else if (job == "fishing") {
          niceJobName = "🎣 The Fishing Hut";
      } else if (job == "mechanic") {
          niceJobName = "🔧 Mike's Motors";
      } else if (job == "bloxburgMines") {
          niceJobName = "⛏️ Bloxburg Mines";
      } else if (job == "pizzaBaking") {
          niceJobName = "🍕 Pizza Planet Kitchen";
      } else if (job == "pizzaDelivery") {
          niceJobName = "🛵 Pizza Planet Delivery";
      } else if (job == "stylezSalon") {
          niceJobName = "💈 Stylez Salon";
      } else if (job =="janitor"){
          niceJobName = "🧹 Green Clean";
      }else if(job == "woodCutter"){
          niceJobName = "🪓 Lovely Lumber";
      } else if (job == "skills"){
          niceJobName = "⏫ Skills Leveling";
      } else if (job == "bloxburgHigh"){
          niceJobName = "🏫 Bloxburg High";
      } else if (job == "academic"){
          niceJobName = "🎓 Academic Leveling";
      } else if (job == "spooky"){
          niceJobName = "🎃 Halloween Event";
      }

      const dominus = client.shiftdatabase.get("dominus-")
      const requiredReactions = interaction.options.getNumber("required-reactions");
      const neighborhoodCode = interaction.options.getString("neighborhood-code");
      if(neighborhoodCode == "feetjie2611" || neighborhoodCode == "Kingofthemoonyeppy"){
        const idid1 = require("@root/config").CUSTOM.LEADER;
      if((interaction.member.roles.cache.has(idid1)) == false){
        return interaction.followUp("You don't have permission to use that neighborhood, private neighborhoods are only for shift managers.")
      }
      }
      if (job === "spooky") {
        const now = Math.floor(Date.now() / 1000); // current HammerTime (seconds)
        const halloweenTime = 1760022000; // your HammerTime timestamp

        if (now < halloweenTime) {
            return interaction.followUp("Halloween event hasn’t started yet! You may host this shift after <t:1760022000:f>");
        }
    }
      const roleID = role;
      const channelID = client.shiftdatabase.get("channelID-");
      const userID = interaction.user.id;
      const dynamicTimestamp = getDynamicTimestampByMinutes(start);
      const min = 100000; // Smallest 6-digit number
      const max = 999999; // Largest 6-digit number
      const shiftID = Math.floor(Math.random() * (max - min + 1)) + min;

      const exampleEmbed = new EmbedBuilder()
          .setTitle(`Shift announced by ${interaction.user.username}`)
          .setURL('https://www.roblox.com/games/185655149/Welcome-to-Bloxburg')
          .setAuthor({ name: `Host: ${interaction.user.username}` })
          .setDescription(`New shift is starting <t:${dynamicTimestamp}:R>.\nPress the join button to join!\nHost: <@${userID}>`)
          .setThumbnail(`${interaction.user.displayAvatarURL()}`)
          .addFields(
              { name: 'Job Location', value: `${niceJobName}` },
              { name: 'Required Reactions', value: `${requiredReactions}` },
              { name: 'Neighborhood Code', value: `${neighborhoodCode}` },
              { name: 'VC', value: vc ? `${vc} - Join <#1306400672970707025>` : 'No' },
              { name: 'Workers', value: `No one has clocked in yet, be the first one to clock-in by pressing the big green button below, it's hard to miss.` },
              { name: "Shift ID", value: `${shiftID}` }
          )
          .setTimestamp()
          .setColor(color);
          if(interaction.guild.iconURL()){
          exampleEmbed.setImage(`${interaction.guild.iconURL()}`)
          }

          const serverCooldownDuration = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
          const regularUserCooldownDuration = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
          const shiftManagerCooldownDuration = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
          const boosterUserCooldownDuration = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
          
      
          const upcomingEvents = client.eventdatabase.get("upcomingEvents") || [];
          const twoHoursInMilliseconds = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
          const currentTimestamp = Date.now(); // Get the current timestamp

          if (upcomingEvents.length > 0) {
              // Get the start time and host of the closest upcoming event
              const nextEvent = upcomingEvents[0]; // Assuming the events are sorted by start time
              const nextEventStartTime = nextEvent.startTime || 0; // Get the closest event start time

              const eventHost = nextEvent.hostId; // Get the host of the next event

              if (nextEventStartTime) {
                const currentTime = Date.now(); // Current time in milliseconds
                const timeUntilEvent = nextEventStartTime - currentTime; // Time until the next event
            
                // Check if the event is happening within 2 hours before or after
                if ((timeUntilEvent <= twoHoursInMilliseconds && timeUntilEvent > 0) && interaction.user.id !== eventHost) {
                    return interaction.followUp({
                        content: "There is a shift or event happening soon in <#1267959203486502963>. You may not host a shift now."
                    });
                }
              }
          }
          
          let individualCooldownDuration;
          const idid = require("@root/config").CUSTOM.LEADER;
          const idid1 = require("@root/config").CUSTOM.LVL_FIFTY;
          if (interaction.member.premiumSince !== null || interaction.member.roles.cache.has(idid1)) {
            individualCooldownDuration = boosterUserCooldownDuration;
          } else if (interaction.member.roles.cache.has(idid)) {
            individualCooldownDuration = shiftManagerCooldownDuration;
          } else {
            individualCooldownDuration = regularUserCooldownDuration;
          }
        
          // Retrieve last command timestamps from the database
          const lastServerCommandTimestamp = client.shiftdatabase.get("lastServerCommand") || 0;
          const lastUserCommandTimestamp = client.shiftdatabase.get(`${userID}-lastCommand`) || 0;
          
          // Calculate when the cooldowns will end
          const serverCooldownEndTimestamp = lastServerCommandTimestamp + serverCooldownDuration;
          const userCooldownEndTimestamp = lastUserCommandTimestamp + individualCooldownDuration;
          
          const isServerCooldownActive = currentTimestamp < serverCooldownEndTimestamp;
          const isUserCooldownActive = currentTimestamp < userCooldownEndTimestamp;
          
          if (isServerCooldownActive) {
              const serverCooldownRemaining = Math.floor(serverCooldownEndTimestamp / 1000);
              return interaction.followUp({
                  content: `We're on break! Sorry, you cannot host another session right now. Try again <t:${serverCooldownRemaining}:R> (<t:${serverCooldownRemaining}:F>).`,
              
              });
          }
          
          if (isUserCooldownActive) {
            const userCooldownRemaining = Math.floor(userCooldownEndTimestamp / 1000); // Convert to seconds
            const userCooldownDurationMs = userCooldownEndTimestamp - currentTimestamp; // Get remaining time in milliseconds
        
            // Check if the cooldown is permanent (cooldownEndTimestamp is longer than 100 years)
            if (userCooldownEndTimestamp > 100 * 12 * 30 * 24 * 60 * 60 * 1000) {
                return interaction.followUp({
                    content: `You are permanently banned from hosting shifts.`,
                });
            }
        
            // Check if the cooldown is longer than 23 hours
            if (userCooldownDurationMs > 23 * 60 * 60 * 1000) {
                return interaction.followUp({
                    content: `You are currently banned from hosting shifts. You may host again on <t:${userCooldownRemaining}:F>.`,
                });
            }
        
            // Normal cooldown message if it's under 23 hours
            return interaction.followUp({
                content: `Wait a minute! Let someone else have a chance to host. You can host again <t:${userCooldownRemaining}:R> (<t:${userCooldownRemaining}:F>).`,
            });
        }
        
        
         
          const job1 = extractEmoji(niceJobName)
       
          const jobDetail = getJobDetails(job1)
       
         
          client.channels.fetch(channelID)
          /**
   * @param {import("discord.js").TextChannel} channel
   */
          .then(async (channel) => {
            
              if (channel && channel.send) {
                let buttonsRow = new ActionRowBuilder().addComponents(
                  new ButtonBuilder().setCustomId("join").setLabel("Clock-in").setStyle(ButtonStyle.Success).setEmoji(jobDetail.Emoji),
                  new ButtonBuilder().setCustomId("leave").setLabel("Clock-out").setStyle(ButtonStyle.Danger),
                  new ButtonBuilder().setStyle(ButtonStyle.Link).setURL("https://discord.com/channels/1256349528190222386/1267959178249371770").setLabel("Rules")
                );
                  const message = await channel.send({
                      content: `# Who's ready to work at ${niceJobName}?\n\n<@&${roleID}> <@&${dominus}>`,
                      embeds: [exampleEmbed],
                      components: [buttonsRow]
                  });

               
                 const messageID = message.id
               
                  client.shiftdatabase.set(`${shiftID}-shiftID`, messageID)
                  const timeToStart = Number(start)
                  if(!timeToStart){

                  }else{
                  const timeSet = timeToStart * 60 * 1000
                  const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: timeSet });
                  
                  const users = [];
                  
                  collector.on('collect', (i) => {
                    
                      if(i.user.id == client.user.id){
                        
                      }
                        if (i.customId === 'join') {
                          if (users.includes(i.user.id)) {
                              i.reply({
                                  content: "You already have reacted!",
                                  ephemeral: true
                              });
                          } else {
                              i.reply({
                                  content: "Thanks for reacting! Please understand you are now obligated to join the shift.",
                                  ephemeral: true
                              });
                              users.push(i.user.id);
                          }
                      } else if (i.customId === 'leave') {
                          if (users.includes(i.user.id)) {
                              users.splice(users.indexOf(i.user.id), 1);
                              i.reply({
                                  content: "You have clocked out successfully.",
                                  ephemeral: true
                              });
                          } else {
                              i.reply({
                                  content: "You were not clocked in.",
                                  ephemeral: true
                              });
                          }
                      } 
                            let ping = '';
                            if (users.length === 0) {
                                ping = `No one has clocked in yet, be the first one to clock-in by pressing the big green button below, it's hard to miss.`;
                            } else {
                                users.forEach((user, index) => {
                                if (index === users.length - 1) {
                                  ping += `<@${user}>.`;  // Add a period after the last user
                                } else {
                                  ping += `<@${user}>, `;  // Add a comma after every other user
                                }
                            });
                      }
                          const newEmbed = new EmbedBuilder()
                          .setTitle(`Shift announced by ${interaction.user.username}`)
                          .setURL('https://www.roblox.com/games/185655149/Welcome-to-Bloxburg')
                          .setAuthor({ name: `Host: ${interaction.user.username}` })
                          .setDescription(`New shift is starting <t:${dynamicTimestamp}:R>.\nPress the join button to join!\nHost: <@${userID}>`)
                          .setThumbnail(`${interaction.user.displayAvatarURL()}`)
                          .addFields(
                              { name: 'Job Location', value: `${niceJobName}` },
                              { name: 'Required Reactions', value: `${requiredReactions}` },
                              { name: 'Neighborhood Code', value: `${neighborhoodCode}` },
                              { name: 'VC', value: vc ? `${vc} - Join <#1306400672970707025>` : 'No' },
                              { name: 'Workers', value: `${ping}` },
                              { name: "Shift ID", value: `${shiftID}` }
                          )
                          .setTimestamp()
                          .setColor(color);
                          message.edit({
                            embeds: [newEmbed]
                          })
                          if(interaction.guild.iconURL()){
                          exampleEmbed.setImage(`${interaction.guild.iconURL()}`)
                          };

                    
                      }
                     
                  
                  );


                  
                  collector.on('end', async (collected) => {
                    let buttonsRow1 = new ActionRowBuilder().addComponents(
                      new ButtonBuilder().setCustomId("join").setLabel("Clock-in").setStyle(ButtonStyle.Success).setEmoji(jobDetail.Emoji).setDisabled(true),
                      new ButtonBuilder().setCustomId("leave").setLabel("Clock-out").setStyle(ButtonStyle.Danger).setDisabled(true),
                      new ButtonBuilder().setStyle(ButtonStyle.Link).setURL("https://discord.com/channels/1256349528190222386/1267959178249371770").setLabel("Rules")
                    );

                    await message.edit({
                      components: [buttonsRow1]
                    })
                   
                      const num = Number(requiredReactions);
             
          
                      const i = Number(collected.size);
                      if(users.length <= 0){
                        client.shiftdatabase.delete("lastServerCommand")
                        client.shiftdatabase.delete(`${shiftID}-shiftID`)

                      return message.reply({
                      content: "This shift has been cancelled because no one clocked-in!"
                      })
                      }
                     
                      
                      if(users.length >= num){

                        
                      const checking = client.shiftdatabase.get(`${shiftID}-shiftID`);
                    
                      if(checking){
                      let ping = '';
                      users.forEach((user, index) => {
                          if (index === users.length - 1) {
                              ping += `<@${user}>.`;  // Add a period after the last user
                          } else {
                              ping += `<@${user}>, `;  // Add a comma after every other user
                          }
                      });
                  
                      
                      message.reply({
                          content: `# The shift posted by <@${interaction.user.id}> has just started.\nPlease enter \`${neighborhoodCode}\` in the [Bloxburg](<https://www.roblox.com/games/185655149/Welcome-to-Bloxburg>) Neighborhoods menu to attend.\nShift job: ${niceJobName}\n**Workers:** ${ping}`
                      })
                  }
              }else{
                  
                  
                  message.reply({
                      content: `Not enough workers! There were not enough workers to start the shift.`
                  })
                  client.shiftdatabase.delete("lastServerCommand")
                  client.shiftdatabase.delete(`${shiftID}-shiftID`)
              }
             
                  });
              }

                  interaction.followUp({
                      content: `Successfully posted shift. <#${channelID}>\nShift ID: \`${shiftID}\``,
                  });

                
                  client.shiftdatabase.set("lastServerCommand", currentTimestamp);
                  client.shiftdatabase.set(`${userID}-lastCommand`, currentTimestamp);

              } else {
                  throw new Error("Channel not found or `channel.send` is not a function");
              }
          })
          .catch(error => {
              console.error("Error fetching the channel or sending the message:", error);
          });

    }

    else if (sub === "end") {
      
        const shift_id1 = interaction.options.getNumber("shift-id")
        const shiftID = shift_id1.toString()
    
        const messageID = client.shiftdatabase.get(`${shiftID}-shiftID`)
       
        if (!messageID) {
           
            await interaction.followUp({
                content: `Shift ID ${shiftID} is not found!`
            })
            return
        }
        const channelID = interaction.client.shiftdatabase.get("channelID-");

        interaction.client.channels.fetch(channelID)
            .then(async (channel) => {
                if (channel && channel.send) {
                    const message = await channel.messages.fetch(messageID)
                    

                    const embedDescription = (message.embeds[0].description)

                    function extractNumber(str) {
                        const regex = /<@(\d+)>/;
                        const match = str.match(regex);
                        return match ? match[1] : null;
                    }

                    function extractTimestamp(str) {
                        const regex = /<t:(\d+):R>/;
                        const match = str.match(regex);
                        return match ? match[1] : null;
                    }

                    const timestamp = extractTimestamp(embedDescription);
                    const authorID = extractNumber(embedDescription);
                    const serverCooldownDuration = 2 * 60 * 60 * 1000; 
                    const lastServerCommandTimestamp = interaction.client.shiftdatabase.get("lastServerCommand");
                    const serverCooldownEndTimestamp = lastServerCommandTimestamp ? lastServerCommandTimestamp + serverCooldownDuration : 0;
                    const howMuchLeftServerTimestamp = Math.floor(serverCooldownEndTimestamp / 1000);

                    if (!interaction.guild) {
                      return message.reply("This command can only be used in a server.");
                    }

                    let upcomingShifts = interaction.client.eventdatabase.get("upcomingEvents") || [];

                    // Fetch the first event details from the upcoming shifts array
                    let eventDetails = upcomingShifts.length > 0 ? upcomingShifts[0] : null;
                    let currentTime = Date.now();
                    const idid1 = require("@root/config").CUSTOM.LEADER;

                    // Check if the event has started
                    if (eventDetails && currentTime >= eventDetails.startTime) {
                        // Check if the person ending the shift is the event host or an admin
                        if (eventDetails.hostId === interaction.user.id || interaction.member.permissions.has("Administrator")) {
                            message.reply({
                                content: `This shift that was scheduled for <t:${timestamp}:f> has concluded.`
                            });

                            interaction.client.shiftdatabase.delete(`${shiftID}-shiftID`);

                            if (eventDetails.eventId && interaction.guild && interaction.guild.scheduledEvents) {
                                try {
                                    await interaction.guild.scheduledEvents.delete(eventDetails.eventId);
                                } catch (error) {
                                    await message.reply({
                                        content: 'There was an error deleting the scheduled event.'
                                    });
                                }
                            }
                          const channelID = client.shiftdatabase.get("planAhead-"); // Plan-ahead
                          const channel = await interaction.guild.channels.cache.get(channelID);
                      
                            if (channel) {
                              try {
                                  // Fetch messages from the channel
                                  const messages = await channel.messages.fetch({ limit: 10 });
                                  const sortedMessages = messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);
                          
                                  // Get the first event in the upcomingEvents array
                                  const upcomingEvents = interaction.client.eventdatabase.get("upcomingEvents") || [];
                                  const currentEvent = upcomingEvents[0];

                                  // If the message is found, delete it
                                  if (currentEvent) {
                                    const messageToDelete = sortedMessages.find(msg => msg.content.includes(`https://discord.com/events/${interaction.guild.id}/${currentEvent.eventId}`));
                                      if (messageToDelete) {
                                        await messageToDelete.delete();
                                        upcomingEvents.splice(0, 1);

                                        // Store the updated array back in the database
                                        await interaction.client.eventdatabase.set("upcomingEvents", upcomingEvents);
                                    } else {
                                        await interaction.followUp({
                                            content: 'No message found related to this event.'
                                        });
                                    }
                                  } else {
                                      await message.reply({
                                          content: 'Why no message?'
                                      });
                                  }
                              } catch (error) {
                                  await message.reply({
                                      content: 'There was an error deleting the event message.'
                                  });
                              }
                          } else {
                              await interaction.followUp({
                                  content: `You are not the host of this shift!`
                              });
                              return;
                          }
                        } else {
                            await interaction.followUp({
                                content: `You are not the host of this shift!`
                            });
                            return;
                          }
                    } else if (authorID === interaction.user.id || interaction.member.permissions.has("Administrator") || interaction.member.roles.cache.has(idid1)) {
                        // Proceed if the author or an admin is ending the shift
                        message.reply({
                            content: `This shift that was scheduled for <t:${timestamp}:f> has concluded.`
                        });

                        interaction.client.shiftdatabase.delete(`${shiftID}-shiftID`);
                    } else {
                        await interaction.followUp({
                            content: `You didn't host that shift!`
                        });
                        return;
                    }
                }
            })
              await interaction.followUp({
                  content: `Successfully ended the shift.`
              });
            
                  const targetData = await getUser(interaction.user);
                  targetData.reputation.received += 1;

 
  await targetData.save();


  let allThreads = [];
  await client.threadsdatabase.forEach((value, key) => {
    const ee = extractNumber(key);
    const obj = {
      id: ee[0],
      thread: value
    };
    allThreads.push(obj);
  });



    const existingThread = allThreads.find(info => Number(info.id) === Number(shiftID));

    if (existingThread) {
      // If thread exists, send the reminder embed
      const thread = interaction.guild.channels.cache.get(existingThread.thread);
      await thread.delete()
      client.threadsdatabase.delete(`shift-${shiftID}`)
    }
  
    }
    else if (sub === "list") {
      let filteredKeys = []
            
           await interaction.client.shiftdatabase.forEach((value, key, index) => {
            
              
                if(key.endsWith('-shiftID')){
                    filteredKeys.push({
                        key: key,
                        value: value
                    })
                }
            })

            const exampleEmbed = new EmbedBuilder()
            .setTitle("Active Shifts")
            .setColor(require("@root/config").EMBED_COLORS.BOT_EMBED)
            .setThumbnail(interaction.user.displayAvatarURL())
            .setTimestamp()
            .setDescription(`To end a shift, please use the \`/shift end\` command`);
            if(filteredKeys.length == 0){
                exampleEmbed.addFields({ name: "No shifts available", value: "No shifts are available right now!"})
            }else{
                filteredKeys.forEach(db => {
                    function extractNumber(str) {
                        // Use regular expression to match all numbers in the string
                        const matches = str.match(/\d+/g);
                      
                        // Convert the matched strings to numbers
                        const numbers = matches ? matches.map(Number) : [];
                      
                        return numbers;
                      }
                    const shiftID = extractNumber(db.key)
                   
                    const messageID = db.value 
                  
                  
                    const channelID = client.shiftdatabase.get("channelID-");
                    const serverID = interaction.guildId
                    exampleEmbed.addFields({
                        name: `Shift ${shiftID}`,
                        value: `[Message Link](<https://discord.com/channels/${serverID}/${channelID}/${messageID}>)`,
                        inline: false
                    })

                })
            }
            await interaction.followUp({
                embeds: [exampleEmbed]
            });
    } else if (sub === 'plan') {

        const idid1 = require("@root/config").CUSTOM.LEADER;
        if (!interaction.member.roles.cache.has(idid1) && !interaction.member.permissions.has('Administrator')) {
            return interaction.followUp("You don't have permission to use this command. Only shift managers can plan shifts ahead of time.\nUse `/shift start` if you'd like to host a shift!");
        }
        const start = interaction.options.getString("start-time");
        const job = interaction.options.getString("job");
        const minimumWorkers = interaction.options.getNumber("reactions");
        const image = interaction.options.getAttachment("image");
        
        let niceJobName;
        switch (job) {
            case "benIceCream":
                niceJobName = "🍦 Ben's Ice Cream";
                break;
            case "bffMarket":
                niceJobName = "🛒 BFF Market";
                break;
            case "bloxBurger":
                niceJobName = "🍔 Blox Burger";
                break;
            case "fishing":
                niceJobName = "🎣 The Fishing Hut";
                break;
            case "mechanic":
                niceJobName = "🔧 Mike's Motors";
                break;
            case "bloxburgMines":
                niceJobName = "⛏️ Bloxburg Mines";
                break;
            case "pizzaBaking":
                niceJobName = "🍕 Pizza Planet Kitchen";
                break;
            case "pizzaDelivery":
                niceJobName = "🛵 Pizza Planet Delivery";
                break;
            case "stylezSalon":
                niceJobName = "💈 Stylez Salon";
                break;
            case "janitor":
                niceJobName = "🧹 Green Clean";
                break;
            case "woodCutter":
                niceJobName = "🪓 Lovely Lumber";
                break;
            case "skills":
                niceJobName = "⏫ Skills Leveling";
                break;
            case "bloxburgHigh":
                niceJobName = "🏫 Bloxburg High";
                break;
            case "halloween":
                niceJobName = "🎃 Halloween Event";
                break;
            default:
                niceJobName = "Unknown Job"; // Fallback
        }
    
        // Calculate start time based on the selected duration
        const unixTimestamp = parseInt(start);
        const startTime = new Date(unixTimestamp * 1000);

        // Check if the timestamp is valid
        if (isNaN(unixTimestamp) || unixTimestamp <= 0 || startTime.getTime() < Date.now()) {
            return interaction.followUp("Please provide a valid future Unix timestamp in seconds.");
        }

        if(job == "halloween" && unixTimestamp < 1760022000){
            return interaction.followUp("You cannot plan the shift to start before the Halloween event releases.")
        }

        const upcomingShifts = client.eventdatabase.get("upcomingEvents") || [];
        const twoHoursInMilliseconds = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

        // Get the start time of the new event
        const newEventStart = startTime.getTime(); 

        // Check if any event is within 2 hours before or after the new event
        if (upcomingShifts.length > 0) {
            const conflictEvent = upcomingShifts.find(event => {
                const eventStartTime = new Date(event.startTime).getTime();
                return Math.abs(newEventStart - eventStartTime) < twoHoursInMilliseconds;
            });

            // If a conflicting event is found, prevent scheduling
            if (conflictEvent) {
                return interaction.followUp({
                    content: `Another event is happening within 2 hours of this event. Please plan your event or shift for another time.`
                });
            }
        }

        const shiftManagerCooldownDuration = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
        const boosterUserCooldownDuration = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
        const isUserBooster = interaction.member.premiumSince !== null;
        const isShiftManager = interaction.member.roles.cache.has(idid);
        const individualCooldownDuration = isUserBooster ? boosterUserCooldownDuration : (isShiftManager ? shiftManagerCooldownDuration : 4 * 60 * 60 * 1000);

        // Retrieve last command timestamps from the database
        const lastUserCommandTimestamp = client.shiftdatabase.get(`${interaction.user.id}-lastCommand`) || 0;

        // Calculate when the user cooldown will end
        const userCooldownEndTimestamp = lastUserCommandTimestamp + individualCooldownDuration;

        // Check if the user cooldown is active at the time of the new event
        const fortyFiveMinutesInMilliseconds = 45 * 60 * 1000;
        const thresholdTime = newEventStart - fortyFiveMinutesInMilliseconds; 
        const isUserCooldownActiveAtEventStart = userCooldownEndTimestamp > thresholdTime;

        if (isUserCooldownActiveAtEventStart) {
            return interaction.followUp({
                content: `You cannot host a shift at this time as your cooldown will still be active when your planned shift starts.`
            });
        }
    
        try {
          const voiceChannelId = "1253027857173713060";
          const channelID = client.shiftdatabase.get("planAhead-"); // plan-ahead
          const min = 100000; // Smallest 6-digit number
          const max = 999999; // Largest 6-digit number
          const eventNum = Math.floor(Math.random() * (max - min + 1)) + min;
      
          const eventDurationMinutes = 120;
          const endTime = new Date(startTime.getTime() + eventDurationMinutes * 60000);
      
          const job1 = extractEmoji(niceJobName);
          const jobDetail = getJobDetails(job1);

          let imageUrl = null;
      
          // If an image attachment is provided, extract its URL
          if (image) {
              imageUrl = image.url; // Use this URL for the event image
          }
      
          // Prepare the event options
          let eventOptions = {
              name: `${niceJobName} Shift`,
              description: `Join us for a shift at ${niceJobName}!`,
              scheduledStartTime: startTime.toISOString(),
              scheduledEndTime: endTime.toISOString(),
              privacyLevel: 2, // GUILD_ONLY
              entityType: 3, // Voice events
              entityMetadata: {
                  channel_id: voiceChannelId,
                  location: "SkillsLevelUpBro",
              }
          };
      
          // Only include the image if it's provided as an attachment
          if (imageUrl) {
              eventOptions.image = imageUrl;
          }
      
          // Create the scheduled event
          interaction.guild.scheduledEvents.create(eventOptions)
              .then((event) => {
                const eventDetails = {
                    name: `${niceJobName}`,
                    startTime: startTime.getTime(), // Event start time in milliseconds
                    hostId: interaction.user.id,
                    eventId: event.id,
                    type: "shift",
                    eventNum: eventNum,
                };
      
                const upcomingEvents = client.eventdatabase.get("upcomingEvents") || [];
                upcomingEvents.push(eventDetails);
      
                // Sort the upcoming events array from earliest to latest
                upcomingEvents.sort((a, b) => a.startTime - b.startTime);
      
                // Store the sorted arrays back in the database
                client.eventdatabase.set("upcomingEvents", upcomingEvents);
      
                const twoHours = 2 * 60 * 60 * 1000;
                const currentTime = Date.now(); 
                let withinTwoHours = false;
                const updatedEvents = client.eventdatabase.get("upcomingEvents") || [];

                // Check if the new event is within 2 hours of any existing event
                for (const existingEvent of updatedEvents) {
                    if (existingEvent.announcementSentTime) {
                        const timeDifference = currentTime - existingEvent.announcementSentTime;
                        
                        if (timeDifference < twoHours && existingEvent.eventId !== eventDetails.eventId) {
                            withinTwoHours = true;
                            break;
                        }
                    }
                }
                let announcementMessage;

                if (withinTwoHours) {
                    announcementMessage = `
**Host:** <@${interaction.user.id}>
**Workers Needed:** ${minimumWorkers}

Respond to the shift if you're coming, and stay tuned to <#1267959203486502963> for the session start!
https://discord.com/events/${interaction.guild.id}/${event.id}

<:BEEwarn:1268469054931210291> Starting a shift within 2 hours of this scheduled shift will result in demotion!
-# Event Number to cancel shift: \`${eventNum}\``;
                  } else {
                    announcementMessage = `
# <@&1267959053108383765>
**Host:** <@${interaction.user.id}>
**Workers Needed:** ${minimumWorkers}

Respond to the shift if you're coming, and stay tuned to <#1267959203486502963> for the session start!
https://discord.com/events/${interaction.guild.id}/${event.id}

<:BEEwarn:1268469054931210291> Starting a shift within 2 hours of this scheduled shift will result in demotion!
-# Event Number to cancel shift: \`${eventNum}\``;
                  }
      
                  interaction.guild.channels.fetch(channelID)
                  .then((announcementChannel) => {
                      return announcementChannel.send(announcementMessage);
                  })
                  .then(async (announcementMessage) => {
                      const messageId = announcementMessage.id;
                      const announcementSentTime = Date.now();
                    
                      eventDetails.announcementMessageId = messageId;
                      eventDetails.announcementSentTime = announcementSentTime;
    
                      client.eventdatabase.set("upcomingEvents", upcomingEvents);
                      await announcementMessage.react(jobDetail.Emoji);
                      if (announcementMessage.channel.type === ChannelType.GuildAnnouncement) {
                            try {
                                await announcementMessage.crosspost();
                            } catch (error) {
                                console.error("Failed to crosspost announcement:", error);
                            }
                        }
                      interaction.followUp(`Successfully created the event: **${event.name}** starting at **<t:${Math.floor(startTime.getTime() / 1000)}:F>**!\nEvent Number to cancel: \`${eventNum}\``);
                  })
                  .catch((error) => {
                      console.error("Error sending announcement:", error);
                      interaction.followUp("Error sending the announcement message.");
                  });
              })
              .catch((error) => {
                  console.error("Error creating event:", error);
                  interaction.followUp("There was an error creating the event. Please try again.");
              });
            } catch (error) {
                console.log("Unexpected error:", error);
                interaction.followUp("There was an unexpected error creating the event.");
            }
    } else if (sub === 'cancel') {

      const idid1 = require("@root/config").CUSTOM.LEADER;
      if (!interaction.member.roles.cache.has(idid1) && !interaction.member.permissions.has('Administrator')) {
          return interaction.followUp("You don't have permission to use this command. Only shift managers can cancel a planned shift.");
      }
      const eventNum = interaction.options.getNumber('event-num');
      const upcomingShifts = client.eventdatabase.get("upcomingEvents") || [];

      // Use find to locate the event with the matching eventNum
      const matchingEvent = upcomingShifts.find(event => event.eventNum === eventNum);

      if (matchingEvent) {
          // Check if the user is the host of the matching event
          if (matchingEvent.hostId === interaction.member.id || interaction.member.permissions.has('Administrator')) {
              const channelID = client.shiftdatabase.get("planAhead-"); // Plan-ahead
              const channel = await interaction.guild.channels.cache.get(channelID);

              if (channel) {
                  try {
                      // Fetch messages from the channel
                      const messages = await channel.messages.fetch({ limit: 10 });
                      const sortedMessages = messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);

                      // If the message is found, delete it
                      const messageToDelete = sortedMessages.find(msg => msg.content.includes(`https://discord.com/events/${interaction.guild.id}/${matchingEvent.eventId}`));
                      
                      if (messageToDelete) {
                          await messageToDelete.delete();

                          // Remove the event from the upcomingEvents array
                          const index = upcomingShifts.indexOf(matchingEvent);
                          if (index > -1) {
                              upcomingShifts.splice(index, 1);
                          }

                          // Store the updated array back in the database
                          await interaction.client.eventdatabase.set("upcomingEvents", upcomingShifts);

                          // Optionally, delete the scheduled event if necessary
                          if (interaction.guild && interaction.guild.scheduledEvents) {
                              try {
                                  await interaction.guild.scheduledEvents.delete(matchingEvent.eventId);
                              } catch (error) {
                                  await interaction.followUp({
                                      content: 'There was an error deleting the scheduled event.'
                                  });
                              }
                          }

                          await interaction.followUp({
                              content: 'The event and its message have been successfully deleted.'
                          });
                      } else {
                          const index = upcomingShifts.indexOf(matchingEvent);
                          if (index > -1) {
                              upcomingShifts.splice(index, 1);
                          }

                          // Store the updated array back in the database
                          await interaction.client.eventdatabase.set("upcomingEvents", upcomingShifts);

                          // Optionally, delete the scheduled event if necessary
                          if (interaction.guild && interaction.guild.scheduledEvents) {
                              try {
                                  await interaction.guild.scheduledEvents.delete(matchingEvent.eventId);
                              } catch (error) {
                                  await interaction.followUp({
                                      content: 'There was an error deleting the scheduled event.'
                                  });
                              }
                          }
                          await interaction.followUp({
                              content: 'No message found related to this event.'
                          });
                      }
                  } catch (error) {
                      await interaction.followUp({
                          content: 'There was an error deleting the event message.'
                      });
                  }
              } else {
                  await interaction.followUp({
                      content: 'The channel for this event could not be found.'
                  });
              }
          } else {
              await interaction.followUp({
                  content: `You are not the host of this shift!`
              });
          }
      } else {
          await interaction.followUp({
              content: `No events found with the number: ${eventNum}`
          });
      }
    }       
  }
}