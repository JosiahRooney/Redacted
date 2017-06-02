// content.js
// this file is executed on every page load

var wordList = [];

function walk(node, regex) {
  var child;
  switch (node.nodeType) {
    case 1: // Element
      for (child = node.firstChild;
           child;
           child = child.nextSibling) {
        walk(child, regex);
      }
      break;

    case 3: // Text node
      node.nodeValue = node.nodeValue.replace(regex, function($0) {
        return (new Array($0.length + 1).join("█"));
      });
      break;
  }
}


// Get words from chrome.storage.sync
chrome.storage.sync.get("redactedList", function(obj) {
	if (obj.hasOwnProperty("redactedList")) {
		console.log(obj.redactedList);
		wordList = obj.redactedList;
		if (wordList.length > 0) {
			var regex = new RegExp(wordList.join("|"), "gi");
			walk(document.body, regex);
		}
	}
});
