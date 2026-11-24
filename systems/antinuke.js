const { EmbedBuilder, AuditLogEvent } = require("discord.js");

const recentActions = new Map();

const LIMITS = {
  [AuditLogEvent.ChannelDelete]: 3,
  [AuditLogEvent.RoleDelete]: 3,
  [AuditLogEvent.MemberBanAdd]: 5,
  [AuditLogEvent.WebhookCreate]: 3
};

async function checkAction(guild, type) {
  const limit = LIMITS[type];

  if (!limit) return;

  try {
    const logs = await guild.fetchAuditLogs({
      type,
      limit: 1
    });

    const entry = logs.entries.first();
    if (!entry || !entry.executor) return;

    const executorId = entry.executor.id;
    const key = `${guild.id}:${type}:${executorId}`;
    const now = Date.now();

    const previous = recentActions.get(key) || [];
    const actions = previous.filter(
      time => now - time < 10000
    );

    actions.push(now);
    recentActions.set(key, actions);

    if (actions.length >= limit) {
      const embed = new EmbedBuilder()
        .setColor(0xE74C3C)
        .setTitle("🚨 Suspicious Administrative Activity")
        .setDescription(
          `A potentially dangerous action burst was detected.`
        )
        .addFields(
          { name: "Executor", value: `<@${executorId}>` },
          { name: "Action", value: String(type) },
          { name: "Detected actions", value: String(actions.length) }
        )
        .setTimestamp();

      console.warn(
        `[NEXORA SECURITY] Suspicious activity in ${guild.name}`
      );

      const logChannel = guild.channels.cache.find(
        channel =>
          channel.isTextBased() &&
          channel.name === "security-logs"
      );

      if (logChannel) {
        await logChannel.send({ embeds: [embed] });
      }

      recentActions.set(key, []);
    }
  } catch (error) {
    console.error("Anti-Nuke monitoring error:", error);
  }
}

module.exports = { checkAction };
        
