
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
        { name: "Username", value: member.user.tag, inline: true },
        { name: "User ID", value: member.id, inline: true },
        { name: "Account Created", value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>` }
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
        { name: "Username", value: member.user.tag, inline: true },
        { name: "User ID", value: member.id, inline: true }
      ]
    });
  });

  // MESSAGE DELETE
  client.on(Events.MessageDelete, async message => {
    if (!message.guild || !message.author || message.author.bot) return;

    await sendLog(message.guild, {
      title: "MESSAGE DELETED",
      description: "A message was deleted.",
      color: COLORS.warning,
      event: "MESSAGE DELETE",
      fields: [
        { name: "Author", value: `${message.author}`, inline: true },
        { name: "Channel", value: `${message.channel}`, inline: true },
        { name: "Message ID", value: message.id }
      ]
    });
  });

  // MESSAGE UPDATE
  client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
    if (!newMessage.guild || !newMessage.author || newMessage.author.bot) return;

    await sendLog(newMessage.guild, {
      title: "MESSAGE EDITED",
      description: "A message was edited.",
      color: COLORS.info,
      event: "MESSAGE UPDATE",
      fields: [
        { name: "Author", value: `${newMessage.author}`, inline: true },
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

  // ROLE UPDATE
  client.on(Events.GuildRoleUpdate, async (oldRole, newRole) => {
    const changes = [];

    if (oldRole.name !== newRole.name) {
      changes.push({
        name: "Name",
        value: `${oldRole.name} → ${newRole.name}`
      });
    }

    if (oldRole.color !== newRole.color) {
      changes.push({
        name: "Color",
        value: `${oldRole.hexColor} → ${newRole.hexColor}`
      });
    }

    if (oldRole.hoist !== newRole.hoist) {
      changes.push({
        name: "Displayed Separately",
        value: `${oldRole.hoist} → ${newRole.hoist}`
      });
    }

    if (oldRole.mentionable !== newRole.mentionable) {
      changes.push({
        name: "Mentionable",
        value: `${oldRole.mentionable} → ${newRole.mentionable}`
      });
    }

    if (changes.length === 0) return;

    await sendLog(newRole.guild, {
      title: "ROLE UPDATED",
      description: `Role **${newRole.name}** was modified.`,
      color: COLORS.info,
      event: "ROLE UPDATE",
      fields: [
        { name: "Role ID", value: newRole.id },
        ...changes
      ]
    });
  });

  // CHANNEL CREATE
  client.on(Events.ChannelCreate, async channel => {
    if (!channel.guild) return;

    await sendLog(channel.guild, {
      title: "CHANNEL CREATED",
      description: `A new channel was created: ${channel.name}`,
      color: COLORS.success,
      event: "CHANNEL CREATE",
      fields: [
        { name: "Channel", value: `${channel}`, inline: true },
        { name: "Channel ID", value: channel.id, inline: true }
      ]
    });
  });

  // CHANNEL DELETE
  client.on(Events.ChannelDelete, async channel => {
    if (!channel.guild) return;

    await sendLog(channel.guild, {
      title: "CHANNEL DELETED",
      description: `A channel was deleted: ${channel.name}`,
      color: COLORS.danger,
      event: "CHANNEL DELETE",
      fields: [
        { name: "Channel Name", value: channel.name || "Unknown", inline: true },
        { name: "Channel ID", value: channel.id, inline: true }
      ]
    });
  });

  // CHANNEL UPDATE
  client.on(Events.ChannelUpdate, async (oldChannel, newChannel) => {
    if (!newChannel.guild) return;

    const changes = [];

    if (oldChannel.name !== newChannel.name) {
      changes.push({
        name: "Name",
        value: `${oldChannel.name} → ${newChannel.name}`
      });
    }

    if (oldChannel.parentId !== newChannel.parentId) {
      changes.push({
        name: "Category",
        value: `${oldChannel.parentId || "None"} → ${newChannel.parentId || "None"}`
      });
    }

    if (changes.length === 0) return;

    await sendLog(newChannel.guild, {
      title: "CHANNEL UPDATED",
      description: "A channel configuration was changed.",
      color: COLORS.info,
      event: "CHANNEL UPDATE",
      fields: [
        { name: "Channel ID", value: newChannel.id },
        ...changes
      ]
    });
  });

  // SERVER UPDATE
  client.on(Events.GuildUpdate, async (oldGuild, newGuild) => {
    const changes = [];

    if (oldGuild.name !== newGuild.name) {
      changes.push({
        name: "Server Name",
        value: `${oldGuild.name} → ${newGuild.name}`
      });
    }

    if (oldGuild.description !== newGuild.description) {
      changes.push({
        name: "Description",
        value: "Server description was changed."
      });
    }

    if (changes.length === 0) return;

    await sendLog(newGuild, {
      title: "SERVER SETTINGS UPDATED",
      description: "Server settings were modified.",
      color: COLORS.info,
      event: "SERVER UPDATE",
      fields: changes
    });
  });

  console.log("[NEXORA] General audit listeners registered.");
}

module.exports = { registerLogger };
