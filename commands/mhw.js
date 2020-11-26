module.exports = {
	name: "mhw",
	description: 'Pulls a respective page from mhworld.kiranico.com.\n\n'
	+'arg0:\n'
	+'> m : Search monster name\n'
	+'> q<1-9>, q<m1-m6> : Search quests. Remove <> in star rating.\n'
	+'> ih, im, is, ia, ir : Search items. Healing, Materials, Special, Ammo, Room.\n'
	+'> a<1-12> : Search armors/charms. Remove <> in armor rarity. Use any rarity for charms.\n'
	+'> s : Search skills.\n'
	+'> d : Search decorations.\n'
	+'> gs, ss, db, ls, h, hh, l, gl, sa, cb, ig, b, hbg, lbg : Search weapons by class.\n\n'
	+'arg1:\n'
	+'> object-name-with-dash-for-spaces\n'
	+'> top : go to top level of arg0 page\n',
	
	args: true,
	usage: '`arg0` `arg1`',

	

	execute: async (message, args) => {
		// convert args to lower case
		var argsLower = [];
		for (var i = 0; i < args.length; i++) {
			argsLower.push(args[i].toLowerCase());
		}

		args = argsLower;

		let obsolete = []; // Array of what was crawled already
		

		let c = new Crawler();

		async function crawlAllUrls(url) {
			console.log(`Crawling ${url}`);
			c.queue({
				uri: url,
				callback: function (err, res, done) {
					if (err) throw err;
					let $ = res.$;
					try {
						let urls = $("a");
						//console.log(urls);
						Object.keys(urls).forEach((item) => {
							if (urls[item].type === 'tag') {
								let href = urls[item].attribs.href;
								if (href && !obsolete.includes(href)) {
									href = href.trim();
									obsolete.push(href);
									return obsolete;
                            // Slow down the
                            setTimeout(function() {
                                href.startsWith('http') ? crawlAllUrls(href) : crawlAllUrls(`${url}${href}`) // The latter might need extra code to test if its the same site and it is a full domain with no URI
                            }, 5000)

                        }
                    }
                });
					} catch (e) {
						console.error(`Encountered an error crawling ${url}. Aborting crawl.`);
						done()

					}
					done();
					
					// make array of split arrays
					let urlSplitArr = [];
					let urSplit;

					

					for (var i=0; i<obsolete.length; i++) {
						urlSplit = obsolete[i].split('/');
						//console.log(urlSplit);
						urlSplitArr.push(urlSplit);	
					}
					
					// make function to search for requested page in array of urls
					function checkElement(array, arg) {
						var urlEnds = [];

						// given array of urls, split off only the last one
						for (var i = 0; i < array.length; i++) {
							urlEnds.push(array[i].slice(array[i].length-1));
						}

						var item;
						for (var i = 0; i < array.length; i++) {
							item = urlEnds[i];

							if (item.toString() === arg.toString()) {
								return i; // return index of match
							}
						}
						return false;
					}
					//console.log(urlSplitArr[0]);
					
					
					const index = checkElement(urlSplitArr, args[1]);
					if (index === false) {
						message.channel.send("Page not found! Check your input or try again later. The site may be down.");
						return;
					}
					const urlMatch = obsolete[index];
					message.channel.send(urlMatch);
					



				}
			})

		}

			// check for return to top page
			if (args[1] === 'top') {
				if (args[0] === 'm') {
					args[1] = 'monsters';
				} else if ( args[0] === 'q1' || 
							args[0] === 'q2' ||
							args[0] === 'q3' || 
							args[0] === 'q4' ||
							args[0] === 'q5' ||
							args[0] === 'q6' ||
							args[0] === 'q7' ||
							args[0] === 'q8' ||
							args[0] === 'q9' ||
							args[0] === 'qm1' ||
							args[0] === 'qm2' ||
							args[0] === 'qm3' ||
							args[0] === 'qm4' ||
							args[0] === 'qm5' ||
							args[0] === 'qm6' ) {
					args[1] = 'quests';
				} else if ( args[0] === 'ih' ||
							args[0] === 'im' ||
							args[0] === 'is' ||
							args[0] === 'ia' ||
							args[0] === 'ir' ) {
					args[1] = 'items';
				} else if ( args[0] === "a1" ||
							args[0] === "a2" ||
							args[0] === "a3" ||
							args[0] === "a4" ||
							args[0] === "a5" ||
							args[0] === "a6" ||
							args[0] === "a7" ||
							args[0] === "a8" ||
							args[0] === "a9" ||
							args[0] === "a10" ||
							args[0] === "a11" ||
							args[0] === "a12" ) {
					args[1] = 'armorseries';
				} else if ( args[0] === 's') {
					args[1] = 'skilltrees';
				} else if ( args[0] === 'd') {
					args[1] = 'decorations';
				} else if ( args[0] === 'gs' ||
							args[0] === 'ss' ||
							args[0] === 'db' ||
							args[0] === 'ls' ||
							args[0] === 'h' ||
							args[0] === 'hh' ||
							args[0] === 'l' ||
							args[0] === 'gl' ||
							args[0] === 'sa' ||
							args[0] === 'cb' ||
							args[0] === 'ig' ||
							args[0] === 'b' ||
							args[0] === 'hbg' ||
							args[0] === 'lbg' ) {
					args[1] = 'weapons';
				}
			}
			/*
			if (args[1] === 'top' && args[0] === "m") {
				args[1] = "monsters";
			} else if (args[1]  && (args[0] === "quest")) {
				args[1] = "quests";
			} else if ((args[0] === args[1]) && (args[0] === "item")) {
				args[1] = "items";
			} else if ((args[0] === args[1]) && (args[0] === "armor")) {
				args[1] = "armorseries";
			} else if ((args[0] === args[1]) && (args[0] === "skill")) {
				args[1] = "skilltrees";
			} else if ((args[0] === args[1]) && (args[0] === "deco")) {
				args[1] = "decorations";
			} else if ((args[0] === args[1]) && (args[0] === "weapon")) {
				args[1] = "weapons";
			}*/

			/* await user reply for weapon type
			if (args[0] === "weapon") {
				message.reply("Choose your weapon type: Hammer or Bow?");
				const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {time: 10000});
				//console.log(collector);
				collector.on('collect', message => {
					if (message.content == "Hammer") {
						message.channel.send("You're using a Hammer!");
					} else if (message.conent == "Change") {
						message.channel.send("You're using Bow!");
					}
				})
			}*/

			// build url handler based on items/decos/etc

			if (args[0] === "m" && args.length === 2)	{
				//crawlAllUrls('https://webcache.googleusercontent.com/search?q=cache:CDB1lKL58lUJ:https://mhworld.kiranico.com/monsters+&cd=1&hl=en&ct=clnk&gl=us&client=firefox-b-1-d');
				crawlAllUrls('https://mhworld.kiranico.com/monsters');
			} 


			else if (args[0] === "q1" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/quests?star=1');
			} else if (args[0] === "q2" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/quests?star=2');
			} else if (args[0] === "q3" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/quests?star=3');
			} else if (args[0] === "q4" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/quests?star=4');
			} else if (args[0] === "q5" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/quests?star=5');
			} else if (args[0] === "q6" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/quests?star=6');
			} else if (args[0] === "q7" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/quests?star=7');
			} else if (args[0] === "q8" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/quests?star=8');
			} else if (args[0] === "q9" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/quests?star=9');
			} else if (args[0] === "qm1" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/quests?star=11');
			} else if (args[0] === "qm2" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/quests?star=12');
			} else if (args[0] === "qm3" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/quests?star=13');
			} else if (args[0] === "qm4" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/quests?star=14');
			} else if (args[0] === "qm5" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/quests?star=15');
			} else if (args[0] === "qm6" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/quests?star=16');
			} 


			else if (args[0] === "ih" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/items?type=0');
			} else if (args[0] === "im" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/items?type=1');
			} else if (args[0] === "is" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/items?type=2');
			} else if (args[0] === "ia" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/items?type=3');
			} else if (args[0] === "ir" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/items?type=5');
			}



			 else if (args[0] === "a1" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/armorseries?rarity=1');
			} else if (args[0] === "a2" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/armorseries?rarity=2');
			} else if (args[0] === "a3" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/armorseries?rarity=3');
			} else if (args[0] === "a4" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/armorseries?rarity=4');
			} else if (args[0] === "a5" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/armorseries?rarity=5');
			} else if (args[0] === "a6" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/armorseries?rarity=6');
			} else if (args[0] === "a7" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/armorseries?rarity=7');
			} else if (args[0] === "a8" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/armorseries?rarity=8');
			} else if (args[0] === "a9" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/armorseries?rarity=9');
			} else if (args[0] === "a10" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/armorseries?rarity=10');
			} else if (args[0] === "a11" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/armorseries?rarity=11');
			} else if (args[0] === "a11" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/armorseries?rarity=12');
			} 

			else if (args[0] === "skill" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/skilltrees');
			}

			 else if (args[0] === "deco" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/decorations');
			} 

			 else if (args[0] === "gs" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/weapons?type=0');
			} else if (args[0] === "ss" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/weapons?type=1');
			} else if (args[0] === "db" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/weapons?type=2');
			} else if (args[0] === "ls" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/weapons?type=3');
			} else if (args[0] === "h" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/weapons?type=4');
			} else if (args[0] === "hh" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/weapons?type=5');
			} else if (args[0] === "l" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/weapons?type=6');
			} else if (args[0] === "gl" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/weapons?type=7');
			} else if (args[0] === "sa" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/weapons?type=8');
			} else if (args[0] === "cb" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/weapons?type=9');
			} else if (args[0] === "ig" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/weapons?type=10');
			} else if (args[0] === "b" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/weapons?type=11');
			} else if (args[0] === "hbg" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/weapons?type=12');
			} else if (args[0] === "lbg" && args.length === 2) {
				crawlAllUrls('https://mhworld.kiranico.com/weapons?type=13');
			}  

			else {
				message.channel.send("Invalid input! For more info, use `!help mhw`");
				return;
			}
	}
};
