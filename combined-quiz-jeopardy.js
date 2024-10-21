// Existing quiz code
let questionItem = $(".questions");
let totalQuestions = questionItem.length;
let gameOver = false;

// ... (keep all the existing quiz code here)

// Modify the existing "frame-link" click event
$(".frame-link").on("click", function () {
  if (gameOver == false) {
    let currentQuestion = $(".questions.is--current-question");
    currentQuestion.next().addClass("is--current-question");
    currentQuestion.removeClass("is--current-question");
    $(".glass").removeClass("is--hidden");
    loadAnimation();
  } else {
    $(".container.is--quiz .wrapper, .container.is--quiz .frame").css(
      "display",
      "none"
    );
    $(".section.is--bottom, .section.is--nav").addClass("fade-away");
    $(".finish").css("display", "flex");
    $("#start-jeopardy").css("display", "block"); // Show the Jeopardy start button
  }
});

// Jeopardy game code
class JeopardyGame {
  constructor() {
    this.categories = ['History', 'Science', 'Geography', 'Literature', 'Math'];
    this.clues = this.categories.map(category => 
      Array(5).fill().map((_, i) => ({
        question: `This is a ${category} question worth $${(i + 1) * 200}.`,
        answer: `Answer for ${category} $${(i + 1) * 200}`,
        value: (i + 1) * 200
      }))
    );
    this.scores = [0, 0];
    this.currentTeam = 0;

    this.renderBoard();
    this.addEventListeners();
  }

  renderBoard() {
    const board = document.getElementById('game-board');
    board.innerHTML = '';

    this.categories.forEach(category => {
      const categoryElement = document.createElement('div');
      categoryElement.className = 'category';
      categoryElement.textContent = category;
      board.appendChild(categoryElement);
    });

    this.clues.forEach((category, categoryIndex) => {
      category.forEach((clue, clueIndex) => {
        const clueElement = document.createElement('div');
        clueElement.className = 'clue';
        clueElement.textContent = '$' + clue.value;
        clueElement.dataset.category = categoryIndex;
        clueElement.dataset.clue = clueIndex;
        board.appendChild(clueElement);
      });
    });

    this.updateScoreboard();
  }

  addEventListeners() {
    document.getElementById('game-board').addEventListener('click', (e) => {
      if (e.target.classList.contains('clue') && !e.target.classList.contains('revealed')) {
        this.revealClue(e.target);
      }
    });

    document.getElementById('submit-answer').addEventListener('click', () => this.submitAnswer());
  }

  revealClue(clueElement) {
    const categoryIndex = clueElement.dataset.category;
    const clueIndex = clueElement.dataset.clue;
    const clue = this.clues[categoryIndex][clueIndex];

    document.getElementById('modal-category').textContent = this.categories[categoryIndex];
    document.getElementById('modal-question').textContent = clue.question;
    document.getElementById('question-modal').style.display = 'block';

    clueElement.classList.add('revealed');
    this.currentClue = clue;
  }

  submitAnswer() {
    const answerInput = document.getElementById('answer-input');
    const playerAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = this.currentClue.answer.toLowerCase();

    if (playerAnswer === correctAnswer) {
      this.scores[this.currentTeam] += this.currentClue.value;
      alert('Correct!');
    } else {
      alert(`Incorrect. The correct answer was: ${this.currentClue.answer}`);
    }

    document.getElementById('question-modal').style.display = 'none';
    answerInput.value = '';
    this.currentTeam = 1 - this.currentTeam;
    this.updateScoreboard();
  }

  updateScoreboard() {
    document.getElementById('team1-score').textContent = `Team 1: $${this.scores[0]}`;
    document.getElementById('team2-score').textContent = `Team 2: $${this.scores[1]}`;
  }
}

// Start Jeopardy game when button is clicked
document.getElementById('start-jeopardy').addEventListener('click', function() {
  document.getElementById('jeopardy-game').style.display = 'block';
  this.style.display = 'none';
  new JeopardyGame();
});

// Run the existing quiz initialization
$(document).ready(function() {
  questionItem.eq(0).addClass("is--current-question");
  $(".bar-total").text(totalQuestions);
  updateUi();
  loadAnimation();
});
