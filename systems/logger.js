const {
  EmbedBuilder,
  AuditLogEvent
} = require("discord.js");

const COLORS = {
  INFO: 0x5865F2,
  SUCCESS: 0x57F287,
  WARNING: 0xFEE75C,
  DANGER: 0xED4245,
  SECURITY: 0x9B59B6
};

const EVENT_NAMES = {
  memberJoin: "MEMBER JOINED",
  memberLeave: "MEMBER LEFT",
  messageDelete: "MESSAGE DELETED",
  messageUpdate: "MESSAGE EDITED",
  roleCreate: "ROLE CREATED",
  roleDelete: "ROLE DELETED",
  channelCreate: "CHANNEL CREATED",
  channelDelete: "CHANNEL DELETED",
  ban: "MEMBER BANNED",
  timeout: "MEMBER TIMED OUT",
  security: "SECURITY ALERT",
  botAdd: "BOT ADDED"
};

const CHANNEL_NAMES = {
  memberJoin: "member-logs",
  memberLeave: "member-logs",
  messageDelete: "message-logs",
  messageUpdate: "message-logs",
  roleCreate: "role-logs",
  roleDelete: "role-logs",
  channelCreate: "channel-logs",
  channelDelete: "channel-logs",
  ban: "moderation-logs",
  timeout: "moderation-logs",
  security: "security-logs",
  botAdd: "security-logs"
};

async function sendLog(guild, type, data = {}) {
  try {
    if (!guild) return false;

    const channelName = CHANNEL_NAMES[type];

    if (!channelName) {
      console.warn(`[LOGGER] Unknown event: ${type}`);
      return false;
    }

    const channel = guild.channels.cache.find(
      ch =>
        ch.name === channelName &&
        ch.isTextBased() &&
        ch.permissionsFor(guild.members.me)?.has("SendMessages")
    );

    if (!channel) {
      console.warn(
        `[LOGGER] Missing channel: ${channelName}`
      );
      return false;
    }

    const embed = new EmbedBuilder()
      .setColor(data.color || COLORS.INFO)
      .setAuthor({
        name: "NEXORA SECURITY • AUDIT SYSTEM"
      })
      .setTitle(EVENT_NAMES[type] || "SERVER EVENT")
      .setDescription(
        data.description || "An event was detected."
      )
      .setFooter({
        text: `NEXORA AUDIT • ${guild.name}`
      })
      .setTimestamp();

    if (data.executor) {
      embed.addFields({
        name: "Executor",
        value: `<@${data.executor}>`,
        inline: true
      });
    }

    if (data.target) {
      embed.addFields({
        name: "Target",
        value: String(data.target).slice(0, 1024),
        inline: true
      });
    }

    if (data.details) {
      embed.addFields({
        name: "Details",
        value: String(data.details).slice(0, 1024)
      });
    }

    await channel.send({
      embeds: [embed],
      allowedMentions: { parse: [] }
    });

    return true;
  } catch (error) {
    console.error("[NEXORA LOGGER ERROR]", error);
    return false;
  }
}

module.exports = {
  sendLog,
  COLORS,
  AuditLogEvent
};
        
