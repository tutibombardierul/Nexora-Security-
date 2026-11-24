
const { Events } = require("discord.js");
const { sendLog, COLORS } = require("../systems/logger");

function registerBotProtection(client) {
  client.on(Events.GuildMemberAdd, async member => {
    if (!member.user.bot) return;

    let inviter = "Unknown";

    try {
      const auditLogs = await member.guild.fetchAuditLogs({
        type: 28,
        limit: 5
      });

      const entry = auditLogs.entries.find(log => {
        return (
          log.target?.id === member.id &&
          Date.now() - log.createdTimestamp < 15000
        );
      });

      if (entry?.executor) {
        inviter = `<@${entry.executor.id}>`;
      }
    } catch (error) {
      console.error("[NEXORA BOT PROTECTION]", error);
    }

    await sendLog(member.guild, {
      title: "NEW BOT DETECTED",
      description: "A new bot account has joined the server.",
      color: COLORS.warning,
      event: "BOT ADDED",
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
          name: "Account Created",
          value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:F>`
        }
      ]
    });
  });

  console.log("[NEXORA] Bot protection listeners registered.");
}

module.exports = { registerBotProtection };
