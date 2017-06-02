// popup.js
// This JS file is loaded in the popup

// Flashing error/success messages
function flash (type, message) {
	// Set up flash
	var flashMessages = document.querySelector(".flash-messages");

	// reset flash from previous run
	flashMessages.innerText = "";
	$(".flash-messages").show();
	if (flashMessages.classList.contains("error")) flashMessages.classList.remove("error");
	if (flashMessages.classList.contains("success")) flashMessages.classList.remove("success");

	flashMessages.innerText = message;
	flashMessages.classList.add(type);
	$(".flash-messages").delay(5000).fadeOut(400, function() {
		flashMessages.innerText = "";
		$(".flash-messages").show();
	});
}


// Get word list and display on popup
function getWords () {
	chrome.storage.sync.get("redactedList", function(obj) {
		$('.filtered-terms').empty();
		for (var i = 0; i < obj.redactedList.length; i++) {
			$('.filtered-terms').append('<li class="word">'+obj.redactedList[i]+'<div class="delete" data-delete-index="'+i+'">-</div></li>');
		}
	});
}
getWords();


// Save words in chrome.storage.sync
function saveWords () {
	// Get word from input
	var input = document.querySelector("#filter").value;
	console.log("The word we got was", input);

	if (!input) {
		flash("error", "Enter something here");
	}

	if (input) {

		var wordList = [];

		chrome.storage.sync.get("redactedList", function(obj) {

			if (obj.hasOwnProperty("redactedList")) {

				// we've saved words already
				wordList = obj.redactedList;
			}

			wordList.push(input);

			chrome.storage.sync.set({"redactedList":wordList}, function() {

				flash("success", "Word saved");

				$("#filter").val("");

				chrome.tabs.getSelected(null, function(tab) {
					var code = 'window.location.reload();';
					chrome.tabs.executeScript(tab.id, {code: code});
				});

				getWords();

			});
		});
	}
}
var saveButton = document.querySelector("#saver");
saveButton.addEventListener("click", saveWords);


function deleteWord(index) {

	console.log("Deleting word with index of", index);
	
	var wordList = [];
	
	chrome.storage.sync.get("redactedList", function(obj) {

		wordList = obj.redactedList;

		console.log("Before we delete", wordList);

		wordList.splice(index, 1);

		console.log("After we delete", wordList);

		chrome.storage.sync.set({"redactedList":wordList}, function() {
			
			flash("success", "Word deleted");

			chrome.tabs.getSelected(null, function(tab) {
				var code = 'window.location.reload();';
				chrome.tabs.executeScript(tab.id, {code: code});
			});

			getWords();

		});
	});
}

var wordList = document.querySelector(".filtered-terms");
wordList.addEventListener("click", function (e) {
	if (e.target && e.target.matches(".delete")) {
		deleteWord(e.target.dataset.deleteIndex);
	};
});