
const { Events } = require("discord.js");

const commands = [
  require("../commands/logs"),
  require("../commands/whitelist"),
  require("../commands/antiraid"),
  require("../commands/antispam"),
  require("../commands/antilink"),
  require("../commands/security")
];

function registerInteractions(client) {
  const commandMap = new Map(
    commands.map(command => [
      command.data.name,
      command
    ])
  );

  client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = commandMap.get(interaction.commandName);

    if (!command) {
      return interaction.reply({
        content: "This command is not available.",
        ephemeral: true
      });
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(
        `[NEXORA COMMAND ERROR] ${interaction.commandName}`,
        error
      );

      const response = {
        content: "An unexpected error occurred while executing this command.",
        ephemeral: true
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(response).catch(() => {});
      } else {
        await interaction.reply(response).catch(() => {});
      }
    }
  });

  console.log("[NEXORA] Interaction handler registered.");
}

module.exports = { registerInteractions };
