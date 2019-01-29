const { GuildMember } = require('discord.js');

var mods = require('../utility/moderator.js');
function checkPerms(message, member) {
	return member.bannable && message.member.highestRole.position > member.highestRole.position;
}
module.exports = {
	run: async function (bot, message, args) {
		if (!mods.checkMod(bot, message.member))
			return message.reply('You do not have permission to run this command!');
		try {
			var member = args[0] && (message.guild.members.find((mem) => args[0].includes(mem.id)) || await bot.fetchUser(args[0]));
		} catch (exc) {
			return message.reply('You did not specify a valid ID.');
		}
		if (!member)
			return message.reply(`You did not specify a valid user. Usage: \`${this.settings.usage}\``);
		var reason = args.slice(1).join(' ') || 'No reason provided';
		var id = member instanceof GuildMember ? member.id : args[0];

		if (member instanceof GuildMember) {
			if (!checkPerms(message, member))
				return message.reply('You cannot ban this person!');
			await member.send(`You have been banned from \`${message.guild.name}\` for \`${reason}\``)
				.catch(() => {});
			message.guild.ban(id, {reason: reason}).then(() => {
				message.reply(`Successfully banned \`${member.user.tag}\``);
			}).catch(() => {
				message.reply('Couldn\'t ban this member.');
			});
		} else {
			message.guild.ban(id, {reason: reason}).then(() => {
				message.reply(`Successfully banned \`${member.tag}\``);
			}).catch(() => {
				message.reply('Couldn\'t ban this member.');
			});
		}
	},
	settings: {
		name: 'ban',
		usage: '-ban (@user | userid) [reason]',
	}
};