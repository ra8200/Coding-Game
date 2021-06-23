var timeEl = document.getElementById("timer");
var secondsLeft = 60;
var timerInterval;

var questName = document.getElementById("Question");
var firstChoiceEl = document.getElementById("answerButton1");
var secondChoiceEl = document.getElementById("answerButton2");
var thirdChoiceEl = document.getElementById("answerButton3");
var forthChoiceEl = document.getElementById("answerButton4");
var sTakeQ = document.getElementById("takeQuiz");
var sScore = document.getElementById("finalScore");
var sMain = document.getElementById("startQuiz");
var resultsEl = document.getElementById("result");
var messageDone = document.getElementById("msgQuizDone");
var scoreMessageEl = document.getElementById("msgScore");

var numCorrectAnswers = 0;
var numTotalQuestions = 0;
var idxQuestion = 0;
var blnCorrect = false;
var finalscore = 0;
var blnFinalQuestion = false;

sTakeQ.addEventListener("click", function (event) {
  var element = event.target;
  if (element.matches("button")) {
    resultsEl.textContent = element.getAttribute("data-answered");
    resultsEl.style.color = "red";
    if (element.getAttribute("data-answered") === "Correct") {
      blnCorrect = true;
      resultsEl.style.color = "yellowgreen";
      numCorrectAnswers++;
    } else {

      timeLeft -= 10;
      checkTimeRemaining();

    }

    idxQuestion++;
    loadQuestion();
  }

});

function loadQuestion() {
  var idxCorrect = -99;
  if (questions[idxQuestion] === undefined) {
    blnFinalQuestion = true;
    disableQuiz();
    return;
  }
  var correctAnswer = questions[idxQuestion].answer;
  numTotalQuestions++;

  questName.textContent = questions[idxQuestion].title;
  
  questions[idxQuestion].choices.sort(function() {
          return 0.5 - Math.random();
        });

  for (i = 0; i < questions[idxQuestion].choices.length; i++) {
    if (questions[idxQuestion].choices[i] === correctAnswer) {
      idxCorrect = i;
    }
  }

  firstChoiceEl.textContent = questions[idxQuestion].choices[0];
  secondChoiceEl.textContent = questions[idxQuestion].choices[1];
  thirdChoiceEl.textContent = questions[idxQuestion].choices[2];
  forthChoiceEl.textContent = questions[idxQuestion].choices[3];

  firstChoiceEl.setAttribute("data-answered", "Incorrect");
  secondChoiceEl.setAttribute("data-answered", "Incorrect");
  thirdChoiceEl.setAttribute("data-answered", "Incorrect");
  forthChoiceEl.setAttribute("data-answered", "Incorrect");

  switch (idxCorrect) {
    case 0:
        firstChoiceEl.setAttribute("data-answered", "Correct");
      break;
    case 1:
        secondChoiceEl.setAttribute("data-answered", "Correct");
      break;
    case 2:
        thirdChoiceEl.setAttribute("data-answered", "Correct");
      break;
    case 3:
        forthChoiceEl.setAttribute("data-answered", "Correct");
      break;
  }
}

function setTime() {
  timerInterval = setInterval(function () {
    timeLeft--;

    if (!timeLeft > 0) {
      timeLeft = 0;
    }
    timeEl.textContent = "Time: " + timeLeft.toString().padStart(2, '0');
    checkTimeRemaining();

  }, 1000);
}

function checkTimeRemaining() {

  if (timeLeft <= 0 || blnFinalQuestion) {
    disableQuiz();
    clearInterval(timerInterval);

    showFinalScore();
  }
}

function showFinalScore() {
  sTakeQ.classList.add("d-none")
  sScore.classList.remove("d-none");
  document.getElementById("msgQuizDone").textContent = "All done!";
  if (!timeLeft > 0) {
    timeLeft = 0;
  }
  finalscore = 0;
  if (numCorrectAnswers > 0) {

    finalscore = Math.round(100 * (numCorrectAnswers / numTotalQuestions) + (0.2 * secondsLeft));
    if (finalscore > 100) {
      finalscore = 100;
    }
  }
  console.log("note: Total questions= " + numTotalQuestions + "\n correct answers= " + numCorrectAnswers + "\n seconds left= " + secondsLeft + "\n final score= " + finalscore);

  document.getElementById("msgScore").textContent = "Your final score is " + finalscore;

}

function takeQuiz() {

  idxQuestion = 0;
  loadQuestion();
  sMain.classList.add("d-none");
  sTakeQ.classList.remove("d-none");

  setTime();
}

function disableQuiz() {
  firstChoiceEl.disabled = true;
  firstChoiceEl.classList.remove("btn-primary");
  firstChoiceEl.classList.add("btn-secondary");
  secondChoiceEl.disabled = true;
  secondChoiceEl.classList.remove("btn-primary");
  secondChoiceEl.classList.add("btn-secondary");
  thirdChoiceEl.disabled = true;
  thirdChoiceEl.classList.remove("btn-primary");
  thirdChoiceEl.classList.add("btn-secondary");
  forthChoiceEl.disabled = true;
  forthChoiceEl.classList.remove("btn-primary");
  forthChoiceEl.classList.add("btn-secondary");
}

document.querySelector("#startBtn").onclick = function (event) {
  if (event === null) {
    return;
  }
  takeQuiz();
}

document.querySelector("#submitBtn").onclick = function (event) {

  if (event === null) {
    return;
  }
  if (document.getElementById("xInitials").value.length === 0) {
    alert("Please enter your initials to submit your quiz score.");
    return;
  }
  if (finalscore === 0) {
    alert("Sorry, your score must be above a zero to be saved on the wall of fame.");
    return;
  }
  
  Scores = JSON.parse(localStorage.getItem('highscores'));

  if (Scores !== null) {

    Scores.push({
      'initials': document.getElementById("xInitials").value,
      'highscore': finalscore
    });
  } else {
    Scores = [];
    Scores.push({
      'initials': document.getElementById("xInitials").value,
      'highscore': finalscore
    });
  }
  localStorage.setItem('highscores', JSON.stringify(Scores));
  document.getElementById("submitBtn").disabled = true;
  document.getElementById("submitBtn").remove("btn-primary");
  sScore.classList.add("d-none");
  document.location.href= "index.html";

}


