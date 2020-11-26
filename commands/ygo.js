// load in the card database from YGOPRO decks
const cardInfo = require("../db/cardinfo.php.json"); // https://db.ygoprodeck.com/api/v7/cardinfo.php
const forbidden = require("../db/forbiddenList.json"); // https://www.duellinksmeta.com/data-hashed/forbiddenList-b9b70c8bbe.json
const effect = require("../db/effectMons.json"); // https://db.ygoprodeck.com/api_internal/v7/cardinfo.php?&type=Effect%20Monster
const nonEffect = require("../db/nonEffectMon.json"); // https://yugioh.fandom.com/wiki/Non-Effect_Monster
const tuner = require("../db/tunerMons.json"); // https://yugioh.fandom.com/wiki/Special:Ask?offset=50&limit=500&q=%5B%5BClass+1%3A%3AOfficial%5D%5D+%5B%5BMonster+type%3A%3ATuner+monster%5D%5D&p=mainlabel%3D-20-2D%2Fformat%3Dtable%2Fheaders%3D-20plain%2Fsearchlabel%3D-20...-20further-20results-20%28351-20more%29%2Fclass%3D-20sortable-20wikitable-20smwtable-20card-2Dlist&po=%3FEnglish+name+%28linked%29%3D%0A%3FJapanese+name%0A%3FPrimary+type%0A%3FSecondary+type%0A%3FAttribute%3D%5B%5BAttribute%5D%5D%0A%3FType%3D%5B%5BType%5D%5D%0A%3FStars+string%3D%5B%5BLevel%5D%5D%2F+%5B%5BRank%5D%5D%0A%3FATK+string%3D%5B%5BATK%5D%5D%0A%3FDEF+string%3D%5B%5BDEF%5D%5D%0A
const obtainDL = require("../db/cardObtainDL.json"); // https://www.duellinksmeta.com/data-hashed/cardObtain-83b8ff3c5b.json
const exclusiveDL = require("../db/exclusiveCardsDL.json"); // https://www.duellinksmeta.com/data-hashed/exclusiveCards-7060b5a2b3.json



// actual execution
module.exports = {
	name: "ygo",
	description: 'Returns the description of any given card in the Yu-Gi-Oh TCG/OCG and/or Duel Links. A F/L of 0 is "forbidden". At this time, anime-only cards are not supported.',
	args: true,
	usage: '`card name`',
	
	execute (message, args) {

		// convert args to lower case
		var argsLower = [];
		for (var i = 0; i < args.length; i++) {
			argsLower.push(args[i].toLowerCase());
		}

		args = argsLower;
		argCard = args.join(' ');
       

		// extract the names from the cards for comparions
		var cardNamesAll = cardInfo.data.map(names => names.name.toLowerCase());
        var DLExclusiveNames = exclusiveDL.map(names => names.name.toLowerCase());
        var DLObtainNames = obtainDL.map(names => names.name.toLowerCase());
        

        var cardNames = cardNamesAll.concat(DLExclusiveNames);
        


		// Levenshtein distance algo
		var levDist = function(s, t) {
   			var d = []; //2d matrix

    		// Step 1
    		var n = s.length;
    		var m = t.length;

    		if (n == 0) return m;
    		if (m == 0) return n;

    		//Create an array of arrays in javascript (a descending loop is quicker)
    		for (var i = n; i >= 0; i--) d[i] = [];

    		// Step 2
    	for (var i = n; i >= 0; i--) d[i][0] = i;
    		for (var j = m; j >= 0; j--) d[0][j] = j;

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

// check for exact matches
for (var i = 0; i < cardNames.length; i++) {
	matchNum = 0;

			// check for exact match, then return
			if (argCard === cardNames[i]) {
                // get FL number
				//var flNum = flHandler(cardInfo.data[i].name,forbidden);
                var flNum = flHandler(cardNames[i],forbidden);
                
                // check if card is exclusive to DL
                DLExcl = dlHandler(cardNames[i],DLExclusiveNames); // returns 1 if exclusive

                // check if card is in DL
                isInDL = dlHandler(cardNames[i],DLObtainNames);

                // find in the DL obtainable list
                if (isInDL) {
                    var DLObtainIndex = dlObtainFinder(cardNames[i],DLObtainNames);
                }

                
                if (DLExcl == 0) {
                    discEmbed(i,cardInfo,flNum,DLExcl,obtainDL,isInDL,DLObtainIndex);    
                } else {
                    //discEmbed(DLExclusiveNames.indexOf(cardNames[i]),exclusiveDL,flNum,DLExcl);
                    discEmbed(i % cardInfo.data.length,exclusiveDL,flNum,DLExcl,obtainDL,isInDL,DLObtainIndex);
                }

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
                
                DLExcl = dlHandler(cardNames[outputIndex[i]],DLExclusiveNames); // returns 1 if exclusive

                if (DLExcl == 0) {
                    outMess[i] = "> " + cardInfo.data[outputIndex[i]].name;
                } else {
                    outMess[i] = "> " + exclusiveDL[outputIndex[i] % cardInfo.data.length].name;
                }

                }


            message.channel.send(outMess);
            return

        } else if (outputIndex.length == 1) {
			//var flNum = flHandler(cardInfo.data[outputIndex].name,forbidden);
            var flNum = flHandler(cardNames[outputIndex],forbidden);
            DLExcl = dlHandler(cardNames[outputIndex],DLExclusiveNames); // returns 1 if exclusive
            // check if card is in DL
            isInDL = dlHandler(cardNames[outputIndex],DLObtainNames);

            // find in the DL obtainable list
            if (isInDL) {
                var DLObtainIndex = dlObtainFinder(cardNames[outputIndex],DLObtainNames);
            }
            
            if (DLExcl == 0) {
                discEmbed(outputIndex,cardInfo,flNum,DLExcl,obtainDL,isInDL,DLObtainIndex);    
            } else {
                discEmbed(outputIndex % cardInfo.data.length,exclusiveDL,flNum,DLExcl,obtainDL,isInDL,DLObtainIndex);
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
                            DLExcl = dlHandler(cardNames[lowestIndices[i]],DLExclusiveNames); // returns 1 if exclusive

                            if (DLExcl == 0) {
                             outMess[i] = "> " + cardInfo.data[lowestIndices[i]].name;
                         } else {
                            outMess[i] = "> " + exclusiveDL[lowestIndices[i] % cardInfo.data.length].name;
                        }
                    }

                    message.channel.send(outMess);
                    return

                } else if (lowestIndices.length == 1) {

						//var flNum = flHandler(cardInfo.data[lowestIndices].name,forbidden);
                        var flNum = flHandler(cardNames[lowestIndices],forbidden);
                        DLExcl = dlHandler(cardNames[lowestIndices],DLExclusiveNames); // returns 1 if exclusive
                        // check if card is in DL
                        isInDL = dlHandler(cardNames[lowestIndices],DLObtainNames);

                        // find in the DL obtainable list
                        if (isInDL) {
                            var DLObtainIndex = dlObtainFinder(cardNames[lowestIndices],DLObtainNames);
                        }


                        if (DLExcl == 0) {
                            discEmbed(lowestIndices,cardInfo,flNum,DLExcl,obtainDL,isInDL,DLObtainIndex);    
                        } else {
                            discEmbed(lowestIndices % cardInfo.data.length,exclusiveDL,flNum,DLExcl,obtainDL,isInDL,DLObtainIndex);
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
     function discEmbed(index, cards, fl, dlexcl, dlList, isInDL, dlIndex) {
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
     outField[8][0] = "**Duel Links**:\xa0";
     if (isInDL) {
        var isInDLOut = "Yes";
    } else {
        var isInDLOut = "No";
    }
    outField[8][1] = isInDLOut;

     // is DL exclusive
     var isDLExcl;
    // if (isInDL) {
        if (dlexcl) {
            var isDLExcl = "No";
        } else {
            var isDLExcl = "Yes";
        }
 //   }

    outField[7][0] = "**TCG/OCG**:\xa0";
    outField[7][1] = isDLExcl;
    
    // duel links FL
    var FLOut;
     outField[9][0] = "**Duel Links F/L**:\xa0";
     if (isInDL) {
        FLOut = FL;
     }
     outField[9][1] = FLOut;

     
    // how to obtain in DL

    var obtainHow;

    if (isInDL) {
        obtainHow = dlList[dlIndex].how;
        obtainHow = obtainHow.join(", ");
    }
    


    outField[10][0] = "**Obtain in Duel Links Via**:\xa0";
    outField[10][1] = obtainHow;
    



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
     	
     	

     	const embed = new Discord.MessageEmbed()
			//.setColor(0x00A2E8)
			.setTitle(name)
			.setDescription(descr)
			//.setImage(posts[randomnumber].data.url)
			.addField('Other Info:', outResult.join(''));
			message.channel.send(embed);
		}



		// search for FL score
		function flHandler(name, list) {
			for (var i = 0; i < list.length; i++) {
				for (var j = 0; j < list[i].cards.length; j++) {
					if (list[i].cards[j].name.toLowerCase().includes(name)) {
						return i;
					}
				}
			}
		}

        // search for DL exclusive
        function dlHandler(name, list) {

            for (var i = 0; i < list.length; i++) {
                if (list[i].includes(name)) {
                    return 1;
                }
            }
            return 0;
        }

        // find index in DL obtainable file
        function dlObtainFinder (name, list) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].includes(name)) {
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