module.exports = {
	name: "hi5gif",
	description: 'The classic high five handler. Posts a gif/image when each half of o/\\o is executed by two users.',
	

	execute(message) {
		const filter = m => !m.author.bot && (m.content.includes('o/') || m.content.includes('\\o'));
		var user1 = message.author.username;
		const images = ["http://i.imgur.com/gXnhbho.jpg", "http://i.imgur.com/58g3qGo.gif", "http://i.imgur.com/kpPxUQN.jpg", "http://i.imgur.com/C9SG3bs.gif", "https://giphy.com/gifs/augustburnsred-august-burns-red-abr-reactions-l3q2Jr69ZOph0LRqU", "https://tenor.com/view/high-five-disney-kronk-emperors-new-groove-yzma-gif-5390002"];



		const collector = message.channel.createMessageCollector(filter, { time: 30000 });

		collector.on('collect', m => {
			if (m.content.includes('o/') || m.content.includes('\\o')) {
				var user2 = m.author.username;

				message.channel.send(`${user1} o/\\o ${user2}`);
				if (user1 == user2) {
					message.channel.send('https://memegenerator.net/img/instances/400x/75248489/self-five.jpg');
				} else {
					const randomnumber = Math.floor(Math.random() * images.length);
					const img = images[randomnumber];
					message.channel.send(img);
				}

				collector.stop();
			}
		});


	},
};