const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
    name: "messageCreate",
    run: async (client, message) => {

        if (message.author.bot) return;
        if (!message.guild) return;

        const prefix = client.prefix;
        const channel = message?.channel;
        const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);

        if (message.content.match(mention)) {
            const embed = new MessageEmbed()
                .setColor(client.embedColor)
                .setDescription(`› **My prefix in this server is \`${prefix}\`**`);
            message.channel.send({ embeds: [embed] })
        };

        const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
        if (!prefixRegex.test(message.content)) return;
        const [matchedPrefix] = message.content.match(prefixRegex);
        const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName) ||
            client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        if (!message.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES)) return await message.author.dmChannel.send({ content: `I don't have **\`SEND_MESSAGES\`** permission in <#${message.channelId}> to execute this **\`${command.name}\`** command.` }).catch(() => { });

        if (!message.guild.me.permissions.has(Permissions.FLAGS.VIEW_CHANNEL)) return;

        if (!message.guild.me.permissions.has(Permissions.FLAGS.EMBED_LINKS)) return await message.channel.send({ content: `I don't have **\`EMBED_LINKS\`** permission to execute this **\`${command.name}\`** command.` }).catch(() => { });

        const embed = new MessageEmbed()
            .setColor("RED");

        // args: true,
        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, ${message.author}!`;

            // usage: '',
        if (command.usage) {
                reply += `\n\`${prefix}${command.name} ${command.usage}\``;
            }

            embed.setDescription(reply);
            return message.channel.send({ embeds: [embed] });
        }

        try {
            command.execute(client, message, args);
        } catch (error) {
            console.log(error);
            embed.setDescription("There was an error executing that command.\nI have contacted the owner of the bot to fix it immediately.");
            return message.channel.send({ embeds: [embed] });
        }
    }
};