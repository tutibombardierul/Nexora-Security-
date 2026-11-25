const {
  SlashCommandBuilder
} = require("discord.js");

const { getSettings } = require("../systems/settings");
const { getWhitelist } = require("../systems/whitelist");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("security")
    .setDescription("View the NEXORA security dashboard."),

  async execute(interaction) {
    if (!interaction.guild) {
      return interaction.reply({
        content: "This command can only be used inside a server.",
        ephemeral: true
      });
    }

    const settings = getSettings(interaction.guild.id);
    const whitelist = getWhitelist(interaction.guild.id);

    const status = enabled =>
      enabled ? "🟢 Enabled" : "🔴 Disabled";

    const embed = {
      color: 0x9B59B6,
      title: "NEXORA SECURITY | SYSTEM DASHBOARD",
      description: "Current protection configuration for this server.",
      fields: [
        {
          name: "ANTI-NUKE",
          value: "🟢 Monitoring active\nMode: Alert only",
          inline: true
        },
        {
          name: "ANTI-RAID",
          value: `${status(settings.antiRaid.enabled)}\nThreshold: ${settings.antiRaid.joinThreshold}\nWindow: ${settings.antiRaid.timeWindow}s`,
          inline: true
        },
        {
          name: "ANTI-SPAM",
          value: `${status(settings.antiSpam.enabled)}\nThreshold: ${settings.antiSpam.messageThreshold}\nWindow: ${settings.antiSpam.timeWindow}s`,
          inline: true
        },
        {
          name: "ANTI-LINK",
          value: `${status(settings.antiLink.enabled)}\nInvites: ${settings.antiLink.blockInvites ? "Detected" : "Ignored"}\nExternal URLs: ${settings.antiLink.detectExternalLinks ? "Detected" : "Ignored"}`,
          inline: true
        },
        {
          name: "BOT PROTECTION",
          value: "🟢 Join monitoring active\nMode: Logging only",
          inline: true
        },
        {
          name: "TRUSTED USERS",
          value: `${whitelist.length} whitelisted users`,
          inline: true
        }
      ],
      footer: {
        text: "NEXORA SECURITY • SYSTEM OVERVIEW"
      },
      timestamp: new Date().toISOString()
    };

    return interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
};
