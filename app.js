// variables

// documents
const loginScreen = document.querySelector(`[data-screen="login"]`);
const loginForm = document.querySelector(`[data-form="login"]`);
const loginFormErrorNode = document.querySelector(`[data-error="login-form-error-node"]`);

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
  }

  loginFormErrorNode.innerHTML = `
    <p class="text-red-500 text-sm font-medium">Invalid Credentials, Please try again</p>
  `;
});
