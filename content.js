var paragraphs = document.querySelectorAll('p');

var regex = /\b[A-Z]{2,}\b/g;

//Because sometimes definitions include spurious words
function extractAcronymFromDefinition(acronym, definition){
	var regex = '\\b';
	for (var i=0; i<acronym.length; i++){
		regex += acronym[i] + '\\w*';
		if (i < acronym.length-1){
			regex += ' ';
		}
	}
	regex = new RegExp(regex, 'ig');
	var match = definition.match(regex);
	if (!match){return definition;}			// If it didn't work, just return the whole thing.
	return match[0];
}

function findAcronymDefinition(acronym, callback){
	var req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if (req.readyState!=4 || req.status!=200){return;}		//Mitigate duplicate request bug
		var result = JSON.parse(req.responseText);
		if (result.result_type != 'exact'){
			callback(false);
		} else {
			callback(result.list[0].definition)
		}
	}
	req.open('GET', 'http://api.urbandictionary.com/v0/define?term=' + acronym, true);
	req.send(null);
}

function innerLoop(p, acronym){
	findAcronymDefinition(acronym, function(definition){
		if (definition){
			definition = extractAcronymFromDefinition(acronym, definition);
			p.textContent = p.textContent.replace(
				new RegExp(acronym, 'g'),
				acronym + ' ('+definition+')'
			);
		}
	});
}

for (var i=0; i<paragraphs.length; i++){
	var p = paragraphs[i];
	var acronyms = p.textContent.match(regex);
	if (!acronyms){continue;}
	for (var j=0; j<acronyms.length; j++){
		var acronym = acronyms[j];
		innerLoop(p, acronym);
	}
}
