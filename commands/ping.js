module.exports = {
	name: "ping",
	description: 'Test message for bot activity.',

	execute(message) {
		message.channel.send('pong');
	},
};