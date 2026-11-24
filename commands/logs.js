const {
  SlashCommandBuilder,
  ChannelType
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const CONFIG_PATH = path.join(__dirname, "../guild-config.json");

function loadConfig() {
  if (!fs.existsSync(CONFIG_PATH)) return {};
  return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
}

function saveConfig(config) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("logs")
    .setDescription("Manage the NEXORA audit system")
    .addSubcommand(sub =>
      sub.setName("set")
        .setDescription("Set the channel for all audit logs")
        .addChannelOption(option =>
          option.setName("channel")
            .setDescription("The channel where all logs will be sent")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub.setName("status")
        .setDescription("View the current audit configuration")
    )
    .addSubcommand(sub =>
      sub.setName("reset")
        .setDescription("Reset the audit log configuration")
    ),

  async execute(interaction) {
    if (!interaction.guild) return;

    if (interaction.user.id !== interaction.guild.ownerId) {
      return interaction.reply({
        content: "Access denied. Only the server owner can manage NEXORA settings.",
        ephemeral: true
      });
    }

    const config = loadConfig();
    const guildId = interaction.guild.id;
    const action = interaction.options.getSubcommand();

    if (action === "set") {
      const channel = interaction.options.getChannel("channel");

      config[guildId] = {
        ...config[guildId],
        logChannelId: channel.id
      };

      saveConfig(config);

      return interaction.reply({
        content: `Audit logging has been configured successfully.\nAll logs will be sent to ${channel}.`,
        ephemeral: true
      });
    }

    if (action === "status") {
      const channelId = config[guildId]?.logChannelId;

      return interaction.reply({
        content: channelId
          ? `**Audit Configuration**\nLog Channel: <#${channelId}>`
          : "No audit log channel has been configured.",
        ephemeral: true
      });
    }

    if (action === "reset") {
      delete config[guildId];
      saveConfig(config);

      return interaction.reply({
        content: "The audit log configuration has been reset.",
        ephemeral: true
      });
    }
  }
};
