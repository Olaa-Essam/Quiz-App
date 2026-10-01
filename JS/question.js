export class Question {
  constructor(data, index, totalQuestions, onAnswerCallback, currentScore = 0) {
    this.data = data;
    this.index = index;
    this.totalQuestions = totalQuestions;
    this.onAnswerCallback = onAnswerCallback;
    this.currentScore = currentScore;

    this.timer = 15;
    this.timerInterval = null;

    this.answers = this.shuffleAnswers([
      data.correct_answer,
      ...data.incorrect_answers,
    ]);

    this.correctSound = new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3"
    );

    this.wrongSound = new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3"
    );
  }


  shuffleAnswers(answers) {
    return answers.sort(() => Math.random() - 0.5);
  }


  render(container) {
    const progress =
      ((this.index + 1) / this.totalQuestions) * 100;

    container.innerHTML = `
      <div class="game-card question-card">


        <div class="xp-bar-container">

          <div class="xp-bar-header">

            <span class="xp-label">
              <i class="fa-solid fa-bolt"></i>
              Progress
            </span>

            <span class="xp-value">
              Round ${this.index + 1}/${this.totalQuestions}
            </span>

          </div>

          <div class="xp-bar">
            <div
              class="xp-bar-fill"
              style="width: ${progress}%"
            ></div>
          </div>

        </div>



        <div class="stats-row">

          <div class="stat-badge category">
            <span>${this.data.category}</span>
          </div>

          <div
            class="stat-badge difficulty ${this.data.difficulty}"
          >
            <span>${this.data.difficulty}</span>
          </div>

          <div class="stat-badge timer">
            <i class="fa-solid fa-stopwatch"></i>

            <span id="timerVal">
              ${this.timer}
            </span>

            s
          </div>

        </div>



        <h2 class="question-text">
          ${this.data.question}
        </h2>



        <div
          class="answers-grid"
          id="answersGrid"
        >

          ${this.answers
            .map(
              (answer, index) => `
                <button
                  class="answer-btn"
                  data-answer="${answer}"
                  type="button"
                >

                  <span class="answer-key">
                    ${index + 1}
                  </span>

                  <span class="answer-text">
                    ${answer}
                  </span>

                </button>
              `
            )
            .join("")}

        </div>



        <div class="keyboard-hint">
          <i class="fa-regular fa-keyboard"></i>
          Press 1-${this.answers.length} to select
        </div>



        <div class="score-box">

          <span class="score-label">
            Score
          </span>

          <span class="score-value">
            ${this.currentScore}
          </span>

        </div>

      </div>
    `;

    this.startTimer(container);
    this.addEvents(container);
  }


  startTimer(container) {
    const timerVal = container.querySelector("#timerVal");

    this.timerInterval = setInterval(() => {
      this.timer--;

      if (timerVal) {
        timerVal.textContent = this.timer;
      }

      if (this.timer <= 0) {
        clearInterval(this.timerInterval);

        this.checkAnswer(null, container);
      }
    }, 1000);
  }


  addEvents(container) {
    const buttons = container.querySelectorAll(".answer-btn");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        this.checkAnswer(
          button.dataset.answer,
          container
        );
      });
    });


    this.keyHandler = (event) => {
      const keyNumber = parseInt(event.key);

      if (
        keyNumber >= 1 &&
        keyNumber <= this.answers.length
      ) {
        this.checkAnswer(
          this.answers[keyNumber - 1],
          container
        );
      }
    };

    window.addEventListener(
      "keydown",
      this.keyHandler
    );
  }


  checkAnswer(selectedAnswer, container) {
    clearInterval(this.timerInterval);

    window.removeEventListener(
      "keydown",
      this.keyHandler
    );


    const isCorrect =
      selectedAnswer === this.data.correct_answer;



    if (isCorrect) {
      this.correctSound.currentTime = 0;
      this.correctSound.play().catch(() => {});
    } else {
      this.wrongSound.currentTime = 0;
      this.wrongSound.play().catch(() => {});
    }



    const buttons =
      container.querySelectorAll(".answer-btn");

    buttons.forEach((button) => {
      button.classList.add("disabled");

      if (
        button.dataset.answer ===
        this.data.correct_answer
      ) {
        button.classList.add("correct");
      }

      if (
        selectedAnswer &&
        button.dataset.answer === selectedAnswer &&
        selectedAnswer !== this.data.correct_answer
      ) {
        button.classList.add("wrong");
      }
    });



    setTimeout(() => {
      this.onAnswerCallback(isCorrect);
    }, 1500);
  }
}