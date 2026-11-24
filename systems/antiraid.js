
const { sendLog, COLORS } = require("./logger");

const joinHistory = new Map();
const alertCooldowns = new Map();

const CONFIG = {
  joinThreshold: 8,
  timeWindow: 10000,
  alertCooldown: 30000
};

async function checkRaid(member) {
  if (!member || !member.guild) return;

  const guildId = member.guild.id;
  const now = Date.now();

  const history = joinHistory.get(guildId) || [];

  const recentJoins = history.filter(
    timestamp => now - timestamp < CONFIG.timeWindow
  );

  recentJoins.push(now);
  joinHistory.set(guildId, recentJoins);

  if (recentJoins.length < CONFIG.joinThreshold) return;

  const lastAlert = alertCooldowns.get(guildId) || 0;

  if (now - lastAlert < CONFIG.alertCooldown) return;

  alertCooldowns.set(guildId, now);
  joinHistory.set(guildId, []);

  await sendLog(member.guild, {
    title: "ANTI-RAID ALERT",
    description: "A possible raid pattern has been detected.",
    color: COLORS.danger,
    event: "ANTI-RAID",
    fields: [
      {
        name: "Detected Joins",
        value: `${recentJoins.length} members`,
        inline: true
      },
      {
        name: "Detection Window",
        value: `${CONFIG.timeWindow / 1000} seconds`,
        inline: true
      },
      {
        name: "Detection Threshold",
        value: `${CONFIG.joinThreshold} joins`,
        inline: true
      },
      {
        name: "Response",
        value: "Alert generated. No automatic punishment was performed."
      }
    ]
  });

  console.warn(
    `[NEXORA ANTI-RAID] Possible raid detected in ${member.guild.name}.`
  );
}

module.exports = { checkRaid };
