
const { sendLog, COLORS } = require("./logger");
const { getSettings } = require("./settings");

const joinHistory = new Map();
const alertCooldowns = new Map();

const ALERT_COOLDOWN = 30000;

async function checkRaid(member) {
  if (!member || !member.guild || member.user.bot) return;

  const guildId = member.guild.id;
  const settings = getSettings(guildId);
  const config = settings.antiRaid;

  if (!config.enabled) return;

  const now = Date.now();
  const timeWindow = config.timeWindow * 1000;

  const history = joinHistory.get(guildId) || [];

  const recentJoins = history.filter(
    timestamp => now - timestamp < timeWindow
  );

  recentJoins.push(now);
  joinHistory.set(guildId, recentJoins);

  if (recentJoins.length < config.joinThreshold) return;

  const lastAlert = alertCooldowns.get(guildId) || 0;

  if (now - lastAlert < ALERT_COOLDOWN) return;

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
        value: `${config.timeWindow} seconds`,
        inline: true
      },
      {
        name: "Detection Threshold",
        value: `${config.joinThreshold} joins`,
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
