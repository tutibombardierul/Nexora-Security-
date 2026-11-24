
const { Events } = require("discord.js");
const { sendLog, COLORS } = require("../systems/logger");

function registerLogger(client) {

  // MEMBER JOIN
  client.on(Events.GuildMemberAdd, async member => {
    await sendLog(member.guild, {
      title: "MEMBER JOINED",
      description: `${member.user.tag} joined the server.`,
      color: COLORS.success,
      event: "MEMBER JOIN",
      fields: [
        { name: "User", value: `${member.user}`, inline: true },
        { name: "User ID", value: member.id, inline: true },
        { name: "Account Created", value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:F>` }
      ]
    });
  });

  // MEMBER LEAVE
  client.on(Events.GuildMemberRemove, async member => {
    await sendLog(member.guild, {
      title: "MEMBER LEFT",
      description: `${member.user.tag} left the server.`,
      color: COLORS.warning,
      event: "MEMBER LEAVE",
      fields: [
        { name: "User", value: member.user.tag, inline: true },
        { name: "User ID", value: member.id, inline: true }
      ]
    });
  });

  // MESSAGE DELETE
  client.on(Events.MessageDelete, async message => {
    if (!message.guild || message.author?.bot) return;

    await sendLog(message.guild, {
      title: "MESSAGE DELETED",
      description: "A message was deleted.",
      color: COLORS.danger,
      event: "MESSAGE DELETE",
      fields: [
        { name: "Author", value: message.author?.tag || "Unknown", inline: true },
        { name: "Channel", value: `${message.channel}`, inline: true },
        { name: "Message ID", value: message.id }
      ]
    });
  });

  // MESSAGE UPDATE
  client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
    if (!newMessage.guild || newMessage.author?.bot) return;

    await sendLog(newMessage.guild, {
      title: "MESSAGE EDITED",
      description: "A message was edited.",
      color: COLORS.info,
      event: "MESSAGE UPDATE",
      fields: [
        { name: "Author", value: newMessage.author?.tag || "Unknown", inline: true },
        { name: "Channel", value: `${newMessage.channel}`, inline: true },
        { name: "Message ID", value: newMessage.id }
      ]
    });
  });

  // ROLE CREATE
  client.on(Events.GuildRoleCreate, async role => {
    await sendLog(role.guild, {
      title: "ROLE CREATED",
      description: `A new role was created: **${role.name}**`,
      color: COLORS.success,
      event: "ROLE CREATE",
      fields: [
        { name: "Role", value: role.name, inline: true },
        { name: "Role ID", value: role.id, inline: true }
      ]
    });
  });

  // ROLE DELETE
  client.on(Events.GuildRoleDelete, async role => {
    await sendLog(role.guild, {
      title: "ROLE DELETED",
      description: `A role was deleted: **${role.name}**`,
      color: COLORS.danger,
      event: "ROLE DELETE",
      fields: [
        { name: "Role", value: role.name, inline: true },
        { name: "Role ID", value: role.id, inline: true }
      ]
    });
  });

  // CHANNEL CREATE
  client.on(Events.ChannelCreate, async channel => {
    if (!channel.guild) return;

    await sendLog(channel.guild, {
      title: "CHANNEL CREATED",
      description: `A channel was created: ${channel}`,
      color: COLORS.success,
      event: "CHANNEL CREATE",
      fields: [
        { name: "Channel Name", value: channel.name || "Unknown", inline: true },
        { name: "Channel ID", value: channel.id, inline: true }
      ]
    });
  });

  // CHANNEL DELETE
  client.on(Events.ChannelDelete, async channel => {
    if (!channel.guild) return;

    await sendLog(channel.guild, {
      title: "CHANNEL DELETED",
      description: `A channel was deleted: **${channel.name || "Unknown"}**`,
      color: COLORS.danger,
      event: "CHANNEL DELETE",
      fields: [
        { name: "Channel Name", value: channel.name || "Unknown", inline: true },
        { name: "Channel ID", value: channel.id, inline: true }
      ]
    });
  });

  console.log("[NEXORA] Audit event listeners registered.");
}

module.exports = { registerLogger };
