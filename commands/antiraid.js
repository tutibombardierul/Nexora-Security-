
const {
  SlashCommandBuilder
} = require("discord.js");

const {
  getSettings,
  updateSetting
} = require("../systems/settings");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("antiraid")
    .setDescription("Manage NEXORA Anti-Raid protection.")

    .addSubcommand(subcommand =>
      subcommand
        .setName("status")
        .setDescription("View Anti-Raid configuration.")
    )

    .addSubcommand(subcommand =>
      subcommand
        .setName("enable")
        .setDescription("Enable Anti-Raid protection.")
    )

    .addSubcommand(subcommand =>
      subcommand
        .setName("disable")
        .setDescription("Disable Anti-Raid protection.")
    )

    .addSubcommand(subcommand =>
      subcommand
        .setName("threshold")
        .setDescription("Set the join detection threshold.")
        .addIntegerOption(option =>
          option
            .setName("amount")
            .setDescription("Number of joins required.")
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
            .setMinValue(3)
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
      const settings = getSettings(guildId);
      const raid = settings.antiRaid;

      return interaction.reply({
        embeds: [{
          color: 0x9B59B6,
          title: "NEXORA | ANTI-RAID STATUS",
          fields: [
            {
              name: "Protection",
              value: raid.enabled ? "Enabled" : "Disabled",
              inline: true
            },
            {
              name: "Join Threshold",
              value: `${raid.joinThreshold} joins`,
              inline: true
            },
            {
              name: "Detection Window",
              value: `${raid.timeWindow} seconds`,
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
      updateSetting(guildId, "antiRaid", "enabled", true);

      return interaction.reply({
        content: "Anti-Raid protection has been enabled.",
        ephemeral: true
      });
    }

    if (subcommand === "disable") {
      updateSetting(guildId, "antiRaid", "enabled", false);

      return interaction.reply({
        content: "Anti-Raid protection has been disabled.",
        ephemeral: true
      });
    }

    if (subcommand === "threshold") {
      const amount = interaction.options.getInteger("amount");

      updateSetting(
        guildId,
        "antiRaid",
        "joinThreshold",
        amount
      );

      return interaction.reply({
        content: `Anti-Raid join threshold updated to ${amount}.`,
        ephemeral: true
      });
    }

    if (subcommand === "window") {
      const seconds = interaction.options.getInteger("seconds");

      updateSetting(
        guildId,
        "antiRaid",
        "timeWindow",
        seconds
      );

      return interaction.reply({
        content: `Anti-Raid detection window updated to ${seconds} seconds.`,
        ephemeral: true
      });
    }
  }
};
      
