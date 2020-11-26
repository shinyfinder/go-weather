module.exports = {
	name: "rps",
	description: "A simple game of rock-paper-scizzors with the bot. No draws allowed!",
	execute(message, args) {

		
		const options = ["rock","paper","scissors"];
		let myChoice = options[Math.floor(Math.random() * options.length)];
		let gameOn = 1;
		if (!args.length) {

			message.reply('Choose your weapon:');
			const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {time: 10000});
			//let gameOn = 1;

			collector.on('collect', message => {
				while (gameOn == 1) {
					if (message.content == "r" || message.content == "rock" || message.content == "Rock") {
						if (myChoice == "rock") {
							myChoice = options[Math.floor(Math.random() * options.length)];
						} else if (myChoice == "paper") {
							message.channel.send("I chose Paper. I win!\n");
							gameOn = 0;
							collector.stop();
						} else if (myChoice == "scissors") {
							message.channel.send("I chose Scissors. You win!\n");
							gameOn = 0;
							collector.stop();
						}

					} else if (message.content == "p" || message.content == "paper" || message.content == "Paper") {
						if (myChoice == "paper") {
							myChoice = options[Math.floor(Math.random() * options.length)];
						} else if (myChoice == "scissors") {
							message.channel.send("I chose Scissors. I win!\n");
							gameOn = 0;
							collector.stop();
						} else if (myChoice == "rock") {
							message.channel.send("I chose Rock. You win!\n");
							gameOn = 0;
							collector.stop();
						}

					} else if (message.content == "s" || message.content == "scissors" || message.content == "Scissors") {
						if (myChoice == "scissors") {
							myChoice = options[Math.floor(Math.random() * options.length)];
						} else if (myChoice == "rock") {
							message.channel.send("I chose Rock. I win!\n");
							gameOn = 0;
							collector.stop();
						} else if (myChoice == "paper") {
							message.channel.send("I chose Paper. You win!\n");
							gameOn = 0;
							collector.stop();
						}


					}
				}

			});

			collector.on('end', collected => {
				message.channel.send('GG!');
			});

		} else if (args.legnth && args.length != 1) {
			message.reply("Cheaters never prosper.");
			return;

		} else {
			while (gameOn == 1) {
				if (args[0] == "r" || args[0] == "rock" || args[0] == "Rock") {
					if (myChoice == "rock") {
						myChoice = options[Math.floor(Math.random() * options.length)];
					} else if (myChoice == "paper") {
						message.channel.send("I chose Paper. I win!\nGG!");
						gameOn = 0;
						return;
					} else if (myChoice == "scissors") {
						message.channel.send("I chose Scissors. You win!\nGG!");
						gameOn = 0;
						return;
					}
					
				} else if (args[0] == "p" || args[0] == "paper" || args[0] == "Paper") {
					if (myChoice == "paper") {
						myChoice = options[Math.floor(Math.random() * options.length)];
					} else if (myChoice == "scissors") {
						message.channel.send("I chose Scissors. I win!\nGG!");
						gameOn = 0;
						return;
					} else if (myChoice == "rock") {
						message.channel.send("I chose Rock. You win!\nGG!");
						gameOn = 0;
						return;
					}
					
				} else if (args[0] == "s" || args[0] == "scissors" || args[0] == "Scissors") {
					if (myChoice == "scissors") {
						myChoice = options[Math.floor(Math.random() * options.length)];
					} else if (myChoice == "rock") {
						message.channel.send("I chose Rock. I win!\nGG!");
						gameOn = 0;
						return;
					} else if (myChoice == "paper") {
						message.channel.send("I chose Paper. You win!\nGG!");
						gameOn = 0;
						return;
					}


				}
			}
		}




	},
};