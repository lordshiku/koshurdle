<script>
    	
        const grid = document.getElementById("grid");
        const gridp = document.getElementById("gridp");
        const message = document.getElementById("message");
        const keyboard = document.getElementById("keyboard");
        const letters = {}
        
        const secretWord = "APPLE"; // Change this later lol
        const wordElement = document.querySelector('.word');
        const wordElementF = document.querySelector('.wordf');
        wordElement.textContent = secretWord;
        wordElementF.textContent = secretWord;
        
        let endGame = 0;
       
		let statusOther = [];
        
        const maxAttempts = 6;
        let thatKey = 0;
        
        let attempts = 0;
        let currentGuess = "";
        
        const keyboardAccess = {}
        const allLetters = "QWERTYUIOPASDFGHJKLZXCVBNM"
        for(let i = 0; i < allLetters.length; i ++) {
        	keyboardAccess[allLetters[i]] = i;
        }
        
        

        function createGrid() {
            for (let i = 0; i < maxAttempts * 5; i++) {
                const tile = document.createElement("div");
                tile.classList.add("tile");
                grid.appendChild(tile);
            }
        }

        function createKeyboard() {
        	if(endGame === 1){
        		return;
			}
            const keys = "QWERTYUIOPASDFGHJKLZ ".split("");
            keys.push("↵", "X", "C", "V", "B", "N", "M", "⌫");

            keys.forEach(key => {
                const keyButton = document.createElement("button");
                
                keyButton.classList.add("key");
                keyButton.textContent = key;
                if(keyButton.textContent === " ") {
                	keyButton.classList.remove("key");
                    keyButton.classList.add("keyblank");
                    
                }
                
                
                keyButton.onclick = () => handleKeyPress(key);
                keyboard.appendChild(keyButton);
            });
        }
        
        function createGridPhone() {
        	for (let i = 0; i < maxAttempts * 5; i++) {
                const tile = document.createElement("div");
                tile.classList.add("tile");
                gridp.appendChild(tile);
            }
        }
        
        function createKeyboardPhone() {
        	if(endGame === 1){
        		return;
			}
        	const keys = "QWERTYUIOPASDFGHJKLZ ".split("");
            keys.push("↵", "X", "C", "V", "B", "N", "M", "⌫");

            keys.forEach(key => {
                const keyButton = document.createElement("button");
                keyButton.classList.add("keyp");
                keyButton.textContent = key;
                if(keyButton.textContent === " ") {
                	keyButton.classList.remove("keyp");
                    keyButton.classList.add("keyblank");
                    
                }
                
                if(keyButton.textContent === "Q") {
                	thatKey = keyButton;
                    
                }
                
                keyButton.onclick = () => handleKeyPress(key);
                keyboard.appendChild(keyButton);
            });
        }
        
        function isMobile() {
        	return window.innerWidth <= 770;
    	}
        
        function initialize() {
        	if (isMobile()) {
            	createGridPhone();
            	createKeyboardPhone();
        	} else {
            	createGrid();
            	createKeyboard();
        	}
    	}
        

        function handleKeyPress(key) {
        	if(endGame === 1){
        		return;
			}
            const currentGrid = isMobile() ? gridp : grid;
			if (key === " ") {
            	return;
            }
            if (key === "⌫" | key === "Backspace") {
                currentGuess = currentGuess.slice(0, -1);
            } else if (key === "↵") {
            	for (let i = 0; i < 5; i++) {
                		let t = currentGrid.children[attempts * 5 + i];
                    	t.classList.remove("flash");
                    }
                makeGuess();
                return;
            } else if (currentGuess.length < 5) {
                currentGuess += key;
            }

            liveUpdate(currentGuess);
        }

        function liveUpdate(value) {
        	if(endGame === 1){
        		return;
			}
        	const currentGrid = isMobile() ? gridp : grid;
            
        	if(attempts > 6) {
            	return;
            }
            currentGuess = value;
            const start = attempts * 5;
            let tiles = []
            for (let i = 0; i < 5; i++) {
                tiles[i] = currentGrid.children[start + i];
                if (value[i]) {
                    tiles[i].textContent = value[i];
                    tiles[i].classList.add("revealed");
                    tiles[i].classList.remove("scaled");
                    if(i > 0) {
                    	tiles[i - 1].classList.remove("revealed");
                    	tiles[i - 1].classList.add("scaled");
                    }
                } else {
                    tiles[i].textContent = "";
                    tiles[i].classList.remove("revealed");
                    tiles[i].classList.add("scaled");
                }
            }
        }
		
        function generateShareGrid() {
        	let finalText = "";
        	for(let i = 0; i < statusOther.length; i ++) {
            	let shareText= "";
            	for(let j = 0; j < 5; j ++) {
                	if(statusOther[i][j] === "correct"){
                    	shareText += '🟩';
                    }
                    
                    if(statusOther[i][j] === "present"){
                    	shareText += '🟨';
                    }
                    
                    if(statusOther[i][j] === "absent"){
                    	shareText += '⬛';;
                    }
                    
                }
                
                finalText += (shareText + "/n");
                return finalText;
            }
        	
        }
        

        function makeGuess() {
        	if(endGame === 1){
        		return;
			}
        	const currentGrid = isMobile() ? gridp : grid;
    		const start = attempts * 5;
    		message.textContent = "";
			if(currentGuess.length === 0) {
            	return;
            }
			
            if(attempts > 5) {
            	return;
            }
    		
    		if (currentGuess.length !== 5) {
        		for (let i = currentGuess.length; i < 5; i++) {
            		let t = currentGrid.children[start + i];
            		t.classList.remove("flash");
            		void t.offsetWidth; 
            		t.classList.add("flash");

            
            		t.addEventListener("animationend", () => {
                		t.classList.remove("flash");
            		}, { once: true });
        		}
        		return;
    		}
            
            const tempTile = currentGrid.children[start + 4]
            tempTile.classList.remove("revealed");
            tempTile.classList.add("scaled");


    		const secretWordArray = Array.from(secretWord);
    		const guessArray = Array.from(currentGuess);  
    		const status = Array(5).fill("absent");        

    		
    		for (let i = 0; i < 5; i++) {
        		if (guessArray[i] === secretWordArray[i]) {
            		status[i] = "correct";               
            		secretWordArray[i] = null;        
        		}
    		}

    
    		for (let i = 0; i < 5; i++) {
        		if (status[i] !== "correct" && secretWordArray.includes(guessArray[i])) {
            		status[i] = "present";          
            		const index = secretWordArray.indexOf(guessArray[i]);
            		secretWordArray[index] = null; 
        		}
    		}

    
    		for (let i = 0; i < 5; i++) {
        		const tile = currentGrid.children[start + i];
        		tile.textContent = guessArray[i]; 
                
        		setTimeout(() => {
            		tile.classList.add(status[i]);
                    tile.classList.remove("scaled"); 
            		tile.classList.add("revealed"); 
  		      }, i * 300); 
  		  }


            
            //keybaord update code
            statusOther.push(status);

            for(let i = 0; i < guessArray.length; i ++) {
            	let temp = 0;
            	if(status[i] === "correct") {
                	temp = 2;
                }
                if(status[i] === "present") {
                	temp = 1;
                }
            	if(letters[guessArray[i]]) {
                	if(temp === 2) {
                    	letters[guessArray[i]] = status[i];
                    }
                    if(temp === 1 && letters[guessArray[i]] !== "correct") {
                    	letters[guessArray[i]] = status[i];
                    }
                    
                } else{
                	letters[guessArray[i]] = status[i];
                }
            }
            
            
            
            setTimeout(() => {
            	Object.entries(keyboardAccess).forEach(([letter, temp2]) => {
                	index = temp2;
            		if(!letters[letter]) {
                		return;
                	}
                 	if(index > 19) {
                    	index += 2;
                    }
                    if(isMobile()){
						keyboard.children[index].classList.remove("keyCorrectP", "keyPresentP", "keyAbsentP", "keyp");
                		let temp = "keyAbsentP";
                		if(letters[letter] === "correct") {
                			temp = "keyCorrectP";
                		}
                		if(letters[letter] === "present") {
                			temp = "keyPresentP";
                		}
                		keyboard.children[index].classList.add(temp);
					}
                    else {
    					keyboard.children[index].classList.remove("keyCorrect", "keyPresent", "keyAbsent");
                		let temp = "keyAbsent";
                		if(letters[letter] === "correct") {
                			temp = "keyCorrect";
                		}
                		if(letters[letter] === "present") {
                			temp = "keyPresent";
                		}
                		keyboard.children[index].classList.add(temp);
                    }
				});
            }, 1600);
            
  
            
            if(currentGuess === secretWord || (attempts + 1) === maxAttempts){
  				endGame = 1;
  document.getElementById("rectangle").classList.remove("rectangleBefore");
           	document.getElementById("rectangle").classList.add("rectangle");
            document.getElementById("rectangleFail").classList.remove("rectangleBefore");
           	document.getElementById("rectangleFail").classList.add("rectangle");
           }
            
            setTimeout(() => {
        		if (currentGuess === secretWord) {
                    setTimeout(() => {document.getElementById("rectangle").classList.add("rect");}, 1000);
                    
                    setTimeout(() =>{document.getElementById("rectangle").classList.add("rectanglef");}, 1500);
            		attempts += 7; // Prevent more shi
                    
        		}
    		}, 5 * 300); 
            
            if (currentGuess === secretWord) {
            	return;
            }
          
    		if ((attempts + 1) === maxAttempts) {
            
        		setTimeout(() => {
            		setTimeout(() => {document.getElementById("rectangleFail").classList.add("rect");}, 1000);
                    
                    setTimeout(() =>{document.getElementById("rectangleFail").classList.add("rectanglef");}, 1500);
        		}, 5 * 300); 
    		}
            
            
            currentGuess = "";
            attempts++;

		}
        
        
           
           



        initialize();
        
        const keyState = {}; 

		window.addEventListener("keydown", (event) => {
    		const key = event.key.toUpperCase(); // Normalize the key

    		// Handle letter keys
    		if (!keyState[key] && event.key.length === 1 && event.key.match(/[a-zA-Z]/)) {
        		handleKeyPress(key); 
        		keyState[key] = true; 
    		} 
    
   
    		else if (!keyState[key] && key === "BACKSPACE") {
        		handleKeyPress("⌫");
        		keyState[key] = true; 
    		} 
    
    		// Handle Enter (spammable)
    		else if (key === "ENTER") {
            
            	for (let i = 0; i < 5; i++) {
                		let t = grid.children[attempts * 5 + i];
                    	t.classList.remove("flash");
                }
                event.preventDefault();
        		makeGuess(); 
    		}
		});

		window.addEventListener("keyup", (event) => {
    		const key = event.key.toUpperCase(); // Normalize the key
    		if (key !== "ENTER") {
        		delete keyState[key]; 
        
    		}
		});

        
        
</script>
