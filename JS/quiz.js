import { Question } from "./question.js";

export class Quiz {
  constructor(questions) {
    this.questionsData = questions;
    this.currentIndex = 0;
    this.score = 0;

    this.container = document.getElementById("questionsContainer");

    this.showNextQuestion();
  }

  showNextQuestion() {
    if (this.currentIndex < this.questionsData.length) {
      const currentQData = this.questionsData[this.currentIndex];

      const question = new Question(
        currentQData,
        this.currentIndex,
        this.questionsData.length,
        (isCorrect) => {
          if (isCorrect) {
            this.score++;
          }

          this.currentIndex++;
          this.showNextQuestion();
        },
        this.score
      );

      question.render(this.container);
    } else {
      this.showResults();
    }
  }

  showResults() {
    const total = this.questionsData.length;
    const percentage = Math.round((this.score / total) * 100);

    const playerName =
      document.getElementById("playerName")?.value ||
      "Olaa";

    this.container.innerHTML = `
      <div class="game-card results-card">

        <div class="results-icon">
          <i class="fa-solid fa-trophy"></i>
        </div>

        <h2 class="results-title">
          Quiz Complete!
        </h2>

        <div class="results-score-display">
          ${this.score}/${total}
        </div>

        <div class="results-percentage">
          ${percentage}% Accuracy
        </div>

        <div class="high-score-message">
          <i class="fa-solid fa-trophy"></i>
          New High Score!
        </div>

        <div class="leaderboard">

          <h3 class="leaderboard-title">
            Leaderboard
          </h3>

          <div class="leaderboard-row">

            <span class="leaderboard-rank">
              #1
            </span>

            <span class="leaderboard-player">
              ${playerName}
            </span>

            <span class="leaderboard-score">
              ${percentage}%
            </span>

          </div>

        </div>

        <button
          class="btn-restart"
          id="playAgainBtn"
          type="button"
        >
          <i class="fa-solid fa-rotate-right"></i>
          Play Again
        </button>

      </div>
    `;

    document
      .getElementById("playAgainBtn")
      .addEventListener("click", () => {
        location.reload();
      });
  }
}