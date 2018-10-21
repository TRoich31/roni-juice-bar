var Discord = require("discord.js");
module.exports = {
	run: function (bot, message, args) {
		if (bot.timeout.includes(message.author.id)) return message.reply("You can only use this command every 60 seconds!");
		var suggestChannel = bot.channels.get(this.settings.suggestChannel);
		if (!args.join(" ").split(",")[0]) return message.reply(`You did not supply enough parameters. Usage: \`${this.settings.usage}\``);
		var suggestEmbed = new Discord.RichEmbed()
			.setColor("#f5f5dc")
			.setTitle(args.join(" ").split(",")[0].trim())
			.setFooter(`Suggested by ${message.author.tag}`, message.author.displayAvatarURL);
		if (args.join(" ").split(",")[1]) suggestEmbed.setDescription(args.join(" ").split(",")[1].trim());
		suggestChannel.send({ embed: suggestEmbed }).then((newMessage) => {
			newMessage.react("👍").then(() => {
				newMessage.react("👎");
			});
			bot.timeout.push(message.author.id);
			bot.setTimeout(() => {
				bot.timeout.splice(bot.timeout.indexOf(message.author.id), 1);
			}, 60000);
		}).catch(() => {
			message.reply("I do not have permissions to send messages in the suggestions channel");
		});
	},
	settings: {
		name: "suggest",
		usage: "-suggest (title), [description]",
		suggestChannel: "503659235301785632"
	}
};
