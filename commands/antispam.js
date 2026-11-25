
const {
  SlashCommandBuilder
} = require("discord.js");

const {
  getSettings,
  updateSetting
} = require("../systems/settings");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("antispam")
    .setDescription("Manage NEXORA Anti-Spam protection.")

    .addSubcommand(subcommand =>
      subcommand
        .setName("status")
        .setDescription("View Anti-Spam configuration.")
    )

    .addSubcommand(subcommand =>
      subcommand
        .setName("enable")
        .setDescription("Enable Anti-Spam protection.")
    )

    .addSubcommand(subcommand =>
      subcommand
        .setName("disable")
        .setDescription("Disable Anti-Spam protection.")
    )

    .addSubcommand(subcommand =>
      subcommand
        .setName("threshold")
        .setDescription("Set the message detection threshold.")
        .addIntegerOption(option =>
          option
            .setName("amount")
            .setDescription("Number of messages required.")
            .setMinValue(2)
            .setMaxValue(30)
            .setRequired(true)
        )
    )

    .addSubcommand(subcommand =>
      subcommand
        .setName("window")
        .setDescription("Set the detection time window.")
        .addIntegerOption(option =>
          option
            .setName("seconds")
            .setDescription("Detection window in seconds.")
            .setMinValue(2)
            .setMaxValue(60)
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
      const config = getSettings(guildId).antiSpam;

      return interaction.reply({
        embeds: [{
          color: 0xF1C40F,
          title: "NEXORA | ANTI-SPAM STATUS",
          fields: [
            {
              name: "Protection",
              value: config.enabled ? "Enabled" : "Disabled",
              inline: true
            },
            {
              name: "Message Threshold",
              value: `${config.messageThreshold} messages`,
              inline: true
            },
            {
              name: "Detection Window",
              value: `${config.timeWindow} seconds`,
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
      updateSetting(guildId, "antiSpam", "enabled", true);

      return interaction.reply({
        content: "Anti-Spam protection has been enabled.",
        ephemeral: true
      });
    }

    if (subcommand === "disable") {
      updateSetting(guildId, "antiSpam", "enabled", false);

      return interaction.reply({
        content: "Anti-Spam protection has been disabled.",
        ephemeral: true
      });
    }

    if (subcommand === "threshold") {
      const amount = interaction.options.getInteger("amount");

      updateSetting(
        guildId,
        "antiSpam",
        "messageThreshold",
        amount
      );

      return interaction.reply({
        content: `Anti-Spam message threshold updated to ${amount}.`,
        ephemeral: true
      });
    }

    if (subcommand === "window") {
      const seconds = interaction.options.getInteger("seconds");

      updateSetting(
        guildId,
        "antiSpam",
        "timeWindow",
        seconds
      );

      return interaction.reply({
        content: `Anti-Spam detection window updated to ${seconds} seconds.`,
        ephemeral: true
      });
    }
  }
};
    
