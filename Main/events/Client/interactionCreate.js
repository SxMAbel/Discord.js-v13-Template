const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    run: async (client, interaction) => {

        if (interaction.isCommand()) {

            const slashCommands = await client.slashCommands.get(interaction.commandName)
            if (!slashCommands) return;

            try {
                await slashCommands.run(client, interaction);
            } catch (error) {
                if (interaction.replied) {
                    await interaction.editReply({
                        embeds: [new MessageEmbed()
                            .setDescription("An Unexpected Error Occured.")
                            .setColor("RED")
                        ]
                    }).catch(() => { })
                } else {
                    await interaction.followUp({
                        embeds: [new MessageEmbed()
                            .setDescription("An Unexcepted Error Occured.")
                            .setColor("RED")
                        ]
                    })
                }
                console.log(error)
            };
        } else return;
    }
};