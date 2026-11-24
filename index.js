
require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  Events
} = require("discord.js");

const { checkAction } = require("./systems/antinuke");
const { registerLogger } = require("./events/logger");
const { registerModerationLogger } = require("./events/moderation");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration
  ]
});

client.once(Events.ClientReady, bot => {
  console.log("======================================");
  console.log("          NEXORA SECURITY");
  console.log("======================================");
  console.log(`Status: ONLINE`);
  console.log(`Bot: ${bot.user.tag}`);
  console.log(`Servers: ${bot.guilds.cache.size}`);

  registerLogger(bot);
  registerModerationLogger(bot);

  console.log("Audit System: CONNECTED");
  console.log("Moderation Logs: CONNECTED");
  console.log("Anti-Nuke: CONNECTED");
  console.log("======================================");
});

client.on(
  Events.GuildAuditLogEntryCreate,
  async (entry, guild) => {
    await checkAction(entry, guild);
  }
);

client.on(Events.Error, error => {
  console.error("[NEXORA ERROR]", error);
});

if (!process.env.DISCORD_TOKEN) {
  console.error("[NEXORA] Missing DISCORD_TOKEN!");
  process.exit(1);
}

client.login(process.env.DISCORD_TOKEN);
