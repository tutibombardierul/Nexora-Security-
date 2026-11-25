
const { sendLog, COLORS } = require("./logger");
const { getSettings } = require("./settings");

const messageHistory = new Map();
const alertCooldowns = new Map();

const ALERT_COOLDOWN = 30000;

async function checkSpam(message) {
  if (!message.guild || message.author.bot) return;

  const guildId = message.guild.id;
  const userId = message.author.id;

  const settings = getSettings(guildId);
  const config = settings.antiSpam;

  if (!config.enabled) return;

  const now = Date.now();
  const timeWindow = config.timeWindow * 1000;

  const key = `${guildId}:${userId}`;

  const history = messageHistory.get(key) || [];

  const recentMessages = history.filter(
    timestamp => now - timestamp < timeWindow
  );

  recentMessages.push(now);
  messageHistory.set(key, recentMessages);

  if (recentMessages.length < config.messageThreshold) return;

  const lastAlert = alertCooldowns.get(key) || 0;

  if (now - lastAlert < ALERT_COOLDOWN) return;

  alertCooldowns.set(key, now);
  messageHistory.set(key, []);

  await sendLog(message.guild, {
    title: "ANTI-SPAM ALERT",
    description: "Excessive message activity has been detected.",
    color: COLORS.warning,
    event: "ANTI-SPAM",
    fields: [
      {
        name: "Member",
        value: `${message.author}`,
        inline: true
      },
      {
        name: "Detected Messages",
        value: `${recentMessages.length}`,
        inline: true
      },
      {
        name: "Detection Window",
        value: `${config.timeWindow} seconds`,
        inline: true
      },
      {
        name: "Response",
        value: "Alert generated. No automatic punishment was performed."
      }
    ]
  });

  console.warn(
    `[NEXORA ANTI-SPAM] Possible spam detected from ${message.author.tag}.`
  );
}

module.exports = { checkSpam };
