var Discord = require("discord.js");
module.exports = {
	run: (bot, message, args) => {
		var announceChannel = bot.channels.get(module.exports.settings.announceChannel);
		if (!message.member.roles.has("503599315227377675")) return message.reply("You do not have permission to use this command!");
		if (!args[0]) return message.reply(`You did not supply enough parameters. Usage: \`${module.exports.settings.usage}\``);
		var announceEmbed = new Discord.RichEmbed()
			.setColor("#f5f5dc")
			.addField("New Announcement", args.join(" "))
			.addField("Announced By:", `\n${message.author.toString()}`)
			.setFooter(message.author.tag);
		announceChannel.send("@here", { embed: announceEmbed, disableEveryone: false });
	},
	settings: {
		name: "announce",
		usage: "!announce (announcement)",
		announceChannel: "503598195901988880",
		requiredRole: "503599315227377675",
	}
};
