
const {
  SlashCommandBuilder
} = require("discord.js");

const {
  getSettings,
  updateSetting
} = require("../systems/settings");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("antilink")
    .setDescription("Manage NEXORA Anti-Link protection.")

    .addSubcommand(subcommand =>
      subcommand
        .setName("status")
        .setDescription("View Anti-Link configuration.")
    )

    .addSubcommand(subcommand =>
      subcommand
        .setName("enable")
        .setDescription("Enable Anti-Link detection.")
    )

    .addSubcommand(subcommand =>
      subcommand
        .setName("disable")
        .setDescription("Disable Anti-Link detection.")
    )

    .addSubcommand(subcommand =>
      subcommand
        .setName("invites")
        .setDescription("Enable or disable Discord invite detection.")
        .addBooleanOption(option =>
          option
            .setName("enabled")
            .setDescription("Whether Discord invites should be detected.")
            .setRequired(true)
        )
    )

    .addSubcommand(subcommand =>
      subcommand
        .setName("external")
        .setDescription("Enable or disable external URL detection.")
        .addBooleanOption(option =>
          option
            .setName("enabled")
            .setDescription("Whether external URLs should be detected.")
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    if (!interaction.guild) {
      return interaction.reply({
        content: "This command can only be used inside a server.",
        ephemeral: true
      });
    }

    if (interaction.user.id !== interaction.guild.ownerId) {
      return interaction.reply({
        content: "Only the server owner can manage NEXORA security settings.",
        ephemeral: true
      });
    }

    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;

    if (subcommand === "status") {
      const config = getSettings(guildId).antiLink;

      return interaction.reply({
        embeds: [{
          color: 0xF1C40F,
          title: "NEXORA | ANTI-LINK STATUS",
          fields: [
            {
              name: "Detection",
              value: config.enabled ? "Enabled" : "Disabled",
              inline: true
            },
            {
              name: "Discord Invites",
              value: config.blockInvites ? "Detected" : "Ignored",
              inline: true
            },
            {
              name: "External URLs",
              value: config.detectExternalLinks ? "Detected" : "Ignored",
              inline: true
            }
          ],
          footer: {
            text: "NEXORA SECURITY • CONFIGURATION"
          },
          timestamp: new Date().toISOString()
        }],
        ephemeral: true
      });
    }

    if (subcommand === "enable") {
      updateSetting(guildId, "antiLink", "enabled", true);

      return interaction.reply({
        content: "Anti-Link detection has been enabled.",
        ephemeral: true
      });
    }

    if (subcommand === "disable") {
      updateSetting(guildId, "antiLink", "enabled", false);

      return interaction.reply({
        content: "Anti-Link detection has been disabled.",
        ephemeral: true
      });
    }

    if (subcommand === "invites") {
      const enabled = interaction.options.getBoolean("enabled");

      updateSetting(
        guildId,
        "antiLink",
        "blockInvites",
        enabled
      );

      return interaction.reply({
        content: `Discord invite detection is now ${enabled ? "enabled" : "disabled"}.`,
        ephemeral: true
      });
    }

    if (subcommand === "external") {
      const enabled = interaction.options.getBoolean("enabled");

      updateSetting(
        guildId,
        "antiLink",
        "detectExternalLinks",
        enabled
      );

      return interaction.reply({
        content: `External URL detection is now ${enabled ? "enabled" : "disabled"}.`,
        ephemeral: true
      });
    }
  }
};
      
