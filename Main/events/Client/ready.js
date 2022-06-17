module.exports = {
    name: "ready",


    run: async (client) => {
        let memberCount = 0
        client.guilds.cache.forEach((guild) => {
            memberCount += guild.memberCount
        });

        console.log(`[ READY ] ${client.user.username} Online!`)
        console.log(`[ READY ] Ready on ${client.guilds.cache.size} Servers For a total of ${memberCount} Users`)


        let statusArray = [`Prefix: ${client.prefix}`, `for ${memberCount} users`]
        setInterval(function () {
            let status = statusArray[Math.floor(Math.random() * statusArray.length)]
            client.user.setPresence({
                activities: [
                    {
                        name: status,
                        type: "PLAYING"
                    }
                ],
            });
        }, 5000)
    }
}