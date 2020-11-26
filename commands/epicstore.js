module.exports = {
	name: "epicstore",
	description: 'Show your true feelings for the Epic games store.',
	aliases: ['epic'],

	execute(message) {
		var messOut = '```           /¯/)\n'
					+ '          /..//\n'
					+ '         /...//\n'
					+ '        /....//\n'
					+ '    /´¯/..../´¯\\\n'
					+ ' /./.. /..../..../.. |_        EPIC STORE\n'
					+ '(.(....(....(..../.) ..)\n'
					+ ' \\................\\/.../\n'
					+ '  \\.................../\n'
					+ '   \\.................(\n```';



		message.channel.send(messOut);
	},
};