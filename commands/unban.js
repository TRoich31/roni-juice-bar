const mods = require('../utility/moderator.js');

module.exports = {
	run: async function (bot, message, args) {
		if (!mods.checkMod(bot, message.member))
			return message.reply('You do not have permission to run this command!');
		if (!args[0]) return message.reply(`You did not supply enough parameters. Usage: \`${this.settings.usage}\``);
		var bans = await message.guild.fetchBans();
		var user = bans.find((ban) => ban.tag.toLowerCase().startsWith(args.join(' ').toLowerCase()) || args[0].includes(ban.id));

		message.guild.unban(user).then(() => {
			message.reply(`Successfully unbanned \`${user.tag}\`.`);
		}).catch(() => {
			message.reply(`Failed to unban \`${user.tag}\`. Make sure I have the Ban Members permission.`);
		});
	},
	settings: {
		name: 'unban',
		usage: '-unban (user | id)',
	}
};