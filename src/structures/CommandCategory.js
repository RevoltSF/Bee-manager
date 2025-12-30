const config = require("@root/config");

module.exports = {
  ADMIN: {
    name: "Admin",
    image: "https://icons.iconarchive.com/icons/dakirby309/simply-styled/256/Settings-icon.png",
    emoji: "⚙️",
  },
  ECONOMY: {
    name: "Economy",
    enabled: config.ECONOMY.ENABLED,
    image: "https://icons.iconarchive.com/icons/custom-icon-design/pretty-office-11/128/coins-icon.png",
    emoji: "🪙",
  },
  FUN: {
    name: "Fun",
    image: "https://icons.iconarchive.com/icons/flameia/aqua-smiles/128/make-fun-icon.png",
    emoji: "😂",
  },
  GIVEAWAY: {
    name: "Giveaway",
    enabled: config.GIVEAWAYS.ENABLED,
    image: "https://cdn-icons-png.flaticon.com/512/4470/4470928.png",
    emoji: "🎉",
  },
  IMAGE: {
    name: "Image",
    enabled: config.IMAGE.ENABLED,
    image: "https://icons.iconarchive.com/icons/dapino/summer-holiday/128/photo-icon.png",
    emoji: "🖼️",
  },
  INVITE: {
    name: "Invite",
    enabled: config.INVITE.ENABLED,
    image: "https://cdn4.iconfinder.com/data/icons/general-business/150/Invite-512.png",
    emoji: "📨",
  },
  INFORMATION: {
    name: "Information",
    image: "https://icons.iconarchive.com/icons/graphicloads/100-flat/128/information-icon.png",
    emoji: "🪧",
  },
  MODERATION: {
    name: "Moderation",
    enabled: config.MODERATION.ENABLED,
    image: "https://icons.iconarchive.com/icons/lawyerwordpress/law/128/Gavel-Law-icon.png",
    emoji: "🔨",
  },
  MUSIC: {
    name: "Music",
    enabled: config.MUSIC.ENABLED,
    image: "https://icons.iconarchive.com/icons/wwalczyszyn/iwindows/256/Music-Library-icon.png",
    emoji: "🎵",
  },
  OWNER: {
    name: "Owner",
    image: "https://www.pinclipart.com/picdir/middle/531-5318253_web-designing-icon-png-clipart.png",
    emoji: "🤴",
  },
  STATS: {
    name: "Statistics",
    enabled: config.STATS.ENABLED,
    image: "https://icons.iconarchive.com/icons/graphicloads/flat-finance/256/dollar-stats-icon.png",
    emoji: "📈",
  },
  SUGGESTION: {
    name: "Suggestion",
    enabled: config.SUGGESTIONS.ENABLED,
    image: "https://cdn-icons-png.flaticon.com/512/1484/1484815.png",
    emoji: "📝",
  },
  TICKET: {
    name: "Ticket",
    enabled: config.TICKET.ENABLED,
    image: "https://icons.iconarchive.com/icons/custom-icon-design/flatastic-2/512/ticket-icon.png",
    emoji: "🎫",
  },
  UTILITY: {
    name: "Utility",
    image: "https://icons.iconarchive.com/icons/blackvariant/button-ui-system-folders-alt/128/Utilities-icon.png",
    emoji: "🛠",
  },
  NSFW: {
    name: "NSFW",
    image: "https://media.discordapp.net/attachments/1258137037077479569/1258367591966179328/images__2_-removebg-preview_1.png?ex=6687c9a5&is=66867825&hm=7151e476c959cdd1641dcef0023973bbb41aa909c625251f831881b18f7d351b&=&format=webp&quality=lossless",
    emoji: "🔞",
    nsfw: true
  },
  CONFESSION: {
    name : "Confession",
    image: "https://icons.iconarchive.com/icons/fa-team/fontawesome/128/FontAwesome-User-Secret-icon.png",
    emoji: "🤫"
  },
  BLOXBURG: {
    name: "Bloxburg",
    image: "https://media.discordapp.net/attachments/1264241762877046836/1264855354421018635/2836-coeptus-pat.gif?ex=669f63d8&is=669e1258&hm=061f311b490c4fe728627cfbf3ce4bb5a4ee06efcf527af74c2ad6c5bacc0c8f&=",
    emoji: "<a:coeptus:1264855018666987540>"
  },
  ORDERS: {
    name: "Orders",
    image: "https://icons.iconarchive.com/icons/graphicloads/100-flat/128/sale-tag-icon.png",
    emoji: "🛒"
  }
};
