
const {
  EmbedBuilder,
  AuditLogEvent,
  PermissionFlagsBits
} = require("discord.js");

const recentActions = new Map();
const processedEntries = new Set();

const LIMITS = {
  [AuditLogEvent.ChannelDelete]: 3,
  [AuditLogEvent.RoleDelete]: 3,
  [AuditLogEvent.MemberBanAdd]: 5,
  [AuditLogEvent.WebhookCreate]: 3
};

async function checkAction(guild, type, targetId) {
  const limit = LIMITS[type];
  if (!limit) return;

  try {
    const logs = await guild.fetchAuditLogs({
      type,
      limit: 5
    });

    const entry = logs.entries.find(log =>
      log.target?.id === targetId &&
      Date.now() - log.createdTimestamp < 10000
    );

    if (!entry || !entry.executor) return;
    if (processedEntries.has(entry.id)) return;

    processedEntries.add(entry.id);

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
        .setTitle("NEXORA SECURITY | Threat Alert")
        .setDescription(
          "Suspicious administrative activity detected."
        )
        .addFields(
          { name: "Executor", value: `<@${executorId}>` },
          { name: "Action", value: String(type) },
          { name: "Activity count", value: String(actions.length) }
        )
        .setTimestamp();

      const channel = guild.channels.cache.find(
        ch =>
          ch.name === "security-logs" &&
          ch.isTextBased()
      );

      if (channel) {
        await channel.send({ embeds: [embed] });
      }

      console.warn(
        `[NEXORA SECURITY] Alert in ${guild.name}`
      );
    }
  } catch (error) {
    console.error("[Anti-Nuke]", error);
  }
}

module.exports = { checkAction };
