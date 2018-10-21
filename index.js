const botconfig = require("./botconfig.js");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({ disableEveryone: true, fetchAllMembers: true });
bot.commands = { enabledCommands: new Discord.Collection(), disabledCommands: [] };
bot.allcommands = new Discord.Collection();
bot.loaders = { enabledLoaders: [], disabledLoaders: [] };
bot.muted = [];

var loadFile = fs.readdirSync(__dirname + "/load");

for (let file of loadFile) {
	try {
		let loader = require("./load/" + file);
		bot.loaders.enabledLoaders.push(loader);
	} catch (err) {
		bot.loaders.disabledLoaders.push(file);
		console.log(`\nThe ${file} load module failed to load:`);
		console.log(err);
	}
}
function checkCommand(command, name) {
	var resultOfCheck = [true, null];
	if (!command.run) resultOfCheck[0] = false; resultOfCheck[1] = `Missing Function: "module.run" of ${name}.`;
	if (!command.settings) resultOfCheck[0] = false; resultOfCheck[1] = `Missing Object: "module.settings" of ${name}.`;
	if (command.settings && !command.settings.name) resultOfCheck[0] = false; resultOfCheck[1] = `Missing String: "module.settings.name" of ${name}.`;
	return resultOfCheck;
}
fs.readdir("./commands/", (err, files) => {
	if (err) console.log(err);
	var jsfiles = files.filter((f) => f.split(".").pop() === "js");
	if (jsfiles.length <= 0) return console.log("Couldn't find commands.");
	for (let i= 0, len = jsfiles.length; i < len; i++) {
		const f = jsfiles[i];
		try {
			var props = require(`./commands/${f}`);
			bot.allcommands.set(props.settings.name, props);
			if (checkCommand(props, f)[0]) {
				bot.commands.enabledCommands.set(props.settings.name, props);
			} else {
				throw checkCommand(props, f)[1];
			}
		} catch (err) {
			bot.commands.disabledCommands.push(f);
			console.log(`\nThe ${f} command failed to load:`);
			console.log(err);
		}
	}
});
bot.safeSend = function(message, name) {
	return message.author.send(`You attempted to use the \`${name}\` command in ${message.channel.toString()}, but I cannot chat there.`);
};
bot.on("ready", async () => {
	console.log("-------------------------------------------------------------");
	console.log(`${bot.user.tag} is online. ${bot.commands.enabledCommands.size}/${bot.commands.enabledCommands.size + bot.commands.disabledCommands.length} commands loaded successfully.`);
	console.log("-------------------------------------------------------------");
	let loaders = bot.loaders.enabledLoaders;
	for (let loader of loaders) {
		if (loader.run != null) loader.run(bot);
	}
});
bot.on("guildMemberAdd", (member) => {
	if (bot.muted.includes(member.id)) member.addRole(member.guild.roles.find((m) => m.name === "Muted"));
});
bot.on("message", (message) => {
	if (message.channel.type !== "dm" && !message.author.bot) {
		var cmd = message.content.split(/\s+/g)[0].toLowerCase();
		if (cmd != null) {
			var args = message.content.split(/\s+/g).slice(1);
			var prefix = botconfig.prefix;
			cmd = cmd.slice(prefix.length);
			if (message.content.startsWith(prefix)) {
				var commandFile = bot.commands.enabledCommands.find((command) => command.settings.name === cmd || (command.settings.aliases || []).includes(cmd));
				if (commandFile != null) {
					commandFile.run(bot, message, args);
				}
			}
		}
	}
});
bot.login(botconfig.token);
