var tags = ['p', 'a'];			//Elements that will be affected

var nodes = [];
for (var i=0; i<tags.length; i++){
	var queryNodes = document.querySelectorAll(tags[i]);
	for (var j=0; j<queryNodes.length; j++){
		nodes.push(queryNodes[j]);
	}
}

var regex = /\b[A-Z]{2,}\b/g;

function stripDuplicates(array){
	var out = [];
	for (var i=0; i<array.length; i++){
		if (out.indexOf(array[i]) === -1){
			out.push(array[i]);
		}
	}
	return out;
}

//Because sometimes definitions include spurious words
function extractAcronymFromDefinition(acronym, definition){
	var regex = '\\b';
	for (var i=0; i<acronym.length; i++){
		regex += acronym[i] + '\\w*';
		if (i < acronym.length-1){
			regex += ' ';
		}
	}
	//IANAL
	//\bI\w* A\w* N\w* A\w* L\w*
	//Used by some to mean "I am not a lawyer"
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
		if (result.result_type == 'exact'){
			callback(result.list[0].definition);
		} else {
			callback('Debug: No result found');
		}
	};
	req.open('GET', 'https://api.urbandictionary.com/v0/define?term=' + acronym, true);
	req.send(null);
}

function innerLoop(p, acronym){
	findAcronymDefinition(acronym, function(definition){
		definition = extractAcronymFromDefinition(acronym, definition);
		p.textContent = p.textContent.replace(
			new RegExp(acronym, 'g'),
			acronym + ' {'+definition+'}'
		);
	});
}

for (var i=0; i<nodes.length; i++){
	var p = nodes[i];
	var acronyms = stripDuplicates(p.textContent.match(regex) || []);
	for (var j=0; j<acronyms.length; j++){
		var acronym = acronyms[j];
		innerLoop(p, acronym);
	}
}
