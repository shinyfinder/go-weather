const fs = require("fs");


module.exports = {
	name: "updatedb",
	description: 'Updates the databases used by !ygo.',
	aliases: ['update'],
	
	execute: async (message) => {
		if (message.author.id !== "212315209740713984") {
            message.channel.send("You do not have permissions to use this command!");
            return
        }
		try {
			message.channel.send("Updating now...");
			// 
			// DUEL LINKS
			//

			// fetch manifest for dl meta website
			const DLres = await fetch('https://www.duellinksmeta.com/rev-manifest.json');
			const DLjson = await DLres.json();
			
			const forbid = DLjson["forbiddenList.json"];
			const obtained = DLjson["cardObtain.json"];
			const exclusive = DLjson["exclusiveCards.json"];
			const skills = DLjson["skills.json"];


			// retrieve the json files
			const forbidResURL = 'https://www.duellinksmeta.com/data-hashed/' + forbid;
			const obtainedResURL = 'https://www.duellinksmeta.com/data-hashed/' + obtained;
			const exclusiveResURL = 'https://www.duellinksmeta.com/data-hashed/' + exclusive;
			const skillsResURL = 'https://www.duellinksmeta.com/data-hashed/' + skills;


			const forbidRes = await fetch(forbidResURL);
			const forbidjson = await forbidRes.json();

			const obtainedRes = await fetch(obtainedResURL);
			const obtainedjson = await obtainedRes.json();

			const exclusiveRes = await fetch(exclusiveResURL);
			const exclusivejson = await exclusiveRes.json();

			const skillsRes = await fetch(skillsResURL);
			const skillsjson = await skillsRes.json();
			

			// save to files
			const forbidjsonStr = JSON.stringify(forbidjson);
			const obtainjsonStr = JSON.stringify(obtainedjson);
			const exclusivejsonStr = JSON.stringify(exclusivejson);
			const skillsjsonStr = JSON.stringify(skillsjson);

			await fs.writeFile("./db/forbiddenList.json", forbidjsonStr, 'utf8', function (err) {
				if (err) {
					console.log("An error occured during write.");
					return console.log(err);
				}
			})

			await fs.writeFile("./db/cardObtainDL.json", obtainjsonStr, 'utf8', function (err) {
				if (err) {
					console.log("An error occured during write.");
					return console.log(err);
				}
			})

			await fs.writeFile("./db/exclusiveCardsDL.json", exclusivejsonStr, 'utf8', function (err) {
				if (err) {
					console.log("An error occured during write.");
					return console.log(err);
				}
			})

			await fs.writeFile("./db/skills.json", skillsjsonStr, 'utf8', function (err) {
				if (err) {
					console.log("An error occured during write.");
					return console.log(err);
				}
			})

			//
			// YGOPRODECK
			//

			// fetch
			const effectMonsRes = await fetch('https://db.ygoprodeck.com/api_internal/v7/cardinfo.php?&type=Effect%20Monster');
			const effectMonsjson = await effectMonsRes.json();

			const cardsRes = await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php');
			const cardsjson = await cardsRes.json();

			// write it out
			const effectMonsStr = JSON.stringify(effectMonsjson);
			const cardsStr = JSON.stringify(cardsjson);

			await fs.writeFile("./db/effectMons.json", effectMonsStr, 'utf8', function (err) {
				if (err) {
					console.log("An error occured during write.");
					return console.log(err);
				}
			})

			await fs.writeFile("./db/cardinfo.php.json", cardsStr, 'utf8', function (err) {
				if (err) {
					console.log("An error occured during write.");
					return console.log(err);
				}
			})


			//
			// YGO PEDIA
			//
			// fetch
			const tunerRes = await fetch('https://yugioh.fandom.com/wiki/Special:Ask/-5B-5BClass-201::Official-5D-5D-20-5B-5BMonster-20type::Tuner-20monster-5D-5D/-3FEnglish-20name-20(linked)%3D/-3FJapanese-20name/-3FPrimary-20type/-3FSecondary-20type/-3FAttribute%3D-5B-5BAttribute-5D-5D/-3FType%3D-5B-5BType-5D-5D/-3FStars-20string%3D-5B-5BLevel-5D-5D-2F-20-5B-5BRank-5D-5D/-3FATK-20string%3D-5B-5BATK-5D-5D/-3FDEF-20string%3D-5B-5BDEF-5D-5D/mainlabel%3D-2D/limit%3D500/prettyprint%3Dtrue/format%3Djson');
			const tunerJson = await tunerRes.json();

			const nonEffectRes = await fetch('https://yugioh.fandom.com/wiki/Special:Ask/-5B-5BClass-201::Official-5D-5D-20-5B-5BCard-20type::Monster-20Card-5D-5D-20-5B-5BMisc::Non-2DEffect-20Monster-5D-5D/-3FEnglish-20name-20(linked)%3D/-3FJapanese-20name/-3FPrimary-20type/-3FSecondary-20type/-3FAttribute%3D-5B-5BAttribute-5D-5D/-3FType%3D-5B-5BType-5D-5D/-3FStars-20string%3D-5B-5BLevel-5D-5D-2F-20-5B-5BRank-5D-5D/-3FATK-20string%3D-5B-5BATK-5D-5D/-3FDEF-20string%3D-5B-5BDEF-5D-5D/mainlabel%3D-2D/limit%3D500/prettyprint%3Dtrue/format%3Djson');
			const nonEffectJson = await nonEffectRes.json();

			// stringify
			const tunerStr = JSON.stringify(tunerJson);
			const nonEffectStr = JSON.stringify(nonEffectJson);

			await fs.writeFile("./db/tunerMons.json", tunerStr, 'utf8', function (err) {
				if (err) {
					console.log("An error occured during write.");
					return console.log(err);
				}
			})

			await fs.writeFile("./db/nonEffectMon.json", nonEffectStr, 'utf8', function (err) {
				if (err) {
					console.log("An error occured during write.");
					return console.log(err);
				}
			})




			message.channel.send("Database update finished!");



		} catch (err) {
			return console.log(err);
		}


	}
};