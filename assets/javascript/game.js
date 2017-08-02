
var musicianList = ["Jimi Hendrix", "Eric Clapton", "Jackson Browne", "Gary Moore",
                    "Chet Baker", "Nina Simone"];
var originalList = ["Jimi Hendrix", "Eric Clapton", "Jackson Browne", "Gary Moore",
                    "Chet Baker", "Nina Simone"];
var currentWord;
var guessWord;
var wins = 0;
var guesses_remaining = 6;
var restart = true;

var line1 = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];
var line2 = ["j", "k", "l", "m", "n", "o", "p", "q", "r"];
var line3 = ["s", "t", "u", "v", "w", "x", "y", "z"];
var letters = [line1, line2, line3];
var guessedLetters = [];

    document.onkeyup = function(event) {

    	if(restart) {
    		currentWord = musicianList[Math.floor(Math.random() * musicianList.length)];
    		var rmInd = musicianList.indexOf(currentWord);
    		musicianList.splice(rmInd, 1);

            var wordArry = currentWord.split(" ");
            guessWord="";
            for (var i=0; i<wordArry.length; i++) {
            	for(var j=0; j<wordArry[i].length; j++) {
            	    guessWord += "_";
                }
                if(i < wordArry.length-1) {
                    guessWord += " ";
                }
            }
            guesses_remaining = 6; 
            guessedLetters = [];
            printMenu(); 
            document.getElementById("game_img").src="assets/images/hangman0.png";
            removeAudio();
            restart = false;     
    	}
    	else {
    		//if(/[a-zA-Z]/.test(event.key)) {
    		var playerLetter = event.key.toLowerCase();
            if(line1.indexOf(playerLetter) > -1 || line2.indexOf(playerLetter) > -1 || 
                line3.indexOf(playerLetter) > -1) {

    			if(guessedLetters.includes(playerLetter)) {
    				alert("You guessed " + playerLetter);
    				playerLetter = ".";
    			}
    			else {
                    guessedLetters.push(playerLetter);
                }

              if(playerLetter !== ".") {
                //change guessed letters to red
                var idNum = "l"; 
                if(line1.indexOf(playerLetter) > -1) {
                    idNum += "0" + line1.indexOf(playerLetter);
                }
                else if(line2.indexOf(playerLetter) > -1) {
                    idNum += "1" + line2.indexOf(playerLetter);
                }
                else if(line3.indexOf(playerLetter) > -1) {
                    idNum += "2" + line3.indexOf(playerLetter);
                }
                document.querySelector("#"+idNum).style.color = "red";

                //find if the guessed letter is in the current word. If yes, 
                //find its location(s) in current word
                console.log(currentWord, playerLetter);
                var indArr=[];
                var start=0;
                var guessInd=-1;                
                do { 
                    guessInd = currentWord.toLowerCase().indexOf(playerLetter, start);
                    if(guessInd > -1) {
                        indArr.push(guessInd);
                        start = guessInd+1;
                        if(start == currentWord.length) {
                        	guessInd = -1;
                        }
                    }
                } while (guessInd > -1);
                
                if(indArr.length > 0) {
                    for(var j = 0; j < indArr.length; j++) {
                        if(indArr[j] == 0 || (indArr[j] == currentWord.indexOf(" ", j-1) + 1)) {
                            //Capitalize the first letters of first/last names
                            guessWord = setCharAtIndex(guessWord, indArr[j], playerLetter.toUpperCase());
                        }
                        else {
                            guessWord = setCharAtIndex(guessWord, indArr[j], playerLetter);
                        }
                    }
                    document.getElementById("guess").innerHTML = guessWord;
                    if(guessWord.indexOf("_") === -1) {
                        wins++;
                        document.getElementById("wins").innerHTML = wins;
                        var which = originalList.indexOf(currentWord)+1;
                        document.getElementById("game_img").src="assets/images/audio_img" + which + ".jpg";
                        playAudio(which);
                        restart = true;
                    }
                }
                else {
                    guesses_remaining--;
                    var path = "assets/images/hangman" + (6-guesses_remaining) + ".png";
                    document.getElementById("game_img").src=path;
                    document.getElementById("numGuesses").innerHTML = guesses_remaining;
                    if(guesses_remaining == 0) {
                        playAudio(0);
                	    restart = true; 
                    }
                }
              }
            }
            else {
                alert("You did not guess a letter. Try again!");
            }

        }
    }

function printMenu() {
    
    var html1 =
          "<h4>WINS</h4>" +
          "<h4 id='wins'>" + wins + "</h4><br>" +
          "<h4>CURRENT WORD</h4><br>" +
          "<h4 id='guess'>" + guessWord + "</h4><br>" + 
          "<h4>NUMBER OF GUESSES REMAINING</h4>" +
          "<h4 id='numGuesses'>" + guesses_remaining + "</h4><br>" +
          "<h4>LETTERS NOT YET GUESSED</h4><br>";
    
    var html2 = "";
    for (var i = 0; i<letters.length; i++) {
        for (var j = 0; j<letters[i].length; j++) {
            var ind = "" + i + j;
            var lettTag = "<span id='l";
            lettTag = lettTag + ind + "'>" + letters[i][j] + "</span>";
            if(j == letters[i].length-1) {
                lettTag += "<br>";
            }
            html2 += lettTag;
        }
    }
    document.querySelector("#menu").innerHTML = html1;

    var x = document.createElement("P");
    x.setAttribute("id", "letters");
    document.getElementById("menu").appendChild(x);
    document.querySelector("#letters").innerHTML = html2;
}

function setCharAtIndex(str,index,chr) {
    return str.substr(0,index) + chr + str.substr(index+1);
}

function playAudio(index) {
    alert(index);
    var x = document.createElement("AUDIO");
    var audioFile = "assets/audios/audio_" + index + ".mp3";
    if (x.canPlayType("audio/mpeg")) {
        x.setAttribute("src", audioFile);
    }

    x.setAttribute("controls", "controls");
    x.setAttribute("id", "game_audio");
    document.getElementById("audio_row").appendChild(x);
    x.load();
    x.play();
}

function removeAudio() {
    var x = document.getElementById("game_audio");
    if (x) {
        x.pause();
        x.parentNode.removeChild(x);
    }
}
