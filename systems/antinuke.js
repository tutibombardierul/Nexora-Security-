
const { AuditLogEvent } = require("discord.js");
const { sendLog, COLORS } = require("./logger");

const recentActions = new Map();

const LIMITS = {
  [AuditLogEvent.ChannelDelete]: 3,
  [AuditLogEvent.RoleDelete]: 3,
  [AuditLogEvent.MemberBanAdd]: 5,
  [AuditLogEvent.WebhookCreate]: 3
};

const WINDOW = 10000;
const COOLDOWN = 30000;

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

  const cooldownKey = `cooldown:${key}`;
  const lastAlert = recentActions.get(cooldownKey) || 0;

  if (now - lastAlert < COOLDOWN) return;

  recentActions.set(cooldownKey, now);
  recentActions.set(key, []);

  await sendLog(guild, {
    title: "ANTI-NUKE ALERT",
    description: "A suspicious number of sensitive server actions has been detected.",
    color: COLORS.danger,
    event: "ANTI-NUKE",
    fields: [
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
        name: "Detected Actions",
        value: `${actions.length} actions within ${WINDOW / 1000} seconds`,
        inline: true
      },
      {
        name: "Response",
        value: "Alert generated. No automatic punishment was performed."
      }
    ]
  });

  console.warn(
    `[NEXORA ANTI-NUKE] Suspicious activity detected in ${guild.name}.`
  );
}

module.exports = { checkAction };
