module.exports.checkMod = function (bot, member) {
	var guild = bot.guilds.get('437715706465746944');
	return member.highestRole.position >= guild.roles.get('437767667047333889').position;
};
