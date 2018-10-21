module.exports = {
	run: (bot, message) => {
		message.reply(`pong! \`${bot.pings[0]}ms\`.`);
	},
	settings: {
		name: "ping",
		usage: "-ping"
	}
};
