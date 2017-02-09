var paragraphs = document.querySelectorAll('p');

var regex = /\b[A-Z]{2,}\b/g;

// var acronymMap = {};
function findAcronymDefinition(acronym, callback){
	var req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if (req.readyState!=4 || req.status!=200){return;}		//Mitigate duplicate request bug
		// console.log(req.responseText);
		var result = JSON.parse(req.responseText);
		console.log(result);
		if (result.result_type != 'exact'){
			console.log('bad result');
			callback(false);
		} else {
			console.log('good result');
			// acronymMap[]
			callback(result.list[0].definition)
		}
	}
	req.open('GET', 'http://api.urbandictionary.com/v0/define?term=' + acronym, true);
	req.send(null);
}

function innerLoop(p, acronym){
	findAcronymDefinition(acronym, function(definition){
		// console.log('callbackkkk', definition);
		if (definition){
			p.textContent = p.textContent.replace(
				// new RegExp('\\b'+acronym+'\\b', 'g'),
				new RegExp(acronym, 'g'),
				acronym + ' ('+definition+')'
			);
			console.log(p);
		}
	});
}

for (var i=0; i<paragraphs.length; i++){
	var p = paragraphs[i];
	var acronyms = p.textContent.match(regex);
	if (!acronyms){continue;}
	for (var j=0; j<acronyms.length; j++) {
		var acronym = acronyms[j];
		innerLoop(p, acronym);
		// p.textContent = p.textContent.replace(new RegExp(acronym,'g'), '(???)');
		// (function(){
			// var p = p, acronym = acronym;
			// var p_inner = p, acronym_inner = acronym;
			// findAcronymDefinition(acronym, function(definition){
			// 	// console.log('callbackkkk', definition);
			// 	if (definition){
			// 		p.textContent = p.textContent.replace(
			// 			// new RegExp('\\b'+acronym+'\\b', 'g'),
			// 			new RegExp(acronym, 'g'),
			// 			acronym + ' ('+definition+')'
			// 		);
			// 		console.log(p);
			// 	}
			// });
		// }
		// )();
	}
	// }
}

// var acronyms = [];
// for (var i in paragraphs){
// 	var matches = paragraphs[i].match(regex);
// 	for (var j in matches){
// 		acronyms.push(matches[j]);
// 	}
// }

// function testreq(){
// 	console.log(i);
// 	i += 1;
// 	var req = new XMLHttpRequest();
// 	req.onreadystatechange = function() {
// 		// console.log(req.responseText);
// 		console.log(req.status);
// 	};
// 	req.open('GET', 'https://www.urbandictionary.com', true);
// 	req.send(null);
// }
// var i=0;
// testreq();
