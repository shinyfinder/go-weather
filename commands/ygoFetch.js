const jsdom = require("jsdom");
const { JSDOM } = jsdom;

module.exports = {
	name: "ygoFetch",
	description: 'Pulls random image of a kitten posted to r/kittens',
	aliases: ['ygof'],
	
	execute: async (message) => {
		const output = await fetch('https://yugioh.fandom.com/wiki/Active_Guard_(anime)')
		.then(function(response) {
        // When the page is loaded convert it to text
        return response.text()
    })
		.then(function(html) {
        // Initialize the DOM parser
        const  dom  = new JSDOM(html);
        
		console.log(dom.window.document.querySelector(".lorebox-lore").textContent); // "Hello world"


        //var docTest = dom.window.document.getElementsByClassName('lorebox-lore').innerHTML;

        //console.log(docTest);
    })
		.catch(function(err) {  
			console.log('Failed to fetch page: ', err);  
		});

		console.log("this is a test");
	}
};