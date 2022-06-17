const { ShardingManager } = require("discord.js");
const config = require("./Main/config");
const manager = new ShardingManager('./Main/bot.js', {
    totalShards: 'auto',
    token: config.token,
    respawn: true
});

manager.on('shardCreate', shard => console.log(`[ SHARD ] Launched Shard ${shard.id}`))
manager.spawn();