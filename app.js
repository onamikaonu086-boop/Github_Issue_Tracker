// variables ----------------------------------------
// const variables
const USER_NAME = "admin";
const PASSWORD = "admin123";

const FILTER_OPTIONS = {
  all: "all",
  open: "open",
  closed: "closed",
};

const API_URL = {
  allIssues: `https://phi-lab-server.vercel.app/api/v1/lab/issues`,
};

// elements
const loginScreen = document.querySelector(`[data-screen="login"]`);
const issuesScreen = document.querySelector(`[data-screen="issue"]`);
const loginForm = document.querySelector(`[data-form="login"]`);
const loginFormErrorNode = document.querySelector(`[data-error="login-form-error-node"]`);
const searchInput = document.querySelector(`[data-input="search"]`);
const searchButton = document.querySelector(`[data-button="search"]`);
const filterButtons = document.querySelectorAll(`[data-button="filter"]`);
const issuesNode = document.querySelector(`[data-node="issues"]`);

// states
let filter = FILTER_OPTIONS.all;
let isLoading = false;
let allIssues = [];
let filteredIssues = [];

// main functionality --------------------------------
async function renderIssueInit() {
  const allIssues = await fetchIssues();
  renderIssues(allIssues);
}

renderIssueInit();

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
    return;
  }

  loginFormErrorNode.innerHTML = `
    <p class="text-red-500 text-sm font-medium">Invalid Credentials, Please try again</p>
  `;
});

// click on filter buttons
const ACTIVE_FILTER_CLASSES = ["bg-[#4A00FF]", "text-white"];
const INACTIVE_FILTER_CLASSES = ["text-gray-500"];

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

// helper functions ----------------------------------
async function fetchIssues() {
  try {
    isLoading = true;
    const res = await fetch(API_URL.allIssues);
    const resData = await res.json();
    return resData?.data ?? [];
  } catch (error) {
    console.error("Error fetching issues:", error);
    return [];
  } finally {
    isLoading = false;
  }
}

function renderIssues(issues) {
  const elements = issues.map((issue) => {
    const { status, priority, title, description, labels, author, createdAt } = issue ?? {};

    const borderColor = status === "open" ? "border-t-[#00A96E]" : "border-t-[#A855F7]";
    const src = status === "open" ? "/assets/Open-Status.png" : "/assets/Closed-Status.png";

    const priorityClass =
      priority === "high"
        ? "bg-[#FEECEC] text-[#EF4444]"
        : priority === "medium"
          ? "bg-[#FEF3C7] text-[#D97706]"
          : "bg-[#E2E8F0] text-[#475569]";

    const labelsElements = (labels ?? []).map((label) => {
      return /* html */ `
      <span class="text-xs border font-medium px-2 py-0.5 rounded-full uppercase border-[#FDE68A] bg-[#FFF8DB] text-[#D97706]">${label}</span>
      `;
    });

    return /* html */ `
    <div class="bg-white p-4 rounded-md border border-gray-100 shadow-md border-t-4 h-full flex flex-col ${borderColor}">
      <header class="flex items-center gap-4 justify-between">
        <img src="${src}" alt="Status-${status === "open" ? "Open" : "Closed"}" />
        <p class="uppercase rounded-full w-20 py-0.5 text-center text-sm ${priorityClass}">${priority}</p>
      </header>
      <div class="mt-4 space-y-2">
        <h2 class="text-xl font-semibold">${title}</h2>
        <p class="text-gray-500">${description}</p>
      </div>
      <div class="my-4 flex flex-wrap gap-2">
        ${labelsElements.join("")}
      </div>
      <div class="mt-auto flex flex-col gap-1 border-t border-gray-100 pt-4">
        <p class="text-gray-500"># ${author}</p>
        <p class="text-gray-500">${new Date(createdAt)?.toLocaleDateString()}</p>
      </div>
    </div>
    `;
  });

  issuesNode.innerHTML = elements.join("");
}

function renderLoading() {}

// fetchIssues();
