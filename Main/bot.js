const { Client, Intents, Collection } = require("discord.js");
const { readdirSync } = require("fs");

const client = new Client({
    allowedMentions: {
        parse: ["roles", "users", "everyone"],
        repliedUser: false
    },
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
    ]
});

client.slashCommands = new Collection;
client.commands = new Collection;
client.config = require("./config");
client.prefix = client.config.prefix;
if (!client.token) client.token = client.config.token;

/**
 * Handling Error
 */
client.on("disconnect", () => {
    console.log(`[ Client ] Disconnecting...`)
});
client.on("reconnecting", () => {
    console.log(`[ Client ] Reconnecting...`)
});
client.on("warn", warnError => {
    console.log(warnError)
});
client.on("error", error => {
    console.log(error)
});
process.on('unhandledRejection', (reason, p) => {
    console.log(reason, p)
});
process.on('uncaughtException', (error, origin) => {
    console.log(error, origin)
});
process.on('uncaughtExceptionMonitor', (type, promise, reason) => {
    console.log(type, promise, reason)
});

/**
 * Client Events
 */
readdirSync("./Main/events/Client/").forEach(file => {
    const event = require(`./events/Client/${file}`)
    const eventName = file.split(".")[0]
    console.log(`[ Client Event ] Loaded ${eventName}`)
    client.on(eventName, (...args) => event.run(client, ...args))
});
/**
 * Import all commands
 */
 readdirSync("./Main/commands/").forEach(dir => {
    const commandFiles = readdirSync(`./Main/commands/${dir}/`).filter(f => f.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${dir}/${file}`);
        console.log(`[ Command ] ${command.name}`);
        client.commands.set(command.name, command);
    }
})

/**
 * Slash Commands
 */
const data = [];

readdirSync("./Main/slashCommands/").forEach((dir) => {
    const slashCommandFile = readdirSync(`./Main/slashCommands/${dir}/`).filter((files) => files.endsWith(".js"))
    for (const file of slashCommandFile) {
        const slashCommand = require(`./slashCommands/${dir}/${file}`)
        if (!slashCommand.name) return console.log(`[ Slash Command Error ] ${slashCommand.split(".")[0]} Application Command Name is Required.`)
        if (!slashCommand.description) return console.log(`[ Slash Command Error ] ${slashCommand.split(".")[0]} Application Command Description is Required.`)
        client.slashCommands.set(slashCommand.name, slashCommand)
        console.log(`[ Slash Command ] Loaded (/) ${slashCommand.name}`)
        data.push(slashCommand)
    }
});

client.on("ready", async () => {
    await client.application.commands.set(data).then(() => console.log(`[ Slash Command ] Application (/) Registered.`)).catch((e) => console.log(e))
});

client.login(client.config.token)