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
const modalBackdrop = document.querySelector(`[data-node="modal-backdrop"]`);
const closeModalButtons = document.querySelectorAll(`[data-button="close-modal"]`);

// states
let filter = FILTER_OPTIONS.all;
let isLoading = false;
let allIssues = [];
let filteredIssues = [];
let selectedIssue = null;

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

async function fetchIssueById(id) {
  try {
    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
    const resData = await res.json();
    return resData?.data ?? null;
  } catch (error) {
    console.error("Error fetching issue details:", error);
    return null;
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
  const elements = issues.map((issue, index) => {
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
    <div class="bg-white p-4 rounded-md border border-gray-100 shadow-md border-t-4 h-full flex flex-col ${borderColor} cursor-pointer hover:shadow-lg transition-shadow" data-issue-index="${index}">
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

  // Add click handlers to cards
  const cards = document.querySelectorAll(`[data-issue-index]`);
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const index = parseInt(card.dataset.issueIndex);
      openModal(filteredIssues[index]);
    });
  });
}

function renderLoading() {
  return ``;
}

// Modal functions
async function openModal(issue) {
  selectedIssue = issue;

  // Show modal and loader
  modalBackdrop.classList.remove("hidden");
  modalBackdrop.classList.add("flex");
  document.body.style.overflow = "hidden";

  const loaderElement = document.querySelector(`[data-modal="loader"]`);
  const contentElement = document.querySelector(`[data-modal="content"]`);

  // Show loader, hide content
  loaderElement.classList.remove("hidden");
  contentElement.classList.add("hidden");

  // Fetch full issue data by ID
  const fullIssue = await fetchIssueById(issue.id);

  if (!fullIssue) {
    contentElement.innerHTML = `<p class="text-red-500">Failed to load issue details</p>`;
    loaderElement.classList.add("hidden");
    contentElement.classList.remove("hidden");
    return;
  }

  // Populate modal with issue data
  document.querySelector(`[data-modal="title"]`).textContent = fullIssue.title;
  document.querySelector(`[data-modal="description"]`).textContent = fullIssue.description;
  document.querySelector(`[data-modal="author"]`).textContent = fullIssue.author;
  document.querySelector(`[data-modal="created-date"]`).textContent = new Date(
    fullIssue.createdAt,
  ).toLocaleDateString();
  document.querySelector(`[data-modal="assignee"]`).textContent = fullIssue.author || "N/A";

  // Set priority
  const priorityElement = document.querySelector(`[data-modal="priority"]`);
  const priorityClass =
    fullIssue.priority === "high"
      ? "bg-[#FEECEC] text-[#EF4444]"
      : fullIssue.priority === "medium"
        ? "bg-[#FEF3C7] text-[#D97706]"
        : "bg-[#E2E8F0] text-[#475569]";
  priorityElement.textContent = fullIssue.priority?.toUpperCase() || "LOW";
  priorityElement.className = `inline-block px-3 py-1 rounded-full text-sm font-semibold ${priorityClass}`;

  // Set status icon
  const statusIcon = document.querySelector(`[data-modal="status-icon"]`);
  statusIcon.src = fullIssue.status === "open" ? "/assets/Open-Status.png" : "/assets/Closed-Status.png";

  // Set labels
  const labelsContainer = document.querySelector(`[data-modal="labels-container"]`);
  const labelsElement = document.querySelector(`[data-modal="labels"]`);
  if (fullIssue.labels && fullIssue.labels.length > 0) {
    labelsContainer.classList.remove("hidden");
    labelsElement.innerHTML = (fullIssue.labels ?? [])
      .map(
        (label) =>
          `<span class="text-xs border font-medium px-2 py-0.5 rounded-full uppercase border-[#FDE68A] bg-[#FFF8DB] text-[#D97706]">${label}</span>`,
      )
      .join("");
  } else {
    labelsContainer.classList.add("hidden");
  }

  // Hide loader, show content
  loaderElement.classList.add("hidden");
  contentElement.classList.remove("hidden");
}

function closeModal() {
  modalBackdrop.classList.add("hidden");
  modalBackdrop.classList.remove("flex");
  document.body.style.overflow = "";
  selectedIssue = null;
}

// Modal event listeners
closeModalButtons.forEach((button) => {
  button.addEventListener("click", closeModal);
});

modalBackdrop.addEventListener("click", (e) => {
  if (e.target === modalBackdrop) {
    closeModal();
  }
});
