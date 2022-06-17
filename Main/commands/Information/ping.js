const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "ping",
    description: "Returns Bot Latency",
    execute: async (client, message, args) => {
        const ping = client.ws.ping;
        await message.reply({
            embeds: [new MessageEmbed()
                .setColor("AQUA")
                .setDescription(`\`\`\`ini\nPing : [ ${ping}ms ]\`\`\``)
            ]
        });
    }
}