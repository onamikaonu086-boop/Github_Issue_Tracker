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
const loaderNode = document.querySelector(`[data-node="loader"]`);

// states
let filter = FILTER_OPTIONS.all;
let isLoading = false;
let allIssues = [];
let filteredIssues = [];

// main functionality --------------------------------
async function renderIssueInit() {
  loaderNode.classList.remove("hidden");
  allIssues = await fetchIssues();
  loaderNode.classList.add("hidden");
  applyFilter();
}

function applyFilter() {
  if (filter === FILTER_OPTIONS.all) {
    filteredIssues = allIssues;
  } else {
    filteredIssues = allIssues.filter((issue) => issue.status === filter);
  }

  renderIssues(filteredIssues);
  updateIssueCount();
  loaderNode.classList.add("hidden");
}

function updateIssueCount() {
  const issueCountNode = document.querySelector(`[data-count="issue"]`);
  if (issueCountNode) {
    issueCountNode.textContent = filteredIssues.length;
  }
}

// event handlers
// login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = e.target.username.value;
  const password = e.target.password.value;

  // Validate all inputs first
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

  // check if credentials are correct
  if (username !== USER_NAME || password !== PASSWORD) {
    loginFormErrorNode.innerHTML = `
    <p class="text-red-500 text-sm font-medium">Invalid Credentials, Please try again</p>
  `;

    return;
  }

  // All checks passed - render everything
  loginFormErrorNode.innerHTML = "";
  loginScreen.classList.add("hidden");
  issuesScreen.classList.remove("hidden");
  renderIssueInit();
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

    // Apply the filter to issues
    applyFilter();
  });
});

// search button
searchButton.addEventListener("click", async () => {
  const searchText = searchInput.value?.trim();

  loaderNode.classList.remove("hidden");

  if (!searchText) {
    // If search is empty, show all issues
    allIssues = await fetchIssues();
  } else {
    // If search has text, search for issues
    allIssues = await searchIssues(searchText);
  }

  filter = FILTER_OPTIONS.all;

  // Reset filter buttons to "All"
  filterButtons.forEach((filterButton) => {
    if (filterButton.dataset.filterType === FILTER_OPTIONS.all) {
      filterButton.classList.add(...ACTIVE_FILTER_CLASSES);
      filterButton.classList.remove(...INACTIVE_FILTER_CLASSES);
    } else {
      filterButton.classList.remove(...ACTIVE_FILTER_CLASSES);
      filterButton.classList.add(...INACTIVE_FILTER_CLASSES);
    }
  });

  loaderNode.classList.add("hidden");
  applyFilter();
});

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

async function searchIssues(searchText) {
  try {
    isLoading = true;
    const searchUrl = `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${encodeURIComponent(searchText)}`;
    const res = await fetch(searchUrl);
    const resData = await res.json();
    return resData?.data ?? [];
  } catch (error) {
    console.error("Error searching issues:", error);
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
      <div class="mt-auto flex flex-col gap-1 border- border-gray-100 pt-4">
        <p class="text-gray-500"># ${author}</p>
        <p class="text-gray-500">${new Date(createdAt)?.toLocaleDateString()}</p>
      </div>
    </div>
    `;
  });

  issuesNode.innerHTML = elements.join("");
}

function renderLoading() {
  return ``;
}
