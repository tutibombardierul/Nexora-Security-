const {
  EmbedBuilder,
  PermissionsBitField
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const CONFIG_PATH = path.join(__dirname, "../guild-config.json");

const COLORS = {
  success: 0x2ECC71,
  warning: 0xF1C40F,
  danger: 0xE74C3C,
  info: 0x3498DB,
  security: 0x9B59B6
};

function loadConfig() {
  try {
    if (!fs.existsSync(CONFIG_PATH)) return {};
    return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
  } catch (error) {
    console.error("[NEXORA] Failed to load guild configuration:", error);
    return {};
  }
}

async function sendLog(guild, {
  title,
  description,
  color = COLORS.info,
  fields = [],
  event
}) {
  try {
    if (!guild) return false;

    const config = loadConfig();
    const channelId = config[guild.id]?.logChannelId;

    if (!channelId) {
      console.warn(`[NEXORA] No log channel configured for ${guild.name}.`);
      return false;
    }

    const channel = await guild.channels.fetch(channelId).catch(() => null);

    if (!channel || !channel.isTextBased() || !channel.guild) {
      console.warn("[NEXORA] Configured log channel is unavailable.");
      return false;
    }

    const botMember = guild.members.me;

    if (!botMember) {
      console.warn("[NEXORA] Bot member could not be resolved.");
      return false;
    }

    const permissions = channel.permissionsFor(botMember);

    if (!permissions?.has([
      PermissionsBitField.Flags.ViewChannel,
      PermissionsBitField.Flags.SendMessages,
      PermissionsBitField.Flags.EmbedLinks
    ])) {
      console.warn("[NEXORA] Missing permissions in the configured log channel.");
      return false;
    }

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(title || "NEXORA AUDIT")
      .setDescription(description || "An event was detected.")
      .addFields(fields.slice(0, 25))
      .setFooter({
        text: `NEXORA SECURITY • ${event || "AUDIT EVENT"}`
      })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
    return true;

  } catch (error) {
    console.error("[NEXORA LOGGER ERROR]", error);
    return false;
  }
}

module.exports = {
  sendLog,
  COLORS
};
