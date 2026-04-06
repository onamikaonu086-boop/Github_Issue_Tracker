// variables

// documents
const loginScreen = document.querySelector(`[data-screen="login"]`);
const issuesScreen = document.querySelector(`[data-screen="issue"]`);
const loginForm = document.querySelector(`[data-form="login"]`);
const loginFormErrorNode = document.querySelector(`[data-error="login-form-error-node"]`);
const searchInput = document.querySelector(`[data-input="search"]`);
const searchButton = document.querySelector(`[data-button="search"]`);

// const variables
const USER_NAME = "admin";
const PASSWORD = "admin123";

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

// for now to show the issue screen without login, later we will remove this code and add the login functionality
loginScreen.classList.add("hidden");
issuesScreen.classList.remove("hidden");
