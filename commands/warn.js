var mods = require('../utility/moderator.js');
module.exports = {
	run: async function (bot, message, args) {
		if (!mods.checkMod(bot, message.member))
			return message.reply('You do not have permission to run this command!');
		if (!message.mentions.members.first()) return message.reply(`You did not supply enough parameters. Usage: \`${this.settings.usage}\``);
		var reason = args.slice(1).join(' ') || 'No reason provided';
		var member = message.mentions.members.first();
		member.send(`You have been warned in \`${message.guild.name}\` for \`${reason}\``).then(() => {
			message.reply(`Successfully warned \`${member.user.tag}\` for \`${reason}\``);
		}).catch(() => {
			message.reply(`Attemped to warn \`${member.user.tag}\` for \`${reason}\`, but couldn't message this user.`);
		});
	},
	settings: {
		name: 'warn',
		usage: '-warn (@user) [reason]',
	}
};