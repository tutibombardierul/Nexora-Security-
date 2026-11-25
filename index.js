require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  Events
} = require("discord.js");

const { checkAction } = require("./systems/antinuke");
const { checkRaid } = require("./systems/antiraid");
const { checkSpam } = require("./systems/antispam");
const { checkLinks } = require("./systems/antilink");

const { registerLogger } = require("./events/logger");
const { registerModerationLogger } = require("./events/moderation");
const { registerBotProtection } = require("./events/bot-protection");
const { registerInteractions } = require("./events/interactions");

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
  console.log("Status: ONLINE");
  console.log(`Bot: ${bot.user.tag}`);
  console.log(`Servers: ${bot.guilds.cache.size}`);

  registerLogger(bot);
  registerModerationLogger(bot);
  registerBotProtection(bot);
  registerInteractions(bot);

  console.log("General Audit: CONNECTED");
  console.log("Moderation Audit: CONNECTED");
  console.log("Bot Protection: CONNECTED");
  console.log("Anti-Nuke: CONNECTED");
  console.log("Anti-Raid: CONNECTED");
  console.log("Anti-Spam: CONNECTED");
  console.log("Anti-Link: CONNECTED");
  console.log("Slash Commands: CONNECTED");

  console.log("======================================");
});

client.on(Events.GuildMemberAdd, async member => {
  try {
    await checkRaid(member);
  } catch (error) {
    console.error("[NEXORA ANTI-RAID ERROR]", error);
  }
});

client.on(Events.MessageCreate, async message => {
  try {
    await checkSpam(message);
    await checkLinks(message);
  } catch (error) {
    console.error("[NEXORA MESSAGE SECURITY ERROR]", error);
  }
});

client.on(Events.GuildAuditLogEntryCreate, async (entry, guild) => {
  try {
    await checkAction(entry, guild);
  } catch (error) {
    console.error("[NEXORA ANTI-NUKE ERROR]", error);
  }
});

client.on(Events.Error, error => {
  console.error("[NEXORA CLIENT ERROR]", error);
});

if (!process.env.DISCORD_TOKEN) {
  console.error("[NEXORA] Missing DISCORD_TOKEN!");
  process.exit(1);
}

client.login(process.env.DISCORD_TOKEN);
