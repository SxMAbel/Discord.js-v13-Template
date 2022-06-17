const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "ping",
    description: "Returns Bot Latency",
    run: async (client, interaction) => {
        await interaction.deferReply({
            ephemeral: false
        });
        const ping = client.ws.ping;
        await interaction.editReply({
            embeds: [new MessageEmbed()
                .setColor("AQUA")
                .setDescription(`\`\`\`ini\nPing : [ ${ping}ms ]\`\`\``)
            ]
        });
    }
}