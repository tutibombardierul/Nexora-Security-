require("dotenv").config();

const {
  REST,
  Routes
} = require("discord.js");

const logs = require("./commands/logs");

const commands = [
  logs.data.toJSON()
];

const rest = new REST({ version: "10" })
  .setToken(process.env.DISCORD_TOKEN);

async function deploy() {
  try {
    console.log("[NEXORA] Registering slash commands...");

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log("[NEXORA] Slash commands registered!");
  } catch (error) {
    console.error("[NEXORA DEPLOY ERROR]", error);
  }
}

deploy();
