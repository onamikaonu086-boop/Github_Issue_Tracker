// variables ----------------------------------------
// const variables
const USER_NAME = "admin";
const PASSWORD = "admin123";

const FILTER_OPTIONS = {
  all: "all",
  open: "open",
  closed: "closed",
};

// elements
const loginScreen = document.querySelector(`[data-screen="login"]`);
const issuesScreen = document.querySelector(`[data-screen="issue"]`);
const loginForm = document.querySelector(`[data-form="login"]`);
const loginFormErrorNode = document.querySelector(`[data-error="login-form-error-node"]`);
const searchInput = document.querySelector(`[data-input="search"]`);
const searchButton = document.querySelector(`[data-button="search"]`);
const filterButtons = document.querySelectorAll(`[data-button="filter"]`);

// states
let filter = FILTER_OPTIONS.all;
const ACTIVE_FILTER_CLASSES = ["bg-[#4A00FF]", "text-white"];
const INACTIVE_FILTER_CLASSES = ["text-gray-500"];

// event handlers
// login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = e.target.username.value;
  const password = e.target.password.value;

  if (!username?.trim()) {
    loginFormErrorNode.innerHTML = `
    <p class="text-red-500 text-sm font-medium">Please Add User Name</p>
  `;
    return;
  }

  if (!password?.trim()) {
    loginFormErrorNode.innerHTML = `
    <p class="text-red-500 text-sm font-medium">Please Add User Password</p>
  `;
    return;
  }

  if (username === USER_NAME && password === PASSWORD) {
    loginScreen.classList.add("hidden");
    issuesScreen.classList.remove("hidden");
  }

  loginFormErrorNode.innerHTML = `
    <p class="text-red-500 text-sm font-medium">Invalid Credentials, Please try again</p>
  `;
});

// click on filter buttons
filterButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const selectedFilter = e.currentTarget.dataset.filterType;
    filter = selectedFilter;

    filterButtons.forEach((filterButton) => {
      const isSelected = filterButton.dataset.filterType === selectedFilter;

      if (isSelected) {
        filterButton.classList.add(...ACTIVE_FILTER_CLASSES);
        filterButton.classList.remove(...INACTIVE_FILTER_CLASSES);
        return;
      }

      filterButton.classList.remove(...ACTIVE_FILTER_CLASSES);
      filterButton.classList.add(...INACTIVE_FILTER_CLASSES);
    });
  });
});

// for now to show the issue screen without login, later we will remove this code and add the login functionality
loginScreen.classList.add("hidden");
issuesScreen.classList.remove("hidden");
