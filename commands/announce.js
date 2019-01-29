var Discord = require('discord.js');
module.exports = {
	run: function (bot, message, args) {
		var announceChannel = bot.channels.get(this.settings.announceChannel);
		if (!message.member.roles.has(this.settings.requiredRole)) return message.reply('You do not have permission to use this command!');
		if (!args[1]) return message.reply(`You did not supply enough parameters. Usage: \`${this.settings.usage}\``);

		let mention = args[0].toLowerCase() === 'here' ? '@here' :
			args[0].toLowerCase() === 'everyone' ? '@everyone' :
				args[0].toLowerCase() === 'none' ? null : 0;

		if (mention === 0)
			return message.reply(`Invalid usage. Usage: \`${this.settings.usage}\``);

		var announceEmbed = new Discord.RichEmbed()
			.setColor('#f5f5dc')
			.addField('New Announcement', args.join(' '))
			.addField('Announced By:', `\n${message.author.toString()}`)
			.setFooter(message.author.tag);

		announceChannel.send(mention, { embed: announceEmbed, disableEveryone: false }).catch(() => {
			message.reply('I do not have permissions to send messages in the announcements channel');
		});
	},
	settings: {
		name: 'announce',
		usage: '-announce (none/everyone/here) (announcement)',
		announceChannel: '494553891145515028',
		requiredRole: '503664784252600352',
	}
};
