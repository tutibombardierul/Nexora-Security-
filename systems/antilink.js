
const { sendLog, COLORS } = require("./logger");

const alertCooldowns = new Map();

const CONFIG = {
  blockInvites: true,
  detectExternalLinks: true,
  alertCooldown: 30000
};

const INVITE_REGEX =
  /(?:https?:\/\/)?(?:www\.)?(?:discord\.gg|discord\.com\/invite|discordapp\.com\/invite)\/[a-zA-Z0-9-]+/i;

const URL_REGEX =
  /https?:\/\/[^\s<]+/gi;

async function checkLinks(message) {
  if (!message.guild || message.author.bot) return;

  const content = message.content || "";

  const hasInvite =
    CONFIG.blockInvites && INVITE_REGEX.test(content);

  const hasExternalLink =
    CONFIG.detectExternalLinks && URL_REGEX.test(content);

  if (!hasInvite && !hasExternalLink) return;

  const key = `${message.guild.id}:${message.author.id}`;
  const now = Date.now();

  const lastAlert = alertCooldowns.get(key) || 0;

  if (now - lastAlert < CONFIG.alertCooldown) return;

  alertCooldowns.set(key, now);

  await sendLog(message.guild, {
    title: "ANTI-LINK ALERT",
    description: "A message containing a link was detected.",
    color: COLORS.warning,
    event: "ANTI-LINK",
    fields: [
      {
        name: "Member",
        value: `${message.author}`,
        inline: true
      },
      {
        name: "Channel",
        value: `${message.channel}`,
        inline: true
      },
      {
        name: "Link Type",
        value: hasInvite ? "Discord Invite" : "External URL",
        inline: true
      },
      {
        name: "Message ID",
        value: message.id
      },
      {
        name: "Response",
        value: "Detection alert only. No automatic action was performed."
      }
    ]
  });
}

module.exports = { checkLinks };
