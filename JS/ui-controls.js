function initCustomSelects() {
  document.querySelectorAll(".custom-select").forEach((select) => {
    const trigger = select.querySelector(".custom-select-trigger");
    const options = select.querySelectorAll(".custom-select-option");
    const hiddenInput = select.parentElement.querySelector(
      'input[type="hidden"]'
    );
    const textSpan = trigger.querySelector(".custom-select-text");

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();

      document
        .querySelectorAll(".custom-select.open")
        .forEach((otherSelect) => {
          if (otherSelect !== select) {
            otherSelect.classList.remove("open");
          }
        });

      select.classList.toggle("open");
    });

    options.forEach((option) => {
      option.addEventListener("click", (event) => {
        event.stopPropagation();

        const value = option.dataset.value;
        const text = option.textContent.trim();

        if (hiddenInput) {
          hiddenInput.value = value;
        }

        if (textSpan) {
          textSpan.textContent = text;
        }

        options.forEach((item) => {
          item.classList.remove("selected");
        });

        option.classList.add("selected");

        select.classList.remove("open");
      });
    });
  });
}


function initNumberInputs() {
  document.querySelectorAll(".number-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const wrapper = button.closest(".number-input-wrapper");

      if (!wrapper) return;

      const input = wrapper.querySelector('input[type="number"]');

      if (!input) return;

      const min = parseInt(input.min) || 1;
      const max = parseInt(input.max) || 50;

      let value = parseInt(input.value) || min;

      if (button.dataset.action === "increment") {
        if (value < max) {
          value++;
        }
      }

      if (button.dataset.action === "decrement") {
        if (value > min) {
          value--;
        }
      }

      input.value = value;
    });
  });
}


function initClickOutside() {
  document.addEventListener("click", () => {
    document
      .querySelectorAll(".custom-select.open")
      .forEach((select) => {
        select.classList.remove("open");
      });
  });
}


document.addEventListener("DOMContentLoaded", () => {
  initCustomSelects();
  initNumberInputs();
  initClickOutside();
});