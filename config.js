module.exports = {
  OWNER_IDS: ["945299261195710507", "271078843786330114", "324660105784066048"], // Bot owner ID's
  SUPPORT_SERVER: "", // Your bot support server
  PREFIX_COMMANDS: {
    ENABLED: false, // Enable/Disable prefix commands
    DEFAULT_PREFIX: ",", // Default prefix for the bot
  },
  INTERACTIONS: {
    SLASH: true, // Should the interactions be enabled
    CONTEXT: true, // Should contexts be enabled
    GLOBAL: true, // Should the interactions be registered globally
    TEST_GUILD_ID: "1256349528190222386", // Guild ID where the interactions should be registered. [** Test you commands here first **]
  },
  EMBED_COLORS: {
    BOT_EMBED: "#faa907",
    TRANSPARENT: "#36393F",
    SUCCESS: "#00A56A",
    ERROR: "#D61A3C",
    WARNING: "#F7E919",
    BOT_EMBED1: "068ADD",
  },
  CACHE_SIZE: {
    GUILDS: 100,
    USERS: 10000,
    MEMBERS: 10000,
  },
  MESSAGES: {
    API_ERROR: "Unexpected Backend Error! Try again later or contact support server",
  },

  // PLUGINS

  AUTOMOD: {
    ENABLED: false,
    LOG_EMBED: "#36393F",
    DM_EMBED: "#36393F",
  },

  DASHBOARD: {
    enabled: false // enable or disable dashboard

  },

   ECONOMY: {
    ENABLED: true,
    CURRENCY: "BBC",
    DAILY_COINS: 100,
    MIN_BEG_AMOUNT: 100,
    MAX_BEG_AMOUNT: 2500,
    MIN_STEAL_PENALTY: 100,
    MAX_STEAL_PENALTY: 1000,
    MIN_STEAL_AMOUNT: 100,
    MAX_STEAL_AMOUNT: 6969,
    MIN_WORK_AMOUNT: 500,
    MAX_WORK_AMOUNT: 2000,
    JOBS: [
      { label: "Gardener", value: "gardener", description: "Take care of plants and landscapes", emoji: "🌿" },
      { label: "Chef", value: "chef", description: "Cook delicious meals", emoji: "🍳" },
      { label: "Engineer", value: "engineer", description: "Design and build solutions", emoji: "🛠️" },
      { label: "Artist", value: "artist", description: "Create stunning artworks", emoji: "🎨" },
      { label: "Doctor", value: "doctor", description: "Heal and treat patients", emoji: "⚕️" },
      { label: "Teacher", value: "teacher", description: "Educate and inspire students", emoji: "📚" },
      { label: "Musician", value: "musician", description: "Play and compose music", emoji: "🎵" },
      { label: "Writer", value: "writer", description: "Write stories and articles", emoji: "✍️" },
      { label: "Police Officer", value: "police_officer", description: "Maintain law and order", emoji: "👮‍♂️" },
      { label: "Firefighter", value: "firefighter", description: "Fight fires and save lives", emoji: "🚒" },
      { label: "Pilot", value: "pilot", description: "Fly airplanes and helicopters", emoji: "✈️" },
      { label: "Nurse", value: "nurse", description: "Provide care to patients", emoji: "👩‍⚕️" },
      { label: "Photographer", value: "photographer", description: "Capture moments with photography", emoji: "📸" },
      { label: "Developer", value: "developer", description: "Develop software and applications", emoji: "💻" },
      { label: "Designer", value: "designer", description: "Design graphics and visuals", emoji: "🎨" },
      { label: "Journalist", value: "journalist", description: "Report news and events", emoji: "📰" },
      { label: "Mechanic", value: "mechanic", description: "Repair and maintain vehicles", emoji: "🔧" },
      { label: "Baker", value: "baker", description: "Bake bread and pastries", emoji: "🍞" },
      { label: "Farmer", value: "farmer", description: "Grow crops and raise animals", emoji: "🌾" },
      { label: "Actor", value: "actor", description: "Perform in movies and plays", emoji: "🎭" },
      { label: "Barista", value: "barista", description: "Make and serve coffee", emoji: "☕" },
      { label: "Carpenter", value: "carpenter", description: "Build and repair wooden structures", emoji: "🛠️" },
      { label: "Electrician", value: "electrician", description: "Install and maintain electrical systems", emoji: "💡" },
      { label: "Plumber", value: "plumber", description: "Install and repair plumbing", emoji: "🚰" },
      { label: "Lawyer", value: "lawyer", description: "Represent clients in legal cases", emoji: "⚖️" },
    ],
  },
  

    MUSIC: {
    ENABLED: false,
    IDLE_TIME: 60, // Time in seconds before the bot disconnects from an idle voice channel
    MAX_SEARCH_RESULTS: 5,
    DEFAULT_SOURCE: "YT", // YT = Youtube, YTM = Youtube Music, SC = SoundCloud
    // Add any number of lavalink nodes here
    LAVALINK_NODES: [
      {
        host: "sg.aarubot.xyz",
        port: 57010,
        password: "Ayano",
        id: "Aaru",
        secure: false,
      },
    ],
  },

  GIVEAWAYS: {
    ENABLED: true,
    REACTION: "🎁",
    START_EMBED: "#FF468A",
    END_EMBED: "#FF468A",
  },

  IMAGE: {
    ENABLED: true,
    BASE_API: "https://strangeapi.hostz.me/api",
  },

  INVITE: {
    ENABLED: true,
  },

  MODERATION: {
    ENABLED: false,
    EMBED_COLORS: {
      TIMEOUT: "#102027",
      UNTIMEOUT: "#4B636E",
      KICK: "#FF7961",
      SOFTBAN: "#AF4448",
      BAN: "#D32F2F",
      UNBAN: "#00C853",
      VMUTE: "#102027",
      VUNMUTE: "#4B636E",
      DEAFEN: "#102027",
      UNDEAFEN: "#4B636E",
      DISCONNECT: "RANDOM",
      MOVE: "RANDOM",
    },
  },

  PRESENCE: {
    ENABLED: true, // Whether or not the bot should update its status
    STATUS: "idle", // The bot's status [online, idle, dnd, invisible]
    TYPE: "WATCHING", // Status type for the bot [PLAYING | LISTENING | WATCHING | COMPETING]
    MESSAGE: "{members} people in a non-creepy way", // Your bot status message
  },

  STATS: {
    ENABLED: true,
    XP_COOLDOWN: 5, // Cooldown in seconds between messages
    DEFAULT_LVL_UP_MSG: "{member:tag}, You just advanced to **Level {level}**",
  },

  SUGGESTIONS: {
    ENABLED: true, // Should the suggestion system be enabled
    EMOJI: {
      UP_VOTE: "⬆️",
      DOWN_VOTE: "⬇️",
    },
    DEFAULT_EMBED: "#4F545C",
    APPROVED_EMBED: "#43B581",
    DENIED_EMBED: "#F04747",
  },

  TICKET: {
    ENABLED: true,
    CREATE_EMBED: "#068ADD",
    CLOSE_EMBED: "#068ADD"
  },

  CUSTOM: {
    LVL_FIFTY: '1267959011324596328', //level 50
    RULE_CHANNEL_ID: "1267959178249371770",
    NEIGHBORHOOD: "Supreme_goat372",
    SHIFT_MANAGER: "1268534258264313967", //Level 2
    LEADER: "1267959004873752647", //Shift Manager
    NEW_ROLE: "1267959010380877904"
  },
  
  SHIFTS: {
    "benIceCream": {
      "Banner": "https://media.discordapp.net/attachments/1264241799333941339/1265004432412770425/Seller.png?ex=66a0976f&is=669f45ef&hm=57cabbb511c55e870ba8f2ed4e22ff52aa6a6955d0c79ea0cbf040d454b36732&=&format=webp&quality=lossless",
      "Emoji": "🍦",
      "Icon": "https://cdn.discordapp.com/attachments/1265047540869370051/1265360814081183794/Untitled_design__3_-removebg-preview.png?ex=66a13a97&is=669fe917&hm=2415ce3559bef8062c5ad19ede245d03ade3ef133074d0b6c1094ae0212711eb&",
      "ROLE_ID": "1265358580090142722"
    },
    "bffMarket": {
      "Banner": "https://media.discordapp.net/attachments/1264241799333941339/1265004410275238000/Bloxburg_Fresh_Food.png?ex=66a0976a&is=669f45ea&hm=795501a34a23dbf60aef46e696b6983087959e92799b9eab282b3002f735a1b1&=&format=webp&quality=lossless",
      "Emoji": "🛒",
      "Icon": "https://cdn.discordapp.com/attachments/1265047540869370051/1265320477539172503/Untitled_design-removebg-preview.png?ex=66a11506&is=669fc386&hm=22767fdb3f60be636d3b9e29024ebec95f3806506a5140ee8125e9bd17322b63&",
      "ROLE_ID": "1265358580090142722"
    },
    "bloxBurger": {
      "Banner": "https://media.discordapp.net/attachments/1264241799333941339/1265004410824822857/Fast_Food_Worker.png?ex=66a0976a&is=669f45ea&hm=94888f2bba321e5b813742e4937b926a27bad6c940435bcb29a8e4cef5667ea9&=&format=webp&quality=lossless",
      "Emoji": "🍔",
      "Icon": "https://cdn.discordapp.com/attachments/1265047540869370051/1265358809459855511/Untitled_design__2_-removebg-preview.png?ex=66a138b9&is=669fe739&hm=03f0082f88b092c453cec85a23e90087d3f678a7a858b1e28d9fcf35a13435df&",
      "ROLE_ID": "1265358580090142722"
    },
    "fishing": {
      "Banner": "https://media.discordapp.net/attachments/1264241799333941339/1265004411046858924/Fisherman.png?ex=66a0976a&is=669f45ea&hm=472fbf1528ffb0a2ee35484d20b27f1c6e99b81962a2a1462c2f36bf3be72198&=&format=webp&quality=lossless",
      "Emoji": "🎣",
      "Icon": "https://media.discordapp.net/attachments/1264241799333941339/1265370998887419924/GiantSeashellTrophy.webp?ex=66a14413&is=669ff293&hm=f061d4a1e14fa5274c052fa88437135fa9726251eb04627a9e28d259cbee99c4&=&format=webp",
      "ROLE_ID": "1265358580090142722"
    },
    "mechanic": {
      "Banner": "https://media.discordapp.net/attachments/1264241799333941339/1265004433285185576/Mechanic.png?ex=66a0976f&is=669f45ef&hm=aefee74e868478e1629b1d190f6c845418e1aba0222d80a7f4421992c101503a&=&format=webp&quality=lossless",
      "Emoji": "🔧",
      "Icon": "https://cdn.discordapp.com/attachments/1265047540869370051/1265346057991229520/OilCan.webp?ex=66a12cd9&is=669fdb59&hm=180029e180518e2d07e2b622da119a73c8af26543f33662db69c9397bc3cf43d&",
      "ROLE_ID": "1265358580090142722"
    },
    "bloxburgMines": {
      "Banner": "https://media.discordapp.net/attachments/1264241799333941339/1265004431871574108/Miner.png?ex=66a0976f&is=669f45ef&hm=4b9f58ad631ad7ddd74f502c6ebdcb3d1e1859d0a6daa71f68103bc7f34b309e&=&format=webp&quality=lossless",
      "Emoji": "⛏️",
      "Icon": "https://cdn.discordapp.com/attachments/1265047540869370051/1265344351282794681/TNT-removebg-preview_1.png?ex=66a12b42&is=669fd9c2&hm=6359d7cc325d60132a4ab8e49c041b7661db4a4b9612ad910a3d386e0a9df337&",
      "ROLE_ID": "1265358580090142722"
    },
    "pizzaBaking": {
      "Banner": "https://media.discordapp.net/attachments/1264241799333941339/1265004432144207892/Pizza_Baker.png?ex=66a0976f&is=669f45ef&hm=07d0bf1e56dea77d4ab2bca81bf71351c14c9e47c5bf5996509df41701b51cdd&=&format=webp&quality=lossless",
      "Emoji": "🍕",
      "Icon": "https://cdn.discordapp.com/attachments/1265047540869370051/1265321123076374631/LogoPlanetSquareNew.webp?ex=66a115a0&is=669fc420&hm=9d9c2245a98ab2334746b14292d281e951f1c0e9caeb5e9894c88ccb092bf6de&",
      "ROLE_ID": "1265358580090142722"
    },
    "pizzaDelivery": {
      "Banner": "https://media.discordapp.net/attachments/1264241799333941339/1265004410593874044/Delivery_Person.png?ex=66a0976a&is=669f45ea&hm=108c80d90afd8331ed309d119dfe07cf03695ae68537457de90ca9acb74fe6ac&=&format=webp&quality=lossless",
      "Emoji": "🛵",
      "Icon": "https://cdn.discordapp.com/attachments/1265047540869370051/1265320460040671306/PizzaPlanetBox.webp?ex=66a11502&is=669fc382&hm=3be60aed3d7702f1ba0a05ec5f08f42f773813e50a568a240c1f62353a742deb&",
      "ROLE_ID": "1265358580090142722"
    },
    "stylezSalon": {
      "Banner": "https://media.discordapp.net/attachments/1264241799333941339/1265004411344650341/Hairdresser.png?ex=66a0976a&is=669f45ea&hm=38fd2241b039ce380c0ad393609010983801ef7b0ff10c707a27a6c3f9600cbf&=&format=webp&quality=lossless",
      "Emoji": "💈",
      "Icon": "https://cdn.discordapp.com/attachments/1265047540869370051/1265340791472259152/cartoon-image-of-hair-dryer-vector-15676305-removebg-preview.png?ex=66a127f1&is=669fd671&hm=7aff9b6f5c2dea9d75ebdc6e4a990ab4b2ef083529103d6e3de1ee5b967d250b&",
      "ROLE_ID": "1265358580090142722"
    },
    "janitor": {
      "Banner": "https://media.discordapp.net/attachments/1264241799333941339/1265004409998278666/Janitor.png?ex=66a09769&is=669f45e9&hm=b84605acb52f87832ce00e0093e4270168a57228daf604ca8f8a8b4d449e4e6a&=&format=webp&quality=lossless",
      "Emoji": "🧹",
      "Icon": "https://cdn.discordapp.com/attachments/1265047540869370051/1265326493396107324/JanitorEquipment.webp?ex=66a11aa0&is=669fc920&hm=8fdd281cedfa72ed9f77dc4bbe2318fe05613170d173aaea53a14ef2f048d204&",
      "ROLE_ID": "1265358580090142722"
    },
    "woodCutter": {
      "Banner": "https://media.discordapp.net/attachments/1264241799333941339/1265004433029206076/Woodcutter.png?ex=66a0976f&is=669f45ef&hm=e36f5347a17aa8b8d795d9dea27a8601069946110b50123e7a8fecb9764179d3&=&format=webp&quality=lossless",
      "Emoji": "🪓",
      "Icon": "https://cdn.discordapp.com/attachments/1265047540869370051/1265325293766180964/Hatchet.webp?ex=66a11982&is=669fc802&hm=628f8c0b7bac7605e43f688d209de3d2e80aa3ef1099861436822e94d5cd25db&",
      "ROLE_ID": "1265358580090142722"
    },
    "skills": {
      "Emoji": "⏫", 
    },
    "bloxburgHigh": {
      "Emoji": "🏫",
    },
    "taxi": {
      "Emoji": "🚕",
    },
    "academic": {
      "Emoji": "🎓",
    },
    "halloween": {
      "Emoji": "🎃",
    },
    LOG: "1255130275764240404",
    CHANNELPING: "1267959192992616458"
  },
  AI: {
    channelID: "1275425872790294588",
   
    apiKey: "AIzaSyBmJCClth8bR22EfDOp6jLAax0ahDqddsI"
  },
  TIMEZONE_ROLES: {
    GLOBAL: "1266116007299125361",
    AMERICAS: "1266116037829460160",
    ASIA: "1266116060579631186",
    EUROPE: "1266116087263531090",
    OCEANIA: "1266116236840800336"
  },
  BOOST: {
    STATUS: true,
    CHANNELID: "1267959189259554886",
    ROLEID: "1268299174609158165",
    CONTENT: `{member:mention}`,
    EMBED_TITLE: `__**<:BEEboost:1268789869283512341> {server:boosts} boosts**__`,
    EMBED_DESCRIPTION: `* Thank you for boosting\n* We are now tier {server:level}`,
    EMBED_FOOTER: `{member:username}`,
    EMBED_THUMBNAIL: `{server:icon}`,
    EMBED_IMAGE: ``,
    EMBED_FOOTER_ICON: `{member:profilePicture}`,
    EMBED_TIMESTAMP: true,
    /**
    All the things you can add: 
  {member:mention}: Mention
  {member:username} User
  {member:tag} Tag
  {member:id} ID

  {server} Server Name
  {server:count} Server's members
  {server:boosts} Server's boosts
  {server:level} Server's boost level

  {server:icon}
  {server:banner} (If there is no banner, it will show the server's icon)
  {member:profilePicture}

  Note: if no embed fields are filled out, embed will be skipped
  If no content is filled out, content will be skipped
 
    **/
  },
  BLOXBURG_ORDERS: {
    ROLE_ID: "1267959017712517180",
    STARTER_CATEGORY: "1268597932207112336",
    PROGRESS_CATEGORY: "1268597932207112336",
    DONE_CATEGORY: "1268597932207112336",
    INLINE: true,
    CATETER_MANAGER: "1270467594117447781",
    CATERING_LOGS: "1270468400858267730",
    CATERING_DEPT: "1332092881464201237",
  },
  PROOFS: {
    CHANNELID: "1267959207399788625",
    MANAGER: "1270467594117447781"
    
  },
  REVIEWS: {
    channelid: "1253307723773251645"
  },
  TICKETING: {
    category: "1267959169055457352",
    modrole: "1268995995375505458"
  },
  STATSINFO: {
    guildID: "1256349528190222386",
    allMembers: "1268594699984306351",
    boost: "1268594712919412787",
    human: "1268594704795045992",
    active: "1268594709069041817"
  },
  WORKSTATS: {
    workStatsChannel: "1270635130893107283",
    proofChannel: "1267959207399788625",
    proofManagement: "1286441310298832947",
    guild: "1256349528190222386"
  }
};
