const { Events } = require("discord.js");
const { checkAction } = require("../systems/antinuke");

module.exports = {
  name: Events.GuildAuditLogEntryCreate,

  async execute(entry, guild) {
    if (!guild || !entry.executor) return;

    await checkAction(
      guild,
      entry.action,
      entry.targetId
    );
  }
};
