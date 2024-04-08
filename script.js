    const inputBtn = document.querySelectorAll(".input-button");
    const keyBoard = document.querySelector(".keyboard");
    const keyBtn = document.querySelectorAll(".key");
    const title = document.querySelector("h1");
    const pseudoTitle = document.querySelector("h6");
    const endTitle = document.querySelector("h2");
    const end = document.querySelector(".end");
    const secretWord = document.querySelector(".secretword");
    const badGuess = document.querySelector(".badguess");
    let adder = 0;
    let limit = 5;
    let answer = "";
    let counter = 0;
    let store = [];
    let yellowStore = [];
    let secret = "";
    let row = 0;
    getWordOfTheDay();
    document.addEventListener("keydown",function(event){
            if(event.key.length === 1 && event.key.match(/[a-zA-Z]/) ) {
                    fill();
            }else if(event.key === "Backspace"){
                    remove();
            }else if(event.key === "Enter"){
                    buildAnswer();
                    console.log(answer);
                    validateAnswer();
                    // prevent default so when key is focused enter shouldnt select and execute it, spacebar will do it instead
                    event.preventDefault();
            }
    });
    keyBoard.addEventListener("click",function(event){
        if(event.target.innerHTML.length === 1) {
            fillKeyboard();
        }else if(event.target.innerHTML === "del"){
            remove();
        }else if(event.target.innerHTML === "enter"){
            buildAnswer();
            validateAnswer();
        }
    });
    function fill(){
        if(adder<limit){
            inputBtn[adder].innerHTML = event.key;
            inputBtn[adder].style.background = "#2563FD";
            adder++;
        }
    }
    function fillKeyboard(){
        if(adder<limit){
            inputBtn[adder].innerHTML = event.target.innerHTML;
            inputBtn[adder].style.background = "#2563FD";
            adder++;
        }
    }
    function remove(){
        if (adder > 0 && adder>limit-5) {
            adder--;
            inputBtn[adder].innerHTML = "";
            inputBtn[adder].style.background = "";
        }
    }
    function enter(){
        if(adder == limit){
            store = [];
            yellowStore = [];
            checkAnswer();
            limit+=5;
            row++;
        }
    }
    function checkAnswer(){
        secretWord.innerHTML = secret;
        greenValids(answer,secret,inputBtn);
        for(let i = adder-5;i<limit;i++){
            counter = 0;
            countLetters(secret,answer[i%5]);
            checkStoreMatch(answer[i%5]);
            checkYellowStoreMatch(answer[i%5]);
            if(counter>0 && answer[i%5] != secret[i%5]){
                inputBtn[i].style.background = "#FFD06A";
                yellowStore.push(answer[i%5]);
            }else if(answer[i%5] != secret[i%5]){
                inputBtn[i].style.background = "#1B268B80";
            }
            for(let keys = 0;keys<keyBtn.length;keys++){
                if(secret.includes(answer[i%5]) && keyBtn[keys].innerHTML == answer[i%5]){
                    if(answer[i%5] === secret[i%5]){
                    keyBtn[keys].style.background = "#8CE5B2";
                    }else if(keyBtn[keys].style.background !== "rgb(140, 229, 178)" && answer[i%5] !== secret[i%5]){
                    keyBtn[keys].style.background = "#FFD06A";
                    }
                }else if(secret.includes(answer[i%5]) == false && keyBtn[keys].innerHTML == answer[i%5]){
                    keyBtn[keys].style.background = "#ffffff80";
                }
            }
        }
        if(answer == secret){
            end.style.display = "flex";
        }else if(limit == 30 && answer != secret){
            secretWord.style.color = "#FF2400";
            endTitle.innerHTML = "You lost buddy";
            badGuess.innerHTML = "Better luck next time";
            end.style.display = "flex";
        }
        else{
            answer = "";
        }
    }
    function countLetters(str, letter) {
        for (let j = 0; j < str.length; j++) {
        if (str[j] === letter) {
            counter++;
        }
        }
    }
    function buildAnswer(){
        for(let i=adder-5;i<limit;i++){        
            answer += inputBtn[i].innerHTML.toLowerCase(); 
        }
    }
    function checkStoreMatch(letter){
        for(j=0;j<store.length;j++){
            if(letter == store[j]){
                counter--;
            }
        }
    }
    function greenValids(answerChar,secretChar,inputBtnCurr){
        for(let z = adder-5;z<limit;z++){
            if(answerChar[z%5] === secretChar[z%5]){
                inputBtnCurr[z].style.background = "#8CE5B2";
                store.push(answerChar[z%5]);
            }
        }
    }
    function checkYellowStoreMatch(letter){
        for(let k=0;k<yellowStore.length;k++){
            if(letter == yellowStore[k]){
                counter--;
            }
        }
    }
    async function getWordOfTheDay() {
        const url = 'https://words.dev-apis.com/word-of-the-day?random=1';
        try {
            const response = await fetch(url);
            const processedResponse = await response.json();
            secret = processedResponse.word;
        }
        catch (error) {
            console.error('Error fetching word of the day:', error);
            if (error instanceof TypeError) {
                // Handle network errors
                alert('Network error occurred. Please check your internet connection and try again.');
            } else if (error instanceof SyntaxError) {
                // Handle JSON parsing errors
                alert('My bad there is error on my part,ill fix it and you cat come back later!.');
            } else if (error instanceof Error && error.message.includes('404')) {
                // Handle specific HTTP status code errors
                alert('404 bud,try later!.');
            } else {
                // Handle other errors
                alert('An error occurred. Please try again later.');
            }
        }
    }

    async function validateAnswer() {
        pseudoTitle.style.animation = "loading 2s linear infinite";
        const url = 'https://words.dev-apis.com/validate-word';
        try{
            const response = await fetch(url,{
                method: "POST",
                body: JSON.stringify({"word": answer}),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const processedResponse = await response.json();
            pseudoTitle.style.animation = "none";
            let valid = processedResponse.validWord;
            console.log(valid);
            if(valid == true){
                enter();

            }else{
                for (let start = row * 5; start < limit; start++) {
                    inputBtn[start].style.animation = "none"; // Reset animation state
                    void inputBtn[start].offsetHeight; // Trigger reflow
                    inputBtn[start].style.animation = "wrong 0.2s "; // Reapply animation
                }
                title.innerHTML = "NOT A WORD";
                title.style.color = " #FF2400";
                setTimeout(function() {
                title.innerHTML = "WORDER";
                title.style.color = "unset";
                }, 1500);
                title.style.color = " #FF2400";
                answer = "";
            }
        }
        catch (error) {
            console.error('Error fetching word of the day:', error);
            if (error instanceof TypeError) {
                // Handle network errors
                alert('Network error occurred. Please check your internet connection and try again.');
            } else if (error instanceof SyntaxError) {
                // Handle JSON parsing errors
                alert('My bad there is error on my part,ill fix it and you cat come back later!.');
            } else if (error instanceof Error && error.message.includes('404')) {
                // Handle specific HTTP status code errors
                alert('404 bud,try later!.');
            } else {
                // Handle other errors
                alert('An error occurred. Please try again later.');
            }
        }
    }
