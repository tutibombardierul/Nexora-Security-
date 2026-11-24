const { Events } = require("discord.js");
const { sendLog, COLORS } = require("../systems/logger");

function registerLogger(client) {
  client.on(Events.GuildMemberAdd, async member => {
    await sendLog(member.guild, "memberJoin", {
      color: COLORS.SUCCESS,
      description: `A new member joined the server.`,
      target: member.user.tag
    });
  });

  client.on(Events.GuildMemberRemove, async member => {
    await sendLog(member.guild, "memberLeave", {
      color: COLORS.WARNING,
      description: `A member left the server.`,
      target: member.user.tag
    });
  });

  client.on(Events.MessageDelete, async message => {
    if (!message.guild || message.author?.bot) return;

    await sendLog(message.guild, "messageDelete", {
      color: COLORS.WARNING,
      description: "A message was deleted. Its content is not stored.",
      target: message.author?.tag || "Unknown user",
      details: `Channel: ${message.channel?.name || "Unknown"}`
    });
  });

  client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
    if (!newMessage.guild || newMessage.author?.bot) return;
    if (oldMessage.content === newMessage.content) return;

    await sendLog(newMessage.guild, "messageUpdate", {
      color: COLORS.INFO,
      description: "A message was edited. Its content is not stored.",
      target: newMessage.author?.tag || "Unknown user",
      details: `Channel: ${newMessage.channel?.name || "Unknown"}`
    });
  });

  client.on(Events.GuildRoleCreate, async role => {
    await sendLog(role.guild, "roleCreate", {
      color: COLORS.SUCCESS,
      description: "A new role was created.",
      target: role.name,
      details: `Role ID: ${role.id}`
    });
  });

  client.on(Events.GuildRoleDelete, async role => {
    await sendLog(role.guild, "roleDelete", {
      color: COLORS.DANGER,
      description: "A role was deleted.",
      target: role.name,
      details: `Role ID: ${role.id}`
    });
  });

  client.on(Events.ChannelCreate, async channel => {
    if (!channel.guild) return;

    await sendLog(channel.guild, "channelCreate", {
      color: COLORS.SUCCESS,
      description: "A new channel was created.",
      target: channel.name
    });
  });

  client.on(Events.ChannelDelete, async channel => {
    if (!channel.guild) return;

    await sendLog(channel.guild, "channelDelete", {
      color: COLORS.DANGER,
      description: "A channel was deleted.",
      target: channel.name
    });
  });

  console.log("[NEXORA] Audit listeners registered.");
}

module.exports = { registerLogger };
