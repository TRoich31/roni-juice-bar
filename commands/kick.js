const { GuildMember } = require("discord.js");

var mods = require("../utility/moderator.js");
function checkPerms(message, member) {
	return member.kickable && message.member.highestRole.position > member.highestRole.position;
}
module.exports = {
	run: async function (bot, message, args) {
		if (!mods.checkMod(bot, message.member))
			return message.reply("You do not have permission to run this command!");
		try {
			var member = args[0] && (message.guild.members.find((mem) => args[0].includes(mem.id)) || await bot.fetchUser(args[0]));
		} catch (exc) {
			return message.reply("You did not specify a valid ID.");
		}
		if (!member)
			return message.reply(`You did not specify a valid user. Usage: \`${this.settings.usage}\``);
		var reason = args.slice(1).join(" ") || "No reason provided";
		if (member instanceof GuildMember) {
			if (!checkPerms(message, member))
				return message.reply("You cannot kick this person!");
			await member.send(`You have been kicked from \`${message.guild.name}\` for \`${reason}\``)
				.catch(() => {});
			member.kick(reason).then(() => {
				message.reply(`Successfully kicked \`${member.user.tag}\``);
			}).catch(() => {
				message.reply("Couldn't kick this member.");
			});
		} else {
			message.reply("This person is not in the guild!");
		}
	},
	settings: {
		name: "kick",
		usage: "-kick (@user | userid) [reason]",
	}
};