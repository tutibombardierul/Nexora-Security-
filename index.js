
require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  Events
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration
  ]
});

client.once(Events.ClientReady, (bot) => {
  console.log(`NEXORA SECURITY online: ${bot.user.tag}`);
  console.log(`Servers: ${bot.guilds.cache.size}`);
});

client.on(Events.Error, (error) => {
  console.error("Discord error:", error);
});

if (!process.env.DISCORD_TOKEN) {
  console.error("Missing DISCORD_TOKEN environment variable.");
  process.exit(1);
}

client.login(process.env.DISCORD_TOKEN);
