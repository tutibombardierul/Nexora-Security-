const {
  Events,
  AuditLogEvent
} = require("discord.js");

const {
  sendLog,
  COLORS
} = require("../systems/logger");

function registerBotProtection(client) {
  client.on(Events.GuildMemberAdd, async member => {
    if (!member.user.bot) return;

    let inviter = "Unknown";
    let auditStatus = "Unavailable";

    try {
      const auditLogs = await member.guild.fetchAuditLogs({
        type: AuditLogEvent.BotAdd,
        limit: 5
      });

      const entry = auditLogs.entries.find(log =>
        log.target?.id === member.id &&
        Date.now() - log.createdTimestamp < 15000
      );

      if (entry?.executor) {
        inviter = `<@${entry.executor.id}>`;
        auditStatus = "Matched";
      }
    } catch (error) {
      console.error(
        "[NEXORA BOT PROTECTION] Audit log lookup failed:",
        error
      );
    }

    await sendLog(member.guild, {
      title: "NEW BOT DETECTED",
      description: "A new bot account has joined the server.",
      color: COLORS.security,
      event: "BOT PROTECTION",
      fields: [
        {
          name: "Bot",
          value: `${member.user.tag}`,
          inline: true
        },
        {
          name: "Bot ID",
          value: member.id,
          inline: true
        },
        {
          name: "Added By",
          value: inviter,
          inline: true
        },
        {
          name: "Audit Lookup",
          value: auditStatus,
          inline: true
        },
        {
          name: "Response",
          value: "Bot entry recorded. No automatic action was performed."
        }
      ]
    });
  });

  console.log("[NEXORA] Bot protection listeners registered.");
}

module.exports = { registerBotProtection };
