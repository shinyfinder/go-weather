// load in the card databases
const cardInfo = require("../db/cardinfo.php.json"); // https://db.ygoprodeck.com/api/v7/cardinfo.php
const forbidden = require("../db/forbiddenList.json"); // https://www.duellinksmeta.com/data-hashed/forbiddenList-b9b70c8bbe.json
const effect = require("../db/effectMons.json"); // https://db.ygoprodeck.com/api_internal/v7/cardinfo.php?&type=Effect%20Monster
const nonEffect = require("../db/nonEffectMon.json"); // https://yugioh.fandom.com/wiki/Non-Effect_Monster
const tuner = require("../db/tunerMons.json"); // https://yugioh.fandom.com/wiki/Special:Ask?offset=50&limit=500&q=%5B%5BClass+1%3A%3AOfficial%5D%5D+%5B%5BMonster+type%3A%3ATuner+monster%5D%5D&p=mainlabel%3D-20-2D%2Fformat%3Dtable%2Fheaders%3D-20plain%2Fsearchlabel%3D-20...-20further-20results-20%28351-20more%29%2Fclass%3D-20sortable-20wikitable-20smwtable-20card-2Dlist&po=%3FEnglish+name+%28linked%29%3D%0A%3FJapanese+name%0A%3FPrimary+type%0A%3FSecondary+type%0A%3FAttribute%3D%5B%5BAttribute%5D%5D%0A%3FType%3D%5B%5BType%5D%5D%0A%3FStars+string%3D%5B%5BLevel%5D%5D%2F+%5B%5BRank%5D%5D%0A%3FATK+string%3D%5B%5BATK%5D%5D%0A%3FDEF+string%3D%5B%5BDEF%5D%5D%0A
const obtainDL = require("../db/cardObtainDL.json"); // https://www.duellinksmeta.com/data-hashed/cardObtain-83b8ff3c5b.json
const exclusiveDL = require("../db/exclusiveCardsDL.json"); // https://www.duellinksmeta.com/data-hashed/exclusiveCards-7060b5a2b3.json
const duelMons = require("../db/animeMonstersDuel.json"); // https://yugipedia.com/index.php?title=Special:Ask&limit=500&offset=0&q=%5B%5BCard+type%3A%3AMonster+Card%5D%5D+%5B%5BAppears+in%3A%3AYu-Gi-Oh%21+%28anime%29%5D%5D+%5B%5BCategory%3AAnime+cards+with+no+OCG%2FTCG+counterpart%5D%5D&p=mainlabel%3D-20-2D%2Fformat%3Dtable%2Fheaders%3D-20plain%2Fsearchlabel%3D-20...-20further-20results-20%28114-20more%29%2Fclass%3D-20sortable-20wikitable-20smwtable-20card-2Dlist&po=%3FEnglish+name+%28linked%29%0A%3FJapanese+name%0A%3FPrimary+type%0A%3FSecondary+type%0A%3FAttribute%3D%5B%5BAttribute%5D%5D%0A%3FType%3D%5B%5BType%5D%5D%0A%3FStars+string%3D%5B%5BLevel%5D%5D%2F%3Cbr+%2F%3E%5B%5BRank%5D%5D%0A%3FATK+string%3D%5B%5BATK%5D%5D%0A%3FDEF+string%3D%5B%5BDEF%5D%5D%0A&sort=+%0A%23&order=asc&eq=no#search
const duelSpells = require("../db/animeSpellDuel.json"); // https://yugipedia.com/wiki/Special:Ask/mainlabel%3D-2D/format%3Djson/headers%3D-20plain/searchlabel%3DJSON/class%3D-20sortable-20wikitable-20smwtable-20card-2Dlist/sort%3D-23/order%3Dasc/offset%3D0/limit%3D500/-5B-5BConcept:Non-2Dmonster-20cards-5D-5D-20-5B-5BAppears-20in::Yu-2DGi-2DOh!-20(anime)-5D-5D-20-5B-5BCategory:Anime-20cards-20with-20no-20OCG-2FTCG-20counterpart-5D-5D/-3FEnglish-20name-20(linked)/-3FJapanese-20name/-3FCard-20type%3D-5B-5BCard-20type-5D-5D/-3FProperty%3D-5B-5BProperty-5D-5D/prettyprint%3Dtrue/unescape%3Dtrue
const gxMons = require("../db/animeMonstersGX.json"); // https://yugipedia.com/index.php?title=Special:Ask&x=-5B-5BCard-20type%3A%3AMonster-20Card-5D-5D-20-5B-5BAppears-20in%3A%3AYu-2DGi-2DOh%21-20GX-5D-5D-20-5B-5BCategory%3AAnime-20cards-20with-20no-20OCG-2FTCG-20counterpart-5D-5D%2F-3FEnglish-20name-20%28linked%29%2F-3FJapanese-20name%2F-3FPrimary-20type%2F-3FSecondary-20type%2F-3FAttribute%3D-5B-5BAttribute-5D-5D%2F-3FType%3D-5B-5BType-5D-5D%2F-3FStars-20string%3D-5B-5BLevel-5D-5D-2F-3Cbr-20-2F-3E-5B-5BRank-5D-5D%2F-3FATK-20string%3D-5B-5BATK-5D-5D%2F-3FDEF-20string%3D-5B-5BDEF-5D-5D&mainlabel=-&format=json&headers=+plain&searchlabel=JSON&class=+sortable+wikitable+smwtable+card-list&sort=%23&order=asc&offset=0&limit=500&prettyprint=true&unescape=true
const gxSpells = require("../db/animeSpellGX.json"); // https://yugipedia.com/wiki/Special:Ask/mainlabel%3D-2D/format%3Djson/headers%3D-20plain/searchlabel%3DJSON/class%3D-20sortable-20wikitable-20smwtable-20card-2Dlist/sort%3D-23/order%3Dasc/offset%3D0/limit%3D500/-5B-5BConcept:Non-2Dmonster-20cards-5D-5D-20-5B-5BAppears-20in::Yu-2DGi-2DOh!-20GX-5D-5D-20-5B-5BCategory:Anime-20cards-20with-20no-20OCG-2FTCG-20counterpart-5D-5D/-3FEnglish-20name-20(linked)/-3FJapanese-20name/-3FCard-20type%3D-5B-5BCard-20type-5D-5D/-3FProperty%3D-5B-5BProperty-5D-5D/prettyprint%3Dtrue/unescape%3Dtrue
const fiveDMons = require("../db/animeMonsters5Ds.json"); // https://yugipedia.com/index.php?title=Special:Ask&x=-5B-5BCard-20type%3A%3AMonster-20Card-5D-5D-20-5B-5BAppears-20in%3A%3AYu-2DGi-2DOh%21-205D%27s-5D-5D-20-5B-5BCategory%3AAnime-20cards-20with-20no-20OCG-2FTCG-20counterpart-5D-5D%2F-3FEnglish-20name-20%28linked%29%2F-3FJapanese-20name%2F-3FPrimary-20type%2F-3FSecondary-20type%2F-3FAttribute%3D-5B-5BAttribute-5D-5D%2F-3FType%3D-5B-5BType-5D-5D%2F-3FStars-20string%3D-5B-5BLevel-5D-5D-2F-3Cbr-20-2F-3E-5B-5BRank-5D-5D%2F-3FATK-20string%3D-5B-5BATK-5D-5D%2F-3FDEF-20string%3D-5B-5BDEF-5D-5D&mainlabel=-&format=json&headers=+plain&searchlabel=JSON&class=+sortable+wikitable+smwtable+card-list&sort=%23&order=asc&offset=0&limit=500&prettyprint=true&unescape=true
const fiveDSpells = require("../db/animeSpells5D.json"); // https://yugipedia.com/wiki/Special:Ask/mainlabel%3D-2D/format%3Djson/headers%3D-20plain/searchlabel%3DJSON/class%3D-20sortable-20wikitable-20smwtable-20card-2Dlist/sort%3D-23/order%3Dasc/offset%3D0/limit%3D500/-5B-5BConcept:Non-2Dmonster-20cards-5D-5D-20-5B-5BAppears-20in::Yu-2DGi-2DOh!-205D%27s-5D-5D-20-5B-5BCategory:Anime-20cards-20with-20no-20OCG-2FTCG-20counterpart-5D-5D/-3FEnglish-20name-20(linked)/-3FJapanese-20name/-3FCard-20type%3D-5B-5BCard-20type-5D-5D/-3FProperty%3D-5B-5BProperty-5D-5D/prettyprint%3Dtrue/unescape%3Dtrue
const zexalMons = require("../db/animeMonstersZexal.json"); // https://yugipedia.com/index.php?title=Special:Ask&x=-5B-5BCard-20type%3A%3AMonster-20Card-5D-5D-20-5B-5BAppears-20in%3A%3AYu-2DGi-2DOh%21-20ZEXAL-5D-5D-20-5B-5BCategory%3AAnime-20cards-20with-20no-20OCG-2FTCG-20counterpart-5D-5D%2F-3FEnglish-20name-20%28linked%29%2F-3FJapanese-20name%2F-3FPrimary-20type%2F-3FSecondary-20type%2F-3FAttribute%3D-5B-5BAttribute-5D-5D%2F-3FType%3D-5B-5BType-5D-5D%2F-3FStars-20string%3D-5B-5BLevel-5D-5D-2F-3Cbr-20-2F-3E-5B-5BRank-5D-5D%2F-3FATK-20string%3D-5B-5BATK-5D-5D%2F-3FDEF-20string%3D-5B-5BDEF-5D-5D&mainlabel=-&format=json&headers=+plain&searchlabel=JSON&class=+sortable+wikitable+smwtable+card-list&sort=%23&order=asc&offset=0&limit=500&prettyprint=true&unescape=true
const zexalSpells = require("../db/animeSpellZexal.json"); // https://yugipedia.com/wiki/Special:Ask/mainlabel%3D-2D/format%3Djson/headers%3D-20plain/searchlabel%3DJSON/class%3D-20sortable-20wikitable-20smwtable-20card-2Dlist/sort%3D-23/order%3Dasc/offset%3D0/limit%3D500/-5B-5BConcept:Non-2Dmonster-20cards-5D-5D-20-5B-5BAppears-20in::Yu-2DGi-2DOh!-20ZEXAL-5D-5D-20-5B-5BCategory:Anime-20cards-20with-20no-20OCG-2FTCG-20counterpart-5D-5D/-3FEnglish-20name-20(linked)/-3FJapanese-20name/-3FCard-20type%3D-5B-5BCard-20type-5D-5D/-3FProperty%3D-5B-5BProperty-5D-5D/prettyprint%3Dtrue/unescape%3Dtrue
const arcvMons = require("../db/animeMonstersArcv.json"); // https://yugipedia.com/index.php?title=Special:Ask&x=-5B-5BCard-20type%3A%3AMonster-20Card-5D-5D-20-5B-5BAppears-20in%3A%3AYu-2DGi-2DOh%21-20ARC-2DV-5D-5D-20-5B-5BCategory%3AAnime-20cards-20with-20no-20OCG-2FTCG-20counterpart-5D-5D%2F-3FEnglish-20name-20%28linked%29%2F-3FJapanese-20name%2F-3FPrimary-20type%2F-3FSecondary-20type%2F-3FAttribute%3D-5B-5BAttribute-5D-5D%2F-3FType%3D-5B-5BType-5D-5D%2F-3FStars-20string%3D-5B-5BLevel-5D-5D-2F-3Cbr-20-2F-3E-5B-5BRank-5D-5D%2F-3FATK-20string%3D-5B-5BATK-5D-5D%2F-3FDEF-20string%3D-5B-5BDEF-5D-5D&mainlabel=-&format=json&headers=+plain&searchlabel=JSON&class=+sortable+wikitable+smwtable+card-list&sort=%23&order=asc&offset=0&limit=500&prettyprint=true&unescape=true
const arcvSpells = require("../db/animeSpellArcv.json"); // https://yugipedia.com/wiki/Special:Ask/mainlabel%3D-2D/format%3Djson/headers%3D-20plain/searchlabel%3DJSON/class%3D-20sortable-20wikitable-20smwtable-20card-2Dlist/sort%3D-23/order%3Dasc/offset%3D0/limit%3D500/-5B-5BConcept:Non-2Dmonster-20cards-5D-5D-20-5B-5BAppears-20in::Yu-2DGi-2DOh!-20ARC-2DV-5D-5D-20-5B-5BCategory:Anime-20cards-20with-20no-20OCG-2FTCG-20counterpart-5D-5D/-3FEnglish-20name-20(linked)/-3FJapanese-20name/-3FCard-20type%3D-5B-5BCard-20type-5D-5D/-3FProperty%3D-5B-5BProperty-5D-5D/prettyprint%3Dtrue/unescape%3Dtrue
const vrainMons = require("../db/animeMonstersVrain.json"); // https://yugipedia.com/index.php?title=Special:Ask&x=-5B-5BCard-20type%3A%3AMonster-20Card-5D-5D-20-5B-5BAppears-20in%3A%3AYu-2DGi-2DOh%21-20VRAINS-5D-5D-20-5B-5BCategory%3AAnime-20cards-20with-20no-20OCG-2FTCG-20counterpart-5D-5D%2F-3FEnglish-20name-20%28linked%29%2F-3FJapanese-20name%2F-3FPrimary-20type%2F-3FSecondary-20type%2F-3FAttribute%3D-5B-5BAttribute-5D-5D%2F-3FType%3D-5B-5BType-5D-5D%2F-3FStars-20string%3D-5B-5BLevel-5D-5D-2F-3Cbr-20-2F-3E-5B-5BRank-5D-5D%2F-3FATK-20string%3D-5B-5BATK-5D-5D%2F-3FDEF-20string%3D-5B-5BDEF-5D-5D&mainlabel=-&format=json&headers=+plain&searchlabel=JSON&class=+sortable+wikitable+smwtable+card-list&sort=%23&order=asc&offset=0&limit=500&prettyprint=true&unescape=true
const vrainSpells = require("../db/animeSpellVrain.json"); // https://yugipedia.com/wiki/Special:Ask/mainlabel%3D-2D/format%3Djson/headers%3D-20plain/searchlabel%3DJSON/class%3D-20sortable-20wikitable-20smwtable-20card-2Dlist/sort%3D-23/order%3Dasc/offset%3D0/limit%3D500/-5B-5BConcept:Non-2Dmonster-20cards-5D-5D-20-5B-5BAppears-20in::Yu-2DGi-2DOh!-20VRAINS-5D-5D-20-5B-5BCategory:Anime-20cards-20with-20no-20OCG-2FTCG-20counterpart-5D-5D/-3FEnglish-20name-20(linked)/-3FJapanese-20name/-3FCard-20type%3D-5B-5BCard-20type-5D-5D/-3FProperty%3D-5B-5BProperty-5D-5D/prettyprint%3Dtrue/unescape%3Dtrue
const pyramidMons = require("../db/animeMonstersPyramid.json");
const pyramidSpells = require("../db/animeSpellPyramid.json");
const bondsSpells = require("../db/animeSpellBonds.json");
const dimsMons = require("../db/animeMonstersDims.json");
const dimsSpells = require("../db/animeSpellDims.json");
const ocgMons = require("../db/ocgMon.json"); // https://yugioh.fandom.com/wiki/Special:Ask/-5B-5BCard-20type::Monster-20Card-5D-5D-20-5B-5BMedium::OCG-2Donly-5D-5D-20-5B-5BDatabase-20ID::%2B-5D-5D/-3FEnglish-20name-20(linked)%3D/-3FJapanese-20name/-3FPrimary-20type/-3FSecondary-20type/-3FAttribute%3D-5B-5BAttribute-5D-5D/-3FType%3D-5B-5BType-5D-5D/-3FStars-20string%3D-5B-5BLevel-5D-5D-2F-20-5B-5BRank-5D-5D/-3FATK-20string%3D-5B-5BATK-5D-5D/-3FDEF-20string%3D-5B-5BDEF-5D-5D/mainlabel%3D-2D/limit%3D500/prettyprint%3Dtrue/format%3Djson
const ocgSpells = require("../db/ocgSpells.json"); // https://yugioh.fandom.com/wiki/Special:Ask/-5B-5BConcept:Non-2Dmonster-20cards-5D-5D-20-5B-5BMedium::OCG-2Donly-5D-5D-20-5B-5BDatabase-20ID::%2B-5D-5D/-3FEnglish-20name-20(linked)%3D/-3FJapanese-20name/-3FCard-20type%3D-5B-5BCard-20type-5D-5D/-3FProperty%3D-5B-5BProperty-5D-5D/mainlabel%3D-2D/limit%3D500/prettyprint%3Dtrue/format%3Djson
const tcgMons = require("../db/tcgMon.json");
const tcgSpells = require("../db/tcgSpells.json");
const skills = require("../db/skills.json"); // https://www.duellinksmeta.com/data-hashed/skills-1c67f92129.json




const jsdom = require("jsdom");
const { JSDOM } = jsdom;



// actual execution
module.exports = {
	name: "ygobeta",
	description: 'Returns the description of any given card in the Yu-Gi-Oh TCG/OCG and/or Duel Links. A F/L of 0 is "forbidden".\nTo include searching of anime cards (experimental mode), include the -a flag. Anime cards typically include `(anime)` in their title. *This input is optional*.',
	args: true,
	usage: '-a/-s card name',
    aliases: ['ygob'],

    execute: async (message, args) => {
        if (message.author.id !== "212315209740713984") {
            message.channel.send("You do not have permissions to use this command!");
            return
        }
		// convert args to lower case
		var argsLower = [];
		for (var i = 0; i < args.length; i++) {
			argsLower.push(args[i].toLowerCase());
		}

		args = argsLower;
        var animeFlag = 0;
        var skillFlag = 0;

        if (args[0] == "-a") {
            args.splice(0,1); // remove anime flag from input
            animeFlag = 1;
        } else if (args[0] == "-s") {
            args.splice(0,1);
            skillFlag = 1;
        }
        argCard = args.join(' ');
        



		// extract the names from the cards for comparions
		var cardNamesAll = cardInfo.data.map(names => names.name.toLowerCase());
        var DLExclusiveNames = exclusiveDL.map(names => names.name.toLowerCase());
        var DLObtainNames = obtainDL.map(names => names.name.toLowerCase());
        var duelMonNames = Object.keys(duelMons.results);
        var duelSpellNames = Object.keys(duelSpells.results);
        var gxMonNames = Object.keys(gxMons.results);
        var gxSpellNames = Object.keys(gxSpells.results);
        var fiveDMonNames = Object.keys(fiveDMons.results);
        var fiveDSpellNames = Object.keys(fiveDSpells.results);
        var zexalMonsNames = Object.keys(zexalMons.results);
        var zexalSpellNames = Object.keys(zexalSpells.results);
        var arcvMonNames = Object.keys(arcvMons.results);
        var arcvSpellNames = Object.keys(arcvSpells.results);
        var vrainMonNames = Object.keys(vrainMons.results);
        var vrainSpellNames = Object.keys(vrainSpells.results);
        var pyramidMonNames = Object.keys(pyramidMons.results);
        var pyramidSpellNames = Object.keys(pyramidSpells.results);
        var bondsSpellNames = Object.keys(bondsSpells.results);
        var dimsMonNames = Object.keys(dimsMons.results);
        var dimsSpellNames = Object.keys(dimsSpells.results);
        var ocgMonNames = Object.keys(ocgMons.results);
        var ocgSpellNames = Object.keys(ocgSpells.results);
        var tcgMonNames = Object.keys(tcgMons.results);
        var tcgSpellNames = Object.keys(tcgSpells.results);
        var skillNames = skills.map(names => names.name.toLowerCase());




        var duelMonNamesLower = duelMonNames.map(e => e.toLowerCase());
        var duelSpellNamesLower = duelSpellNames.map(e => e.toLowerCase());
        var gxMonNamesLower = gxMonNames.map(e => e.toLowerCase());
        var gxSpellNamesLower = gxSpellNames.map(e => e.toLowerCase());
        var fiveDMonNamesLower = fiveDMonNames.map(e => e.toLowerCase());
        var fiveDSpellNamesLower = fiveDSpellNames.map(e => e.toLowerCase());
        var zexalMonsNamesLower = zexalMonsNames.map(e => e.toLowerCase());
        var zexalSpellNamesLower = zexalSpellNames.map(e => e.toLowerCase());
        var arcvMonNamesLower = arcvMonNames.map(e => e.toLowerCase());
        var arcvSpellNamesLower = arcvSpellNames.map(e => e.toLowerCase());
        var vrainMonNamesLower = vrainMonNames.map(e => e.toLowerCase());
        var vrainSpellNamesLower = vrainSpellNames.map(e => e.toLowerCase());
        var pyramidMonNamesLower = pyramidMonNames.map(e => e.toLowerCase());
        var pyramidSpellNamesLower = pyramidSpellNames.map(e => e.toLowerCase());
        var bondsSpellsNamesLower = bondsSpellNames.map(e => e.toLowerCase());
        var dimsMonNamesLower = dimsMonNames.map(e => e.toLowerCase());
        var dimsSpellNamesLower = dimsSpellNames.map(e => e.toLowerCase());
        var ocgMonNamesLower = ocgMonNames.map(e => e.toLowerCase());
        var ocgSpellNamesLower = ocgSpellNames.map(e => e.toLowerCase());
        var tcgMonNamesLower = tcgMonNames.map(e => e.toLowerCase());
        var tcgSpellNamesLower = tcgSpellNames.map(e => e.toLowerCase());
        
        
        var animeNames = duelMonNames.concat(duelSpellNames,gxMonNames,gxSpellNames, fiveDMonNames,fiveDSpellNames,zexalMonsNames,zexalSpellNames,arcvMonNames,arcvSpellNames,vrainMonNames,vrainSpellNames,pyramidMonNames,pyramidSpellNames,bondsSpellNames,dimsMonNames,dimsSpellNames);
        var animeNamesLower = duelMonNamesLower.concat(duelSpellNamesLower,gxMonNamesLower,gxSpellNamesLower,fiveDMonNamesLower,fiveDSpellNamesLower, zexalMonsNamesLower,zexalSpellNamesLower,arcvMonNamesLower,arcvSpellNamesLower,vrainMonNamesLower,vrainSpellNamesLower,pyramidMonNamesLower,pyramidSpellNamesLower,bondsSpellsNamesLower,dimsMonNamesLower,dimsSpellNamesLower);


        var ocgNames = ocgMonNames.concat(ocgSpellNames);
        var ocgNamesLower = ocgMonNamesLower.concat(ocgSpellNamesLower);

        var tcgNames = tcgMonNames.concat(tcgSpellNames);
        var tcgNamesLower = tcgMonNamesLower.concat(tcgSpellNamesLower);





        /*
        // remove the stuff in () from the names
        lowerAnimeSplit = animeNamesLower.map(e => e.split(" "));
        for (var i=0; i < lowerAnimeSplit.length; i++) {
            for (var j=0; j < lowerAnimeSplit[i].length; j++) {
                if (lowerAnimeSplit[i][j].includes('(')) {
                    lowerAnimeSplit[i] = lowerAnimeSplit[i].slice(0,j);
                }
            }
            lowerAnimeSplit[i] = lowerAnimeSplit[i].join(" ");
        }

        animeNamesLower = lowerAnimeSplit;*/



        // tack on the exclusive names to the cardNames list
        if (animeFlag) {
            var cardNames = cardNamesAll.concat(DLExclusiveNames,animeNamesLower);
        } else if (skillFlag) {
            var cardNames = skillNames;
        } else {
            var cardNames = cardNamesAll.concat(DLExclusiveNames);
        }


		// Levenshtein distance algo
		var levDist = function(s, t) {
   			var d = []; //2d matrix

    		// Step 1
    		var n = s.length;
    		var m = t.length;

    		if (n == 0) {
                return m;
            }
            if (m == 0) {
                return n;
            }

    		//Create an array of arrays in javascript (a descending loop is quicker)
    		for (var i = n; i >= 0; i--) {
                d[i] = [];
            }

    		// Step 2
           for (var i = n; i >= 0; i--) {
            d[i][0] = i;
        }
        for (var j = m; j >= 0; j--) {
            d[0][j] = j;
        }

    		// Step 3
           for (var i = 1; i <= n; i++) {
              var s_i = s.charAt(i - 1);

        	// Step 4
        	for (var j = 1; j <= m; j++) {

            //Check the jagged ld total so far
            if (i == j && d[i][j] > 4) return n;

            var t_j = t.charAt(j - 1);
            var cost = (s_i == t_j) ? 0 : 1; // Step 5

            //Calculate the minimum
            var mi = d[i - 1][j] + 1;
            var b = d[i][j - 1] + 1;
            var c = d[i - 1][j - 1] + cost;

            if (b < mi) mi = b;
            if (c < mi) mi = c;

            d[i][j] = mi; // Step 6

            //Damerau transposition
            if (i > 2 && j > 2 && s_i == t.charAt(j - 2) && s.charAt(i - 2) == t_j) {
            	d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
            }
        }
    }

    // Step 7
    return d[n][m];

}



var outputIndex = [];
var cardLevDist = [];
var matchNum = 0;
var DLExcl = 0;
var isInDL = 0;
var DLObtainIndex = [];
var isOCGEx = 0;
var isTCGEx = 0;

// check for exact matches
for (var i = 0; i < cardNames.length; i++) {
	matchNum = 0;

			// check for exact match, then return
			if ((argCard === cardNames[i] && animeFlag == 0 && skillFlag == 0) || (argCard === cardNames[i] && i < cardNamesAll.length + DLExclusiveNames.length && skillFlag == 0)) {
                // get FL number
				//var flNum = flHandler(cardInfo.data[i].name,forbidden);
                var flNum = flHandler(cardNames[i],forbidden);
                
                // check if card is exclusive to DL
                DLExcl = dlHandler(cardNames[i],DLExclusiveNames); // returns 1 if exclusive

                // check if card is in DL
                isInDL = dlHandler(cardNames[i],DLObtainNames);

                // check if card is exclusive to OCG/TCG/none/or both
                // ocg
                isOCGEx = dlHandler(cardNames[i],ocgNamesLower);
                

                // tcg
                isTCGEx = dlHandler(cardNames[i],tcgNamesLower);
                


                // find in the DL obtainable list
                if (isInDL) {
                    var DLObtainIndex = dlObtainFinder(cardNames[i],DLObtainNames);
                }

                
                if (DLExcl == 0) {
                    discEmbed(i,cardInfo,flNum,DLExcl,obtainDL,isInDL,DLObtainIndex,isOCGEx,isTCGEx);    
                } else {
                    //discEmbed(DLExclusiveNames.indexOf(cardNames[i]),exclusiveDL,flNum,DLExcl);
                    discEmbed(i % cardInfo.data.length,exclusiveDL,flNum,DLExcl,obtainDL,isInDL,DLObtainIndex,isOCGEx,isTCGEx);
                }

                return


            } else if (argCard === cardNames[i] && animeFlag == 1) {
                discAnimeEmbed(animeNames[i - cardNamesAll.length - DLExclusiveNames.length]);
                return
            } else if (argCard === cardNames[i] && skillFlag == 1) {
                discSkillEmbed(i,skills);
                return
            }
        // check for contains, then return top 5 results
        else { 
           for (var j = 0; j < args.length; j++) {
            if (cardNames[i].includes(args[j])) { 
             matchNum += 1;
             if (matchNum == args.length) {
              outputIndex.push(i);
              matchNum = 0;	
          }

      }

  }



				// otherwise, compute LD and LCS
			} 
		}
		
		var outMess = [];
		var outLimit = [];
		// output matches if exact phrase found, but not perfect match
		if (outputIndex.length > 1) {
			message.channel.send(`I found ${outputIndex.length} matches!\nPlease search again with more input or check your spelling. Did you perhaps mean:`);
			// retrict max output possibilities to 5
			if (outputIndex.length > 5) {
				outLimit = 5;
			} else {
				outLimit = outputIndex.length;
			}

			for (var i = 0; i < outLimit; i++) {
                if (outputIndex[i] < cardNamesAll.length + DLExclusiveNames.length && skillFlag == 0){
                    DLExcl = dlHandler(cardNames[outputIndex[i]],DLExclusiveNames); // returns 1 if exclusive

                    if (DLExcl == 0) {
                        outMess[i] = "> " + cardInfo.data[outputIndex[i]].name;
                    } else {
                        outMess[i] = "> " + exclusiveDL[outputIndex[i] % cardInfo.data.length].name;
                    }
                } else if (skillFlag == 0) {
                    outMess[i] = "> " + animeNames[outputIndex[i]-cardNamesAll.length-DLExclusiveNames.length];
                } else {
                    outMess[i] = "> " + skills[outputIndex[i]].name;
                }

            }

            message.channel.send(outMess);
            return

        } else if (outputIndex.length == 1) {
			//var flNum = flHandler(cardInfo.data[outputIndex].name,forbidden);
            if (outputIndex < cardNamesAll.length+DLExclusiveNames.length && skillFlag == 0) {
                var flNum = flHandler(cardNames[outputIndex],forbidden);
                DLExcl = dlHandler(cardNames[outputIndex],DLExclusiveNames); // returns 1 if exclusive
                // check if card is in DL
                isInDL = dlHandler(cardNames[outputIndex],DLObtainNames);

                // check if card is exclusive to OCG/TCG/none/or both
                // ocg
                isOCGEx = dlHandler(cardNames[outputIndex],ocgNamesLower);

                // tcg
                isTCGEx = dlHandler(cardNames[outputIndex],tcgNamesLower);

                // find in the DL obtainable list
                if (isInDL) {
                    var DLObtainIndex = dlObtainFinder(cardNames[outputIndex],DLObtainNames);
                }
            
                if (DLExcl == 0) {
                    discEmbed(outputIndex,cardInfo,flNum,DLExcl,obtainDL,isInDL,DLObtainIndex,isOCGEx,isTCGEx);    
                } else {
                    discEmbed(outputIndex % cardInfo.data.length,exclusiveDL,flNum,DLExcl,obtainDL,isInDL,DLObtainIndex,isOCGEx,isTCGEx);
                }

            } else if (skillFlag == 0) {
                discAnimeEmbed(animeNames[outputIndex - cardNamesAll.length - DLExclusiveNames.length]);
            } else {
                discSkillEmbed(outputIndex,skills);
            }
			//discEmbed(outputIndex,cardInfo,flNum,DLExcl);
			return
		}

		
		var cardNamesSplit = [];
		var inclCnt = 0;
		var cardLCS = [];
		var LCSLength = [];
		var LCSScore = [];
		var inclScore = [];

			// compute LD and LCS for card array, assuming you didn't find an exact match above
			if (outputIndex === undefined || outputIndex.length == 0) {

				// find LCS length for each card and weight the results
				for (var i = 0; i < cardNames.length; i++) {
					inclCnt = 0;
					//determine if the string contains the exact sequence -- weight this the highest
					for (var j = 0; j < args.length; j++) {
						if (cardNames[i].includes(args[j])) {
							inclCnt += 1;
						}

					}
					inclScore = 1*0.2**inclCnt;

					LCSLength = LCS(argCard,cardNames[i]).length;

					if (LCSLength >= 0.9*argCard.length) {
						LCSScore = 0.2;
					} else {
						LCSScore = 1;
					}


					// compute the weighted LD
					cardLevDist.push(levDist(argCard,cardNames[i])*LCSScore*inclScore);

				}


					// find the min value of LD
					var outputLowest = cardLevDist.reduce(function(a,b){return Math.min(a,b)});

					var lowestIndices = [];
					for (var i = 0; i < cardLevDist.length; i++) {
						if (cardLevDist[i] === outputLowest) {
							lowestIndices.push(i);
						}
					}



					// output best matches of lowest indices.
					if (lowestIndices.length > 1) {
						message.channel.send(`I found ${lowestIndices.length} matches!\nPlease search again with more input or check your spelling. Did you perhaps mean:`);
						// retrict max output possibilities to 5
						if (lowestIndices.length > 5) {
							outLimit = 5;
						} else {
							outLimit = lowestIndices.length;
						}

						for (var i = 0; i < outLimit; i++) {
                            if ( lowestIndices[i] < cardNamesAll.length + DLExclusiveNames.length ) {
                            DLExcl = dlHandler(cardNames[lowestIndices[i]],DLExclusiveNames); // returns 1 if exclusive

                            if (DLExcl == 0) {
                             outMess[i] = "> " + cardInfo.data[lowestIndices[i]].name;
                         } else {
                            outMess[i] = "> " + exclusiveDL[lowestIndices[i] % cardInfo.data.length].name;
                         }
                        } else {
                            outMess[i] = "> " + animeNames[lowestIndices[i]-cardNamesAll.length-DLExclusiveNames.length];
                        }
                    }

                    message.channel.send(outMess);
                    return

                } else if (lowestIndices.length == 1) {
                    if (lowestIndices < cardNamesAll.length+DLExclusiveNames.length && skillFlag == 0) {
						//var flNum = flHandler(cardInfo.data[lowestIndices].name,forbidden);
                        var flNum = flHandler(cardNames[lowestIndices],forbidden);
                        DLExcl = dlHandler(cardNames[lowestIndices],DLExclusiveNames); // returns 1 if exclusive
                        // check if card is in DL
                        isInDL = dlHandler(cardNames[lowestIndices],DLObtainNames);

                        // check if card is exclusive to OCG/TCG/none/or both
                        // ocg
                        isOCGEx = dlHandler(cardNames[lowestIndices],ocgNamesLower);

                        // tcg
                        isTCGEx = dlHandler(cardNames[lowestIndices],tcgNamesLower);

                        // find in the DL obtainable list
                        if (isInDL) {
                            var DLObtainIndex = dlObtainFinder(cardNames[lowestIndices],DLObtainNames);
                        }


                        if (DLExcl == 0) {
                            discEmbed(lowestIndices,cardInfo,flNum,DLExcl,obtainDL,isInDL,DLObtainIndex,isOCGEx,isTCGEx);    
                        } else {
                            discEmbed(lowestIndices % cardInfo.data.length,exclusiveDL,flNum,DLExcl,obtainDL,isInDL,DLObtainIndex,isOCGEx,isTCGEx);
                        }

                    } else if (skillFlag == 0) {
                        discAnimeEmbed(animeNames[lowestIndices - cardNamesAll.length - DLExclusiveNames.length]);
                    } else {
                        discSkillEmbed(lowestIndices,skills);
                    }



						//discEmbed(lowestIndices,cardInfo,flNum,DLExcl);
						return
					}

             }








    /**
     * Algorithm from dynamic programming. It finds the longest
     * common sub-sequence of two strings. For example for strings 'abcd'
     * and 'axxcda' the longest common sub-sequence is 'acd'.
     *
     * @example
     * var subsequence = require('path-to-algorithms/src/searching/'+
     * 'longest-common-subsequence').longestCommonSubsequence;
     * console.log(subsequence('abcd', 'axxcda'); // 'acd'
     *
     * @public
     * @module searching/longest-common-subsequence
     * @param {String} first input string.
     * @param {String} second input string.
     * @return {Array} Longest common subsequence.
     */

     function LCS(str1, str2) {
     	var lcsLengthsMatrix = getLcsLengths(str1, str2);
     	return getLcs(str1, str2, lcsLengthsMatrix);
     };

    /**
     * Find the lengths of longest common sub-sequences
     * of two strings and their substrings.
     *
     * Complexity: O(MN).
     *
     * @private
     * @param {String} first string
     * @param {String} second string
     * @return {Array} two dimensional array with LCS
     * lengths of input strings and their substrings.
     *
     */

     function getLcsLengths(str1, str2) {
     	var result = [];

     	for (var i = -1; i < str1.length; i = i + 1) {
     		result[i] = [];

     		for (var j = -1; j < str2.length; j = j + 1) {
     			if (i === -1 || j === -1) {
     				result[i][j] = 0;

     			} else if (str1[i] === str2[j]) {
     				result[i][j] = result[i - 1][j - 1] + 1;

     			} else {
     				result[i][j] = Math.max(result[i - 1][j], result[i][j - 1]);
     			}
     		}
     	}
     	return result;
     }

    /**
     * Find longest common sub-sequences of two strings.
     *
     * Complexity: O(M + N).
     *
     * @private
     * @param {String} first string
     * @param {String} second string
     * @return {Array} two dimensional array with LCS
     * lengths of input strings and their substrings
     * returned from 'getLcsLengths' function.
     *
     */

     function getLcs(str1, str2, lcsLengthsMatrix) {
     	var execute = function (i, j) {

     		if (!lcsLengthsMatrix[i][j]) {
     			return '';

     		} else if (str1[i] === str2[j]) {
     			return execute(i - 1, j - 1) + str1[i];

     		} else if (lcsLengthsMatrix[i][j - 1] > lcsLengthsMatrix[i - 1][j]) {
     			return execute(i, j - 1);

     		} else {
     			return execute(i - 1, j);
     		}
     	};
     	return execute(str1.length - 1, str2.length - 1);
     }

     // discord embed generator
     function discEmbed(index, cards, fl, dlexcl, dlList, isInDL, dlIndex, ocg, tcg) {
        if (dlexcl == 0) {
            var name = cards.data[index].name;
            var descr = cards.data[index].desc;
            var type = cards.data[index].type.split(" "); 
            var attrib = cards.data[index].attribute;
            var rank = cards.data[index].level;
            var linkVal = cards.data[index].linkval;
            var atk = cards.data[index].atk;
            var def = cards.data[index].def;
            var FL = fl || "N/A";
            var race = cards.data[index].race;
            var linkMark = cards.data[index].linkmarkers;
            var scale = cards.data[index].scale;
        } else {
            var name = cards[index].name;
            var descr = cards[index].desc;
            var type = cards[index].type.split(" "); 
            var attrib = cards[index].attribute;
            var rank = cards[index].level;
            var linkVal = cards[index].linkval;
            var atk = cards[index].atk;
            var def = cards[index].def;
            var FL = fl || "N/A";
            var race = cards[index].race;
            var linkMark = cards[index].linkmarkers;
            var scale = cards[index].scale;
            //var dlListNames = dlList.map(names => names.name.toLowerCase());
            //var isInDL = dlHandler(name.toLowerCase(),dlListNames);
        }

     	// build other info output
     	// create matrix of outputs
     	var outField = createArray(11,2);


     	// type / race
     	// remove "monster" from type
     	var typeArr = type.slice(0,type.length-1);
        // remove "normal" from type
        if (typeArr.includes('Normal')) {
            typeArr.splice(typeArr.indexOf('Normal'),1);
        }

        // tuners
        var isTuner = 0;
        for (var i = 0; i < Object.keys(tuner.results).length; i++){
            if (Object.keys(tuner.results)[i] === name) {
                isTuner = 1;
                break
            } 
        }

        // append tuner
        if (!typeArr.includes("Tuner") && isTuner == 1) {
            typeArr.push("Tuner");
        }


        // remove effect from type to append later -- going to check effect DB cuz effect not always in the type class
        if (typeArr.includes('Effect')) {
            typeArr.splice(typeArr.indexOf('Effect'),1);
        }

        // check for card with effect in the name
        if (type.includes("Effect")) {
            typeArr.push("Effect");
        } else {
            for (var i = 0; i < effect.data.length; i++) {
                // check for card in "effect monster" db
                if (effect.data[i].name === name) {
                    typeArr.push("Effect");
                }
            }
        }

        // check if card is not in non-effect monster db
        // spell/trap/skill don't have effect text. Token and normal are never
        // gemini vary, but rn all are/can have effect anyway
        // so if non-normal monster, and not in nonEffectMon db, should say effect

        var isInNonEff = 0;
        // check if card is not in db
        for (var i = 0; i < Object.keys(nonEffect.results).length; i++){
            if (Object.keys(nonEffect.results)[i] === name) {
                isInNonEff = 1;
                break
            } 
        }

        if (type.includes("Monster") && !type.includes("Normal") && isInNonEff == 0 && !typeArr.includes("Effect")) {
            typeArr.push("Effect");
        }

     	// parse for correct order cuz the db is messed up
     	if (typeArr.includes('Fusion')) {
     		typeArr.splice(typeArr.indexOf('Fusion'),1); // remove Fusion from array
     		typeArr.splice(0,0,'Fusion'); // append fusion to the beginning
     	}

        /* append tuner to sea monster of theseus cuz the db sucks
        if (name === "Sea Monster of Theseus") {
            typeArr.push("Tuner");
        }*/


     	typeArr = typeArr.join("/"); // join into single string separated by /



     	outField[0][0] = '**Type**:\xa0';
     	// flip order for monsters
        if (typeArr) {
            if (typeArr === "Trap" || typeArr === "Spell"){
             outField[0][1] = typeArr + "/" + race;
         } else {

             outField[0][1] = race + "/" + typeArr;
         }
     } else {
        outField[0][1] = race;
    }

     	// attribute
     	outField[1][0] = "**Attribute**:\xa0";
     	outField[1][1] = attrib;

     	// check for link/rank/level output
     	if (type === "Link") { 
     		outField[2][0] = '**Link Rating**:\xa0';
     		outField[2][1] = linkVal;
     	} else if (type === 'XYZ') {
     		outField[2][0] = '**Rank**:\xa0';
     		outField[2][1] = rank;
     	} else if (type !== "Spell" && type) {
     		outField[2][0] = '**Level**:\xa0';
     		outField[2][1] = rank;
     	} 

     	// attack
     	outField[3][0] = "**ATK**:\xa0";
     	outField[3][1] = atk;
     	
     	// def
     	outField[4][0] = "**DEF**:\xa0";
     	outField[4][1] = def;

     	// linkMarker handler
     	var linkArrows = [];

     	if (linkMark) {
          for (var i = 0; i < linkMark.length; i++) {
             if (linkMark[i] === "Top") {
                linkArrows.push('<:arrow_up:749762902805839922>');
            } else if (linkMark[i] === "Bottom") {
                linkArrows.push('<:arrow_down:749763608132452523>');
            } else if (linkMark[i] === "Left") {
                linkArrows.push('<:arrow_left:749763801481478146>');
            } else if (linkMark[i] === "Right") {
                linkArrows.push('<:arrow_right:749763979592597534>');
            } else if (linkMark[i] === "Top-Left") {
                linkArrows.push('<:arrow_upper_left:749764181766438924>');
            } else if (linkMark[i] === "Top-Right") {
                linkArrows.push('<:arrow_upper_right:749764467298140249>');
            } else if (linkMark[i] === "Bottom-Left") {
                linkArrows.push('<:arrow_lower_left:749764698546634822>');
            } else if (linkMark[i] === "Bottom-Right") {
                linkArrows.push('<:arrow_lower_right:749765110137880627>');
            }
        }
    } 


    outField[5][0] = "**Link Arrow**:\xa0";
    outField[5][1] = linkArrows.join('');


     	// pendulum scale
     	outField[6][0] = "**Pendulum Scale**:\xa0";
     	if (scale) {
          var scaleL = scale;
          var scaleR = scale;
          var scaleOut = scaleL + "/" + scaleR;
          outField[6][1] = scaleOut;
      } 

     // is in duel links 
     var DLHowCombine;
     outField[8][0] = "**Duel Links**:\xa0";
     if (isInDL) {
        //var isInDLOut = "Yes";
        var DLHowCombine = "Yes:\xa0";
    } else {
        var isInDLOut = "No";
        outField[8][1] = isInDLOut;
    }
    //outField[8][1] = isInDLOut;

     // is DL exclusive
     var isDLExcl;
    // if (isInDL) {
        if (dlexcl) {
            var isDLExcl = "No";
        } else {
            var isDLExcl = "Yes";
        }
 //   }

    if (isDLExcl == "Yes") {
        if (ocg) {
            isDLExcl = "OCG";
        } else if (tcg) {
            isDLExcl = "TCG";
        } else if (!tcg && !ocg) {
            isDLExcl = "Both";
        }
    }

 outField[7][0] = "**TCG/OCG**:\xa0";
 outField[7][1] = isDLExcl;

    // duel links FL
    var FLOut;
    outField[10][0] = "**Duel Links F/L**:\xa0";
    if (isInDL) {
        FLOut = FL;
    }
    outField[10][1] = FLOut;


    // how to obtain in DL

    var obtainHow;

    if (isInDL) {
        obtainHow = dlList[dlIndex].how;
        obtainHow = obtainHow.join(", ");
        DLHowCombine += obtainHow;
    }
    


    outField[9][0] = "**Obtain in Duel Links**:\xa0";
    outField[9][1] = DLHowCombine;//obtainHow;
    



     	// populate output matrix with appropriate info
     	var outResult = [];
     	for (var i = 0; i < outField.length; i++) {
     		if (outField[i][1] || outField[i][1] === 0) {
     			outResult.push(outField[i][0] + outField[i][1] + ' | ');

     			if ((outResult.length  % 3) == 0) {
     				outResult[outResult.length-1] = outResult[outResult.length-1].slice(0,-3);
     				outResult[outResult.length-1] += '\n';
     			}
     		}
     	}
     	
     	// trim excess | on last entry
     	if (outResult.length % 3 != 0) {
     		outResult[outResult.length-1] = outResult[outResult.length-1].slice(0,-3);
     	}
        

        if (DLHowCombine) {
            outResult[outResult.length-2] = outResult[outResult.length-2].slice(0,-3);
            outResult[outResult.length-2] += '\n';   
        }
     	
     	

     	const embed = new Discord.MessageEmbed()
			//.setColor(0x00A2E8)
			.setTitle(name)
			.setDescription(descr)
			//.setImage(posts[randomnumber].data.url)
			.addField('Other Info:', outResult.join(''));
			message.channel.send(embed);
		}


        async function discAnimeEmbed(name) {
            //message.channel.send("Anime only");
            //return
            // split the name to get the site page name, then rejoin with _
            name = name.split(" ");
            name = name.join("_");

            var url = "https://yugipedia.com/wiki/" + name;

            // fetch the url
            const fetchOut = await fetch(url)
                .then(function(response) {
                    // When the page is loaded convert it to text
                    return response.text()
                })
                .then(function(html) {
                    // Initialize the DOM parser
                    const  dom  = new JSDOM(html);

                    // undo name mod
                    name = name.split("_").join(" ");
                    
                    var descr = dom.window.document.querySelector(".lorebox-lore");
                    if (descr) {
                        descr = descr.textContent;
                    } else {
                        descr = "None.";
                    }

                    var effectTypeRes = dom.window.document.querySelector("td.hlist.hcomma");
                    if (effectTypeRes) effectTypeRes = effectTypeRes.textContent.split("\n");

                    var effectType = [];

                    if (effectTypeRes) {
                    for (var i=0; i < effectTypeRes.length; i++) {
                        if (effectTypeRes[i]) {
                            effectType.push(effectTypeRes[i]);
                        }
                    }
                    }

                    var type = dom.window.document.querySelector(".hslash");
                    if (type) type = type.textContent;

                    var typeHeader = dom.window.document.querySelector(".innertable > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > p:nth-child(1) > a:nth-child(1)");
                    if (typeHeader) {
                        if (typeHeader.textContent.includes("Spell") || typeHeader.textContent.includes("Trap")) {
                            type = typeHeader.textContent;
                        }
                    }

 
                    var attribHeader = dom.window.document.querySelector(".innertable > tbody:nth-child(1) > tr:nth-child(1) > th:nth-child(1)");
                    if (attribHeader) {
                        if (attribHeader.textContent.includes('Attribute')) {
                            var attrib = dom.window.document.querySelector("tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > p:nth-child(1) > a:nth-child(2)");
                            if (attrib) attrib = attrib.textContent;   
                        } 
                    } else {
                        var attrib;
                    }
                    /*
                    var attrib = dom.window.document.querySelector("tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > p:nth-child(1) > a:nth-child(2)");
                    if (attrib) attrib = attrib.textContent;
                    */

                    var rankHeader = dom.window.document.querySelector(".innertable > tbody:nth-child(1) > tr:nth-child(2) > th:nth-child(1) > a:nth-child(1)");
                    if (rankHeader) {
                        if (rankHeader.textContent.includes("Level") || rankHeader.textContent.includes("Rank")) {
                            var rank = dom.window.document.querySelector(".innertable > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2) > p:nth-child(1) > a:nth-child(1)");
                            if (rank) rank = rank.textContent;
                        } else if (rankHeader.textContent.includes("Property")) {
                            var rank = dom.window.document.querySelector(".innertable > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2) > p:nth-child(1)");
                            if (rank) {
                                rank = rank.textContent;
                                type += "/" + rank;
                                rank = '';
                            }

                        }
                    } else {
                        var rank;
                    }
                    /*
                    var rank = dom.window.document.querySelector(".innertable > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2) > p:nth-child(1) > a:nth-child(1)");
                    if (rank) rank = rank.textContent;
                    */
                    
                    var linkHeader = dom.window.document.querySelector(".lorebox-stats > a:nth-child(3)");
                    if (linkHeader) {
                        if (linkHeader.textContent.includes("LINK")) {
                            var linkVal = dom.window.document.querySelector(".lorebox-stats > a:nth-child(4)");
                            if (linkVal) linkVal = linkVal.textContent;
                        } else {
                            var linkVal;
                        }
                    } else {
                        var linkVal;
                    }

                    /*
                    var linkVal = dom.window.document.querySelector(".lorebox-stats > a:nth-child(4)");
                    if (linkVal) linkVal = linkVal.textContent;
                    */

                    var atk = dom.window.document.querySelector(".lorebox-stats > a:nth-child(2)");
                    if (atk) atk = atk.textContent;

                    var def = dom.window.document.querySelector(".lorebox-stats > a:nth-child(4)");
                    if (def) def = def.textContent;

                    var linkMark = dom.window.document.querySelector(".innertable > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2) > div:nth-child(1) > div:nth-child(2)");
                    if (linkMark) linkMark = linkMark.textContent;

                    var scale = dom.window.document.querySelector("div.lorebox-pendulum_scale");
                    if (scale) scale = scale.textContent;

                    var pendEffect = dom.window.document.querySelector(".lorebox-lore--pendulum");
                    if (pendEffect) pendEffect = pendEffect.textContent;

                    var appear = dom.window.document.querySelector(".list-noicon");
                    if (appear) appear = appear.textContent.split("\n");

                    var appearOut = [];

                    if (appear) {
                    for (var i=0; i < appear.length; i++) {
                        if (appear[i]) {
                            appearOut.push(appear[i]);
                        }
                    }
                    }
                    
                 

                    // build output and push
                    // create matrix of outputs
                    var outField = createArray(7,2);

                    // description handler
                    if (pendEffect) {
                        descr = "**Monster Effect**:\n" + descr + "\n**Pendulum Effect**:\n" + pendEffect;
                    }

                    outField[0][0] = "**Type**:\xa0";
                    outField[0][1] = type;

                    outField[1][0] = "**Attribute**:\xa0";
                    outField[1][1] = attrib;

                    // link/rank
                    if (linkVal || rank) {
                    if (dom.window.document.querySelector(".lorebox-stats > a:nth-child(3)").textContent === "LINK") {
                        outField[2][0] = "**Link**:\xa0";
                        outField[2][1] = linkVal;
                    } else {
                        outField[2][0] = "**" + dom.window.document.querySelector(".innertable > tbody:nth-child(1) > tr:nth-child(2) > th:nth-child(1) > a:nth-child(1)").textContent + "**:\xa0";
                        outField[2][1] = rank;
                    }
                }

                    outField[3][0] = "**ATK**:\xa0";
                    outField[3][1] = atk;

                    outField[4][0] = "**DEF**:\xa0";
                    outField[4][1] = def;

                    // links dir
                    outField[5][0] = "**Link Arrow**:\xa0";
                    
                    // linkMarker handler
                    var linkArrows = [];

                    if (linkMark) {
                    for (var i = 0; i < linkMark.length; i++) {
                        if (linkMark[i] === "Top-Center") {
                            linkArrows.push('<:arrow_up:749762902805839922>');
                        } else if (linkMark[i] === "Bottom-Center") {
                            linkArrows.push('<:arrow_down:749763608132452523>');
                        } else if (linkMark[i] === "Middle-Left") {
                            linkArrows.push('<:arrow_left:749763801481478146>');
                        } else if (linkMark[i] === "Middle-Right") {
                            linkArrows.push('<:arrow_right:749763979592597534>');
                        } else if (linkMark[i] === "Top-Left") {
                            linkArrows.push('<:arrow_upper_left:749764181766438924>');
                        } else if (linkMark[i] === "Top-Right") {
                            linkArrows.push('<:arrow_upper_right:749764467298140249>');
                        } else if (linkMark[i] === "Bottom-Left") {
                            linkArrows.push('<:arrow_lower_left:749764698546634822>');
                        } else if (linkMark[i] === "Bottom-Right") {
                            linkArrows.push('<:arrow_lower_right:749765110137880627>');
                        }
                    }
                    }

                    outField[5][1] = linkArrows.join("");

                    // pendulum scale
                    outField[6][0] = "**Pendulum Scale**:\xa0";
                    if (scale) {
                        var scaleL = scale;
                        var scaleR = scale;
                        var scaleOut = scaleL + "/" + scaleR;
                        outField[6][1] = scaleOut;
                    } 

                    
                    // populate output matrix with appropriate info
                    var outResult = [];
                    for (var i = 0; i < outField.length; i++) {
                        if (outField[i][1] || outField[i][1] === 0) {
                            outResult.push(outField[i][0] + outField[i][1] + ' | ');

                            if ((outResult.length  % 3) == 0) {
                                outResult[outResult.length-1] = outResult[outResult.length-1].slice(0,-3);
                                outResult[outResult.length-1] += '\n';
                            }
                        }
                    }


                    // trim excess | on last entry
                    if (outResult.length % 3 != 0) {
                        outResult[outResult.length-1] = outResult[outResult.length-1].slice(0,-3);
                    }

                    
                    
                    if (!Array.isArray(outResult) || !outResult.length) {
                        outResult = ["Data unavailable. ", "No information provided."];
                    }

                    const embed = new Discord.MessageEmbed()
                    //.setColor(0x00A2E8)
                    .setTitle(name)
                    .setDescription(descr)
                    //.setImage(posts[randomnumber].data.url)
                    .addField('Other Info:', outResult.join(''))
                    .addField('Appearances:', appearOut, true)
                    .addField('Anime Only', "This card info is from the anime",true)
                    .setFooter(`Info provided from: ${url}`);
                    message.channel.send(embed);

                })
            .catch(function(err) {  
                console.log('Failed to fetch page: ', err);  
            });


        }
        

        function discSkillEmbed(index, names) {
            var name = names[index].name;
            var descr = names[index].description;

            var excl = names[index].exclusive;
            if (excl) {
                excl = "Yes";
            } else {
                excl = "No";
            }
            var charName = names[index].characters.map(e => e.name);
            var charHow = names[index].characters.map(e => e.how);

            var method = [];
            for (var i=0; i < charName.length; i++) {
                method.push(charName[i] + " " + charHow[i]);
            }
            
            var methodLength = Math.round(method.length / 2);
            var methodL = []; var methodR = [];

            if (methodLength > 5) {
                for (var i=0; i < methodLength; i++) {
                    methodL.push(method[i]);
                }

                methodR = method.slice(i);
            }


            const embed = new Discord.MessageEmbed()
                    //.setColor(0x00A2E8)
                    .setTitle(name)
                    .setDescription(descr + '\n\n' + "**Exclusive**: " + excl);

            if (!methodR.length) {
                embed.addField('How:', method);    
            } else {
                embed.addField("How:",methodL,true);
                embed.addField("\u200b",methodR,true);
            }
   
                    


                    message.channel.send(embed);


        }


		// search for FL score
		function flHandler(name, list) {
			for (var i = 0; i < list.length; i++) {
				for (var j = 0; j < list[i].cards.length; j++) {
					if (list[i].cards[j].name.toLowerCase() == name) {
						return i;
					}
				}
			}
		}

        // search for DL exclusive
        function dlHandler(name, list) {

            for (var i = 0; i < list.length; i++) {
                if (list[i] == name) {
                    return 1;
                }
            }
            return 0;
        }

        // find index in DL obtainable file
        function dlObtainFinder (name, list) {
            for (var i = 0; i < list.length; i++) {
                if (list[i] == name) {
                    return i;
                }
            }
        }


		// create new N-d array
		function createArray(length) {
            var arr = new Array(length || 0),
            i = length;

            if (arguments.length > 1) {
                var args = Array.prototype.slice.call(arguments, 1);
                while(i--) arr[length-1 - i] = createArray.apply(this, args);
            }

            return arr;
        }


    },

};