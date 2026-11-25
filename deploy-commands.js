require("dotenv").config();

const {
  REST,
  Routes
} = require("discord.js");

const logs = require("./commands/logs");
const whitelist = require("./commands/whitelist");
const antiraid = require("./commands/antiraid");
const antispam = require("./commands/antispam");
const antilink = require("./commands/antilink");
const security = require("./commands/security");

const commands = [
  logs.data.toJSON(),
  whitelist.data.toJSON(),
  antiraid.data.toJSON(),
  antispam.data.toJSON(),
  antilink.data.toJSON(),
  security.data.toJSON()
];

async function deploy() {
  if (!process.env.DISCORD_TOKEN || !process.env.CLIENT_ID) {
    console.error("[NEXORA] Missing DISCORD_TOKEN or CLIENT_ID.");
    process.exit(1);
  }

  const rest = new REST({ version: "10" })
    .setToken(process.env.DISCORD_TOKEN);

  try {
    console.log("[NEXORA] Registering slash commands...");

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log(`[NEXORA] Successfully registered ${commands.length} commands.`);
  } catch (error) {
    console.error("[NEXORA DEPLOY ERROR]", error);
    process.exitCode = 1;
  }
}

deploy();
