
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType
} = require("discord.js");

const LOG_CHANNELS = [
  "member-logs",
  "message-logs",
  "role-logs",
  "channel-logs",
  "moderation-logs",
  "security-logs"
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("logs")
    .setDescription("Configurează sistemul de audit NEXORA")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(subcommand =>
      subcommand
        .setName("setup")
        .setDescription("Creează automat canalele de audit")
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const guild = interaction.guild;

    if (!guild) {
      return interaction.editReply("Această comandă poate fi folosită doar pe un server.");
    }

    const categoryName = "NEXORA・AUDIT LOGS";

    let category = guild.channels.cache.find(
      channel =>
        channel.name === categoryName &&
        channel.type === ChannelType.GuildCategory
    );

    if (!category) {
      category = await guild.channels.create({
        name: categoryName,
        type: ChannelType.GuildCategory
      });
    }

    const created = [];
    const existing = [];

    for (const channelName of LOG_CHANNELS) {
      let channel = guild.channels.cache.find(
        item =>
          item.name === channelName &&
          item.type === ChannelType.GuildText
      );

      if (channel) {
        existing.push(channelName);
        continue;
      }

      await guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        parent: category.id,
        topic: `NEXORA SECURITY • ${channelName}`
      });

      created.push(channelName);
    }

    return interaction.editReply({
      content:
        `**NEXORA SECURITY — AUDIT SETUP**\n\n` +
        `Categoria: ${category.name}\n` +
        `Canale create: ${created.length}\n` +
        `Canale deja existente: ${existing.length}\n\n` +
        (created.length
          ? `**Create:**\n${created.map(name => `• #${name}`).join("\n")}\n\n`
          : "") +
        (existing.length
          ? `**Deja existente:**\n${existing.map(name => `• #${name}`).join("\n")}`
          : "")
    });
  }
};
      
