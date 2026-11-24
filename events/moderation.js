const { Events } = require("discord.js");
const { sendLog, COLORS } = require("../systems/logger");

function registerModerationLogger(client) {

  // MEMBER BANNED
  client.on(Events.GuildBanAdd, async ban => {
    await sendLog(ban.guild, {
      title: "MEMBER BANNED",
      description: "A member was banned from the server.",
      color: COLORS.danger,
      event: "MEMBER BAN",
      fields: [
        { name: "User", value: ban.user.tag, inline: true },
        { name: "User ID", value: ban.user.id, inline: true }
      ]
    });
  });

  // MEMBER UNBANNED
  client.on(Events.GuildBanRemove, async ban => {
    await sendLog(ban.guild, {
      title: "MEMBER UNBANNED",
      description: "A member's ban was removed.",
      color: COLORS.success,
      event: "MEMBER UNBAN",
      fields: [
        { name: "User", value: ban.user.tag, inline: true },
        { name: "User ID", value: ban.user.id, inline: true }
      ]
    });
  });

  // TIMEOUT UPDATED
  client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
    const oldTimeout = oldMember.communicationDisabledUntilTimestamp;
    const newTimeout = newMember.communicationDisabledUntilTimestamp;

    if (oldTimeout === newTimeout) return;

    const isActive = Boolean(newTimeout && newTimeout > Date.now());

    await sendLog(newMember.guild, {
      title: isActive ? "MEMBER TIMED OUT" : "MEMBER TIMEOUT REMOVED",
      description: isActive
        ? "A member received or had their timeout updated."
        : "A member's timeout was removed or expired.",
      color: isActive ? COLORS.warning : COLORS.success,
      event: "TIMEOUT UPDATE",
      fields: [
        { name: "Member", value: `${newMember.user}`, inline: true },
        { name: "User ID", value: newMember.id, inline: true },
        {
          name: "Timeout Until",
          value: isActive
            ? `<t:${Math.floor(newTimeout / 1000)}:F>`
            : "Not active",
          inline: false
        }
      ]
    });
  });

  console.log("[NEXORA] Moderation audit listeners registered.");
}

module.exports = { registerModerationLogger };
