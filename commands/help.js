const { RichEmbed } = require("discord.js");

module.exports = {
	run: (bot, message, args) => {
		var embed = new RichEmbed()
			.setFooter(`Ran by ${message.author.tag}`, message.author.displayAvatarURL)
			.setColor("f5f5dc");
		if (args.length === 0) {
			embed.setTitle("Commands")
				.setDescription(bot.commands.enabledCommands.map((cmd) => `\`${cmd.settings.usage}\``))
				.addField("Creators", "ethanlaj#8805 & gt_c#7841")
				.addField("Prefix", require("../botconfig").prefix);
		} else {
			var command = bot.commands.enabledCommands
				.find((cmd) => (cmd.settings.aliases || []).concat(cmd.settings.name).includes(args[0].toLowerCase()));
			if (command != null)
				embed.setTitle(`${command.settings.name} command`)
					.setDescription(`Name: \`${command.settings.name}\`` +
						`\nUsage: \`${command.settings.usage}\`` +
						`\nAliases: \`${(command.settings.aliases || ["None."]).join("`, `")}\``);
			else
				return message.reply("Invalid command.");
		}
		message.channel.send(embed);
	},
	settings: {
		name: "help",
		usage: "-help [command]"
	}
};