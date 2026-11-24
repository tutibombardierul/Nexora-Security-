
require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  Events
} = require("discord.js");

const { checkAction } = require("./systems/antinuke");
const { checkRaid } = require("./systems/antiraid");

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

  console.log("General Audit: CONNECTED");
  console.log("Moderation Audit: CONNECTED");
  console.log("Anti-Nuke: CONNECTED");
  console.log("Anti-Raid: CONNECTED");
  console.log("======================================");
});

client.on(Events.GuildMemberAdd, async member => {
  await checkRaid(member);
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
