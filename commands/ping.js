module.exports.run = async (bot, message) => {
	message.reply(`pong! \`${bot.pings[0]}ms\`.`);
};
module.exports.help = {
	name: "ping"
};
