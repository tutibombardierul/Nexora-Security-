const { sendLog, COLORS } = require("./logger");

const messageHistory = new Map();
const alertCooldowns = new Map();

const CONFIG = {
  messageThreshold: 5,
  timeWindow: 5000,
  alertCooldown: 30000
};

async function checkSpam(message) {
  if (!message.guild || message.author.bot) return;

  const guildId = message.guild.id;
  const userId = message.author.id;
  const now = Date.now();

  const key = `${guildId}:${userId}`;

  const history = messageHistory.get(key) || [];

  const recentMessages = history.filter(
    timestamp => now - timestamp < CONFIG.timeWindow
  );

  recentMessages.push(now);
  messageHistory.set(key, recentMessages);

  if (recentMessages.length < CONFIG.messageThreshold) return;

  const lastAlert = alertCooldowns.get(key) || 0;

  if (now - lastAlert < CONFIG.alertCooldown) return;

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
        value: `${CONFIG.timeWindow / 1000} seconds`,
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
