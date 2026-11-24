
const { EmbedBuilder, AuditLogEvent } = require("discord.js");

const recentActions = new Map();

const LIMITS = {
  [AuditLogEvent.ChannelDelete]: 3,
  [AuditLogEvent.RoleDelete]: 3,
  [AuditLogEvent.MemberBanAdd]: 5,
  [AuditLogEvent.WebhookCreate]: 3
};

const WINDOW = 10000;

async function checkAction(entry, guild) {
  if (!entry || !guild || !entry.executor) return;

  const limit = LIMITS[entry.action];
  if (!limit) return;

  const executorId = entry.executor.id;

  const key = `${guild.id}:${entry.action}:${executorId}`;
  const now = Date.now();

  const previous = recentActions.get(key) || [];

  const actions = previous.filter(
    timestamp => now - timestamp < WINDOW
  );

  actions.push(now);
  recentActions.set(key, actions);

  if (actions.length < limit) return;

  recentActions.set(key, []);

  const embed = new EmbedBuilder()
    .setColor(0xE74C3C)
    .setTitle("NEXORA SECURITY")
    .setDescription(
      "Suspicious administrative activity detected."
    )
    .addFields(
      {
        name: "Executor",
        value: `<@${executorId}>`,
        inline: true
      },
      {
        name: "Action",
        value: String(entry.action),
        inline: true
      },
      {
        name: "Detected actions",
        value: String(actions.length),
        inline: true
      }
    )
    .setFooter({
      text: "NEXORA SECURITY • Anti-Nuke Monitoring"
    })
    .setTimestamp();

  const logChannel = guild.channels.cache.find(
    channel =>
      channel.name === "security-logs" &&
      channel.isTextBased()
  );

  if (logChannel) {
    await logChannel.send({ embeds: [embed] });
  }

  console.warn(
    `[NEXORA SECURITY] Suspicious activity in ${guild.name}`
  );
}

module.exports = { checkAction };
