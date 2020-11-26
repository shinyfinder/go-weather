module.exports = {
	name: 'remindMe',
	description: 'Have the bot ping you to remind you of a specified message. Only supports a single specified timeframe.'
					+ ' \n**Example**: !remindMe 10m hello world!',
	args: true,
	usage: '#[s,m,h,d] [message]',
	aliases: ['remindme',"rm","remind"],

	execute(message, args) {
		//client.on('message', msg => {
			try {
				let remindText = args.slice(1); // remainder of text is message

				// extract time designator
				let timeRequest = args[0];
				let timeFrame = timeRequest[timeRequest.length - 1].toLowerCase();
				let timeSpan = parseInt(timeRequest.slice(0,timeRequest.length));

				// convert to ms
				if (timeFrame == "s" || timeFrame == "sec" || timeFrame == "seconds") {
					timeSpan = timeSpan * 1000;
				} else if (timeFrame == "m" || timeFrame == "min" || timeFrame == "minutes" || timeFrame == "minute") {
					timeSpan = timeSpan * 1000 * 60;
				} else if (timeFrame == "h" || timeFrame == "hr" || timeFrame == "hours" || timeFrame == "hour") {
					timeSpan = timeSpan * 1000 * 60 * 60;
				} else if (timeFrame == "d" || timeFrame == "days" || timeFrame == "day") {
					timeSpan = timeSpan * 1000 * 60 * 60 * 24;
				} else {
					message.channel.send("No time frame specified. Please try again");
					return
				}

				// confirm tell
				message.reply("I'll DM you then!");

				// return the message

				setTimeout(sendReminder, timeSpan, remindText.join(' '));

				function sendReminder(arg) {
					message.author.send(`\nReminder: ${arg}`);
					//message.reply(`\nReminder: ${arg}`);
				}

			} catch (e) {
				message.reply("Error");
				console.error(e);
			}
		//})

	},
};