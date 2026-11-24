
const {
  SlashCommandBuilder
} = require("discord.js");

const {
  getWhitelist,
  addToWhitelist,
  removeFromWhitelist
} = require("../systems/whitelist");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("whitelist")
    .setDescription("Manage the NEXORA trusted users list")

    .addSubcommand(sub =>
      sub.setName("add")
        .setDescription("Add a trusted user")
        .addUserOption(option =>
          option.setName("user")
            .setDescription("The user to trust")
            .setRequired(true)
        )
    )

    .addSubcommand(sub =>
      sub.setName("remove")
        .setDescription("Remove a trusted user")
        .addUserOption(option =>
          option.setName("user")
            .setDescription("The user to remove")
            .setRequired(true)
        )
    )

    .addSubcommand(sub =>
      sub.setName("list")
        .setDescription("View all trusted users")
    ),

  async execute(interaction) {
    if (!interaction.guild) return;

    if (interaction.user.id !== interaction.guild.ownerId) {
      return interaction.reply({
        content: "Access denied. Only the server owner can manage the whitelist.",
        ephemeral: true
      });
    }

    const action = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;

    if (action === "add") {
      const user = interaction.options.getUser("user");

      if (user.bot) {
        return interaction.reply({
          content: "Bots cannot be added to the trusted users list.",
          ephemeral: true
        });
      }

      const added = addToWhitelist(guildId, user.id);

      return interaction.reply({
        content: added
          ? `Successfully added ${user.tag} to the trusted users list.`
          : `${user.tag} is already on the trusted users list.`,
        ephemeral: true
      });
    }

    if (action === "remove") {
      const user = interaction.options.getUser("user");

      const removed = removeFromWhitelist(guildId, user.id);

      return interaction.reply({
        content: removed
          ? `Successfully removed ${user.tag} from the trusted users list.`
          : `${user.tag} was not found on the trusted users list.`,
        ephemeral: true
      });
    }

    if (action === "list") {
      const users = getWhitelist(guildId);

      return interaction.reply({
        content: users.length
          ? `**NEXORA TRUSTED USERS**\n${users.map(id => `• <@${id}> — \`${id}\``).join("\n")}`
          : "The trusted users list is currently empty.",
        ephemeral: true
      });
    }
  }
};
