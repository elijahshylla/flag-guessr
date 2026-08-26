const flag = document.getElementById("flag");
const answers = document.getElementById("answers");

const scoreDisplay = document.getElementById("score");
const questionDisplay = document.getElementById("question");

const result = document.getElementById("result");
const streakDisplay = document.getElementById("streak");
const nextButton = document.getElementById("next-button");

const mainMenu = document.getElementById("main-menu");
const gameScreen = document.getElementById("game-screen");
const modeButtons = document.querySelectorAll(".mode-button");

const expertTimerContainer = document.getElementById("expert-timer-container");
const expertNavigation = document.getElementById("expert-navigation");
const expertPreviousButton = document.getElementById("expert-previous-button");
const expertNextButton = document.getElementById("expert-next-button");

const expertPlayAgainButton = document.getElementById("expert-play-again-button");
const expertReturnToMenuButton = document.getElementById("expert-return-to-menu-button");

expertPlayAgainButton.addEventListener("click", startGame);
expertReturnToMenuButton.addEventListener("click", returnToMenu);

const endScreen = document.getElementById("end-screen");
const finalScore = document.getElementById("final-score");
const finalPercentage = document.getElementById("final-percentage");
const finalMessage = document.getElementById("final-message");
const scoreProgress = document.getElementById("score-progress");
const playAgainButton = document.getElementById("play-again-button");
const personalBestDisplay = document.getElementById("personal-best");
const newRecordDisplay = document.getElementById("new-record");
const averageScoreDisplay = document.getElementById("average-score");
const bestStreakDisplay = document.getElementById("best-streak");
const wrongAnswersDisplay = document.getElementById("wrong-answers");

const returnToMenuButton = document.getElementById("return-to-menu-button");

const correctFlagAudio = new Audio("audio/correct.mp3");
const incorrectFlagAudio = new Audio("audio/wrong.mp3");
const victoryScreenAudio = new Audio("audio/victory.mp3");
const midScoreScreenAudio = new Audio("audio/mid.mp3");
const redFlagScreenAudio = new Audio("audio/red_flag.mp3");

const expertEndScreen = document.getElementById("expert-end-screen");
const expertFinalScore = document.getElementById("expert-final-score");
const expertFinalMessage = document.getElementById("expert-final-message");
const expertFlagsIdentified = document.getElementById("expert-flags-identified");
const expertAccuracy = document.getElementById("expert-accuracy");
const expertBestStreak = document.getElementById("expert-best-streak");
const expertTimeRemaining = document.getElementById("expert-time-remaining");
const expertRecord = document.getElementById("expert-record");

modeButtons.forEach(button => { 
	button.addEventListener("click", () => {
		
		currentMode = button.dataset.mode;
		
		mainMenu.classList.add("hidden");
		gameScreen.classList.remove("hidden");
		
		startGame();
	});
});

let currentMode = "normal";

let countries = [];
let wrongAnswers = [];
let currentCountry = null;

let score = 0;
let questionNumber = 0;
let personalBest = {normal:0, medium:0, hard:0, expert:0};
let gamesPlayed = 0;
let averageScore = 0;
let questionList = [];
let streak = 0;
let highestStreak = 0;

let expertTime = 120;
let expertTimer = null;

let expertFlags = [];
let expertStatus = [];
let expertCurrentIndex = 0;

let TOTAL_QUESTIONS = 20;

const savedPersonalBest = JSON.parse(localStorage.getItem("flagGuessrPersonalBest"));

if(savedPersonalBest !== null){
	personalBest = savedPersonalBest;
}

//Load countries
async function loadCountries(){
	try{
		const response = await fetch("data/countries.json");
		countries = await response.json();
		console.log("Countries loaded:", countries.length);
	}catch(error){
		console.error(error);
		result.textContent = "Failed to load country data.";
	}
}

//Randomize countries
function randomizeCountries(array){
	const shuffled = [...array];
	
	for(let i=shuffled.length - 1; i>0; i--){
		const j = Math.floor(Math.random() * (i+1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

//Random country
function randomItem(array){
    return array[Math.floor(Math.random() * array.length)];
}

//Returns an array that has common elements to both arrays
function getCommonElements(array1, array2){
	return array1.filter(element => array2.includes(element));
}

//Algorithm to calculate similarity score between flags
function similarityRatio(array1, array2) {

    const maxLength = Math.max(array1.length, array2.length);

    // If neither country has this feature
    if (maxLength === 0) {
        return 0;
    }

    const commonElements = getCommonElements(array1, array2);

    return commonElements.length / maxLength;
}


function calculateSimilarity(country1, country2) {

    let similarityScore = 0;
	
    // Colours: 30 points
    similarityScore += similarityRatio(
        country1.colours,
        country2.colours
    ) * 30;
	
    // Layout: 35 points
    if (country1.layout === country2.layout) {

        similarityScore += 35;
    }else{
        // Penalise fundamentally different layouts
        similarityScore -= 20;
    }


    // Features: 25 points
    similarityScore += similarityRatio(
        country1.features,
        country2.features
    ) * 20;

    // Symbols: 15 points
    similarityScore += similarityRatio(
        country1.symbols,
        country2.symbols
    ) * 15;


    // Keep score between 0 and 100
    return Math.max(0, Math.min(100, similarityScore));
}

function getMediumOptions(currentCountry) {
    const candidates = countries
        .filter(country => country.code !== currentCountry.code)
        .map(country => ({
            country: country,
            similarity: calculateSimilarity(
                currentCountry,
                country
            )
        }));
		
    // Sort by highest similarity
    candidates.sort((a, b) => b.similarity - a.similarity);
    // Only consider reasonably similar flags
    let similarCandidates = candidates.filter(
        candidate => candidate.similarity >= 65
    );
    // Fallback if there aren't enough candidates
    if (similarCandidates.length < 3) {
        similarCandidates = candidates.slice(0, 5);
    }
    // Keep the candidate pool small enough
    // that the answers remain visually similar
    const candidatePool = similarCandidates.slice(0, 5);
    // Randomise the candidates
    const shuffledCandidates = randomizeCountries(candidatePool);
    // Select 3 incorrect answers
    const bigThree = shuffledCandidates
        .slice(0, 3)
        .map(item => item.country);
    // Add the correct answer
    return [currentCountry, ...bigThree];
}

// Setup hard mode
function setupHardMode(correctCountry){
	answers.innerHTML = "<p> Enter Country </p><br>";
	
	const input = document.createElement("input");
	input.id = "country-input";
	input.type = "text";
	input.autocomplete = "off";
	input.placeholder = "";
	
	const submitButton = document.createElement("button");
	submitButton.textContent = "Submit";
	submitButton.id = "submit-answer";
	
	answers.appendChild(input);
	answers.appendChild(submitButton);
	
	submitButton.addEventListener("click", ()=> {
	checkHardAnswer(input.value, correctCountry)
	});
	
	input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.stopPropagation();

        if (!input.disabled) {
            checkHardAnswer(input.value, correctCountry);
        }
    }
});
	
	input.focus();
}
	
function checkHardAnswer(userAnswer, correctCountry){
	userAnswer = userAnswer.trim().toLowerCase();
	correctCountry = correctCountry.name.trim().toLowerCase();
	
	if(userAnswer === correctCountry){
		correctFlagAudio.play();
        score++;
        scoreDisplay.textContent = score;
		document.getElementById("country-input").classList.add("correct");
        result.textContent = "✓ Correct!";
		streak++;
		updateStreakVisuals();
		
		if(streak > 2){
			streakDisplay.textContent = `🔥 Streak: ${streak}`
			streakDisplay.classList.remove("hidden")
			if(streak > highestStreak){
				highestStreak = streak;
			}
		}
	}else{
		incorrectFlagAudio.play();
        document.getElementById("country-input").classList.add("wrong");
		result.textContent = `✗ Wrong! The country was ${currentCountry.name}`;
		streak = 0;
		updateStreakVisuals();
		wrongAnswers.push(currentCountry.name);
		
		streakDisplay.textContent = "";
		streakDisplay.classList.add("hidden");
		}
		
	document.getElementById("country-input").disabled = true;
	document.getElementById("submit-answer").disabled = true;

	nextButton.style.display = "block";
}

//Expert Timer mode
function startExpertTimer(){
	clearInterval(expertTimer);
	
	expertTimer = setInterval(() => {
		expertTime--;
		updateExpertTimer();
		
		if(expertTime <= 0){
			clearInterval(expertTimer);
			endExpertGame();
		}
	},1000);
}

function updateExpertTimer() {

    const timerDisplay =
        document.getElementById("expert-timer");

    const timerContainer =
        document.getElementById("expert-timer-container");

    if (!timerDisplay || !timerContainer) return;

    const minutes = Math.floor(expertTime / 60);
    const seconds = expertTime % 60;

    timerDisplay.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    timerContainer.classList.remove(
        "timer-warning",
        "timer-danger"
    );

    if (expertTime <= 30) {

        timerContainer.classList.add("timer-danger");

    } else if (expertTime <= 60) {

        timerContainer.classList.add("timer-warning");

    }
}

function addExpertTime() {

    const bonus = Math.floor(Math.random() * 3) + 3;

    expertTime += bonus;

    updateExpertTimer();

    console.log(`+${bonus} seconds`);
}

function startExpertMode() {

    expertTime = 120;

    expertFlags = randomizeCountries(countries);

    expertStatus = new Array(expertFlags.length).fill("unanswered");

    expertCurrentIndex = 0;
	
	nextButton.classList.add("hidden");
	
	expertTimerContainer.classList.remove("hidden");
    expertNavigation.classList.remove("hidden");

    updateExpertTimer();
    startExpertTimer();

    loadExpertFlag();
}

function loadExpertFlag() {

    const country = expertFlags[expertCurrentIndex];

    currentCountry = country;

    flag.src = `flags/${country.code}.svg`;
    flag.alt = "Mystery flag";

    result.textContent = "";
	questionDisplay.textContent =
    `${expertCurrentIndex + 1} / ${expertFlags.length}`;

    setupExpertMode(country);

    updateExpertNavigation();
}

function setupExpertMode(correctCountry) {

    answers.innerHTML = "<p>Enter Country</p><br>";

    const input = document.createElement("input");

    input.id = "country-input";
    input.type = "text";
    input.autocomplete = "off";

    const submitButton = document.createElement("button");

    submitButton.textContent = "Submit";
    submitButton.id = "submit-answer";

    answers.appendChild(input);
    answers.appendChild(submitButton);

    // Flag has already been answered
    if (expertStatus[expertCurrentIndex] === "correct") {

        input.value = correctCountry.name;
        input.disabled = true;
        input.classList.add("correct");

        submitButton.disabled = true;

        result.textContent = "✓ Already identified";

        return;
    }
	
	expertNextButton.classList.remove("hidden");
	expertPreviousButton.classList.remove("hidden");

    // Flag has not been answered yet
    submitButton.addEventListener("click", () => {
        checkExpertAnswer(input.value, correctCountry);
    });

    input.addEventListener("keydown", (event) => {

        if (event.key === "Enter") {

            event.stopPropagation();

            if (!input.disabled) {
                checkExpertAnswer(input.value, correctCountry);
            }

        }

    });

    input.focus();
}

function checkExpertAnswer(userAnswer, correctCountry) {

    userAnswer = userAnswer.trim().toLowerCase();

    const correctAnswer =
        correctCountry.name.trim().toLowerCase();

    const input = document.getElementById("country-input");

    if (userAnswer === correctAnswer) {

        // Prevent answering the same flag twice
        if (expertStatus[expertCurrentIndex] === "correct") {
            return;
        }

        correctFlagAudio.play();

        score++;

        scoreDisplay.textContent = score;

        expertStatus[expertCurrentIndex] = "correct";

        input.classList.add("correct");

        result.textContent = "✓ Correct!";

        streak++;

        updateStreakVisuals();
		

        if (streak > 2) {

            streakDisplay.textContent = `🔥 Streak: ${streak}`;

            streakDisplay.classList.remove("hidden");

            if (streak > highestStreak) {
                highestStreak = streak;
            }
        }

        addExpertTime();

        input.disabled = true;

        document.getElementById("submit-answer").disabled = true;

        updateExpertNavigation();
		
		checkExpertCompletion();

    } else {

        incorrectFlagAudio.play();

        input.classList.remove("wrong");

        // Force animation to restart
        void input.offsetWidth;

        input.classList.add("wrong");

        result.textContent = "✗ Wrong! Try again.";

        streak = 0;

        updateStreakVisuals();

        streakDisplay.textContent = "";
        streakDisplay.classList.add("hidden");

    }
}

function checkExpertCompletion() {

    const completed = expertStatus.every(
        status => status === "correct"
    );

    if (completed) {
        endExpertGame();
    }
}

function nextExpertFlag() {

    if (expertCurrentIndex < expertFlags.length - 1) {

        expertCurrentIndex++;

        loadExpertFlag();
    }
}

function previousExpertFlag() {

    if (expertCurrentIndex > 0) {

        expertCurrentIndex--;

        loadExpertFlag();
    }
}

function updateExpertNavigation() {

    expertPreviousButton.disabled =
        expertCurrentIndex === 0;

    expertNextButton.disabled =
        expertCurrentIndex === expertFlags.length - 1;

}

function endExpertGame() {

    clearInterval(expertTimer);

    gameScreen.classList.add("hidden");

    expertEndScreen.classList.remove("hidden");

    const totalFlags = expertFlags.length;

    const accuracy =
        Math.round((score / totalFlags) * 100);
		
		
	if (score > personalBest.expert) {
    personalBest.expert = score;

    localStorage.setItem(
        "flagGuessrPersonalBest",
        JSON.stringify(personalBest)
    );

    expertRecord.classList.remove("hidden");
	} else {
    expertRecord.classList.add("hidden");
	}

    expertFinalScore.textContent =
        `${score} / ${totalFlags}`;

    expertFlagsIdentified.textContent =
        score;

    expertAccuracy.textContent =
        `${accuracy}%`;

    expertBestStreak.textContent =
        highestStreak;

    expertTimeRemaining.textContent =
        formatExpertTime(expertTime);

    if (score === totalFlags) {

        expertFinalMessage.textContent =
            "🌎 You identified every flag!";

    } else {

        expertFinalMessage.textContent =
            "Great run! Can you identify more next time?";

    }
}

//Start game
function startGame(){
    score = 0;
    questionNumber = 0;
    streak = 0;
    highestStreak = 0;
    wrongAnswers.length = 0;

    // Reset common game UI
    document.querySelector(".stats").classList.remove("hidden");
    document.querySelector(".flag-container").classList.remove("hidden");
    answers.classList.remove("hidden");
    result.classList.remove("hidden");
	
	expertTimerContainer.classList.add("hidden");
	expertNavigation.classList.add("hidden");
	expertNextButton.classList.add("hidden");
	expertPreviousButton.classList.add("hidden");

    endScreen.classList.add("hidden");
    expertEndScreen.classList.add("hidden");

    updateStreakVisuals();

    scoreDisplay.textContent = score;

    if(currentMode === "expert"){
        startExpertMode();
        nextButton.classList.add("hidden");
        return;
    }

    nextButton.classList.remove("hidden");
    streakDisplay.classList.add("hidden");
    nextButton.style.display = "block";

    if(currentMode === "normal"){
        TOTAL_QUESTIONS = 20;
    }else if(currentMode === "medium"){
        TOTAL_QUESTIONS = 30;
    }else if(currentMode === "hard"){
        TOTAL_QUESTIONS = 50;
    }

    questionList = randomizeCountries(countries);

    nextButton.textContent = "Next →";

    nextQuestion();
}
	

//Next question
function nextQuestion(){
	if(questionNumber >= TOTAL_QUESTIONS){
		endGame();
		return;
	}
	questionNumber++;
	
	questionDisplay.textContent = `${questionNumber}/${TOTAL_QUESTIONS}`;
	
	result.textContent = "";
	nextButton.style.display = "none";
	
	currentCountry = questionList[questionNumber-1];
	
	flag.src = `flags/${currentCountry.code}.svg`;
	flag.alt = "Mystery flag";
	
	flag.onerror = () => {
    console.error("Could not load:", flag.src);
};
	
	createAnswers();
}

//Creating answers
function createAnswers(){
	answers.innerHTML = "";
	
	let options = [currentCountry];
	
	if(currentMode === "normal"){
		while(options.length < 4){
			const country = randomItem(countries);
			if(!options.includes(country)){
				options.push(country)
			}
		}
	}
	else if(currentMode === "medium"){
		options = getMediumOptions(currentCountry);
	}
	else if(currentMode === "hard"){
		setupHardMode(currentCountry);
	}
	else if(currentMode === "expert"){
    setupExpertMode(currentCountry);
	}
	
	if(currentMode !== "hard" && currentMode !== "expert"){
		options = randomizeCountries(options);
	
		for(const country of options){
			const button = document.createElement("button");
			button.textContent = country.name;
			button.addEventListener("click",
			()=> checkAnswer(country));
		
			answers.appendChild(button);
		}
	}
}

function checkAnswer(country){
    const buttons = answers.querySelectorAll("button");

    buttons.forEach(button => {
        button.disabled = true;
    });

    if(country.code === currentCountry.code){
		correctFlagAudio.play();
        score++;
        scoreDisplay.textContent = score;
        result.textContent = "✓ Correct!";

        buttons.forEach(button => {
            if(button.textContent === currentCountry.name){
                button.classList.add("correct");
            }
        });
	
		streak++;
		
		updateStreakVisuals();
			
		if(streak > 2){
			streakDisplay.textContent = `🔥 Streak: ${streak}`
			streakDisplay.classList.remove("hidden")
			if(streak > highestStreak){
				highestStreak = streak;
			}
		}
	}
	else{
		incorrectFlagAudio.play();
        result.textContent = `✗ Wrong! The country was ${currentCountry.name}`;
		streak = 0;
		updateStreakVisuals();
		wrongAnswers.push(currentCountry.name);
		
		streakDisplay.textContent = "";
		streakDisplay.classList.add("hidden");

        buttons.forEach(button => {
            if(button.textContent === country.name){
                button.classList.add("wrong");
            }

            if(button.textContent === currentCountry.name){
                button.classList.add("correct");
            }
        });
    }

    nextButton.style.display = "block";
}

function updateStreakVisuals(){
	const intensity = Math.min(Math.max((streak - 2) / 5, 0), 4);
	document.documentElement.style.setProperty(
		"--streak-intensity",
		intensity
		);
		
	const fire = document.getElementById("fire");
	
	fire.style.height = `${intensity * 45}vh`;
	fire.style.opacity = intensity;
}

function endGame(){
	
	document.querySelector(".stats").classList.add("hidden");
    document.querySelector(".flag-container").classList.add("hidden");
    answers.classList.add("hidden");
    result.classList.add("hidden");
    nextButton.style.display = "none";

    const percentage = Math.round(
        (score / TOTAL_QUESTIONS) * 100
    );
	
	gamesPlayed++;
	averageScore = ((averageScore * (gamesPlayed - 1)) + score) / gamesPlayed;
	averageScore = Math.round(averageScore * 10) / 10;
	
	console.log(personalBest);
	
	if(score > personalBest[currentMode]){
		personalBest[currentMode] = score;
		localStorage.setItem("flagGuessrPersonalBest", JSON.stringify(personalBest));
		
		newRecordDisplay.classList.remove("hidden");
	}else{
		newRecordDisplay.classList.add("hidden");
	}
	
    finalScore.textContent =
        `${score} / ${TOTAL_QUESTIONS}`;

    finalPercentage.textContent =
        `${percentage}% Accuracy`;
	
	personalBestDisplay.textContent =
		`Personal Best: ${personalBest[currentMode]} / ${TOTAL_QUESTIONS}`;
		
	averageScoreDisplay.textContent =
		`Average Score: ${averageScore} / ${TOTAL_QUESTIONS}`;
		
	wrongAnswersDisplay.innerHTML = `Flags missed: ${wrongAnswers.length}`;
	
	wrongAnswers.forEach(country => {
    const item = document.createElement("p");
    item.textContent = country;
    wrongAnswersDisplay.appendChild(item);
});	
		
	if(highestStreak != 0){
		bestStreakDisplay.textContent =
			`🔥 Highest Streak: ${highestStreak}`;
	}

    if (percentage === 100) {
        finalMessage.textContent = "🗺️ Did you cheat?";
		victoryScreenAudio.play();
    } else if (percentage >= 80) {
        finalMessage.textContent = "⛰️ Ok, you cooked.";
		victoryScreenAudio.play();
    } else if (percentage >= 60) {
        finalMessage.textContent = "🏢 At least you're Employed (I hope)";
		midScoreScreenAudio.play();
    } else if (percentage >= 40) {
        finalMessage.textContent = "🚩 Red Flag";
		redFlagScreenAudio.play();
    } else {
        finalMessage.textContent = "👅 Womp Womp";
		redFlagScreenAudio.play();
    }
	
    scoreProgress.style.width = `${percentage}%`;

    endScreen.classList.remove("hidden");
}

function formatExpertTime(seconds) {

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function returnToMenu(){
    endScreen.classList.add("hidden");
    expertEndScreen.classList.add("hidden");
    gameScreen.classList.add("hidden");

    mainMenu.classList.remove("hidden");
}


expertPreviousButton.addEventListener("click",
    previousExpertFlag);
expertNextButton.addEventListener("click",
	nextExpertFlag);

nextButton.addEventListener("click", nextQuestion);

document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;

    const input = document.getElementById("country-input");

    // If the answer input is active, let its own listener handle Enter
    if (input && document.activeElement === input) {
        return;
    }

    // Otherwise, Enter acts as the Next button
    if (nextButton.style.display !== "none" && currentMode !== "expert") {
        nextButton.click();
    }
});
							

document.addEventListener("keydown", (event) => {

    if (currentMode !== "expert") return;

    if (event.key === "ArrowLeft") {

        event.preventDefault();
        previousExpertFlag();

        return;
    }

    if (event.key === "ArrowRight") {

        event.preventDefault();
        nextExpertFlag();

        return;
    }

    if (event.key === "Enter") {

        const input =
            document.getElementById("country-input");

        // If the input is active and still enabled,
        // let its own listener handle the submission.
        if (
            input &&
            document.activeElement === input &&
            !input.disabled
        ) {
            return;
        }

        // If the flag was already answered,
        // Enter moves to the next flag.
        if (
            expertStatus[expertCurrentIndex] === "correct"
        ) {
            event.preventDefault();
            nextExpertFlag();
        }
    }

});


document.addEventListener("keydown", (event) => {

    // Only for Normal and Medium
    if (currentMode !== "normal" && currentMode !== "medium") {
        return;
    }

    // Only accept keys 1, 2, 3, 4
    if (!["1", "2", "3", "4"].includes(event.key)) {
        return;
    }

    const optionNumber = Number(event.key);

    const optionButtons =
        answers.querySelectorAll("button");

    const selectedButton =
        optionButtons[optionNumber - 1];

    if (!selectedButton) return;

    // Don't activate an already disabled option
    if (selectedButton.disabled) return;

    selectedButton.click();

});

playAgainButton.addEventListener("click", startGame);
returnToMenuButton.addEventListener("click", returnToMenu);

loadCountries();