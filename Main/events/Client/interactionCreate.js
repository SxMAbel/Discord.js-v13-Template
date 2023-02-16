const { Client, CommandInteraction } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    if (interaction.isCommand()) {
      const slashCommands = await client.slashCommands.get(
        interaction.commandName
      );

      if (!slashCommands) return;

      try {
        await slashCommands.run(client, interaction);
      } catch (error) {
        await interaction[interaction.replied ? "editReply" : "followUp"]({
          ephemeral: true,
          content: `An unexcepted error occured.`,
        }).catch(() => {});
        console.error(error);
      }
    } else return;
  },
};
