import { Quiz } from "./quiz.js";

const quizOptions = document.getElementById("quizOptions");
const questionsContainer = document.getElementById("questionsContainer");

quizOptions.addEventListener("submit", async (event) => {
  event.preventDefault();

  const category =
    document.getElementById("categoryMenu").value;

  const difficulty =
    document.getElementById("difficultyOptions").value;

  const amount =
    document.getElementById("questionsNumber").value || 10;


  questionsContainer.innerHTML = `
    <div class="loading-overlay">
      <div class="loading-spinner"></div>
      <p class="loading-text">Loading Questions...</p>
    </div>
  `;

  quizOptions.style.display = "none";


  const url =
    `https://opentdb.com/api.php?amount=${amount}` +
    `${category ? `&category=${category}` : ""}` +
    `&difficulty=${difficulty}`;


  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }

    const data = await response.json();


    if (data.results && data.results.length > 0) {
      new Quiz(data.results);
    } else {
      showError();
    }

  } catch (error) {
    console.error(error);
    showError();
  }
});


function showError() {
  questionsContainer.innerHTML = `
    <div class="game-card error-card">

      <i class="fa-solid fa-triangle-exclamation"></i>

      <h3 class="error-title">
        Oops! Something went wrong
      </h3>

      <p>
        We couldn't load the questions. Please try again.
      </p>

      <button
        class="btn-restart retry-btn"
        id="retryQuiz"
        type="button"
      >
        <i class="fa-solid fa-arrow-left"></i>
        Try Again
      </button>

    </div>
  `;


  document
    .getElementById("retryQuiz")
    .addEventListener("click", () => {
      location.reload();
    });
}