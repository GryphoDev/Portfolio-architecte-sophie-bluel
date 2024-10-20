import { callWorks, callCategory } from "./api.js";
import { manageModalDisplay } from "./modalRemoveWork.js";
import { displayLoginPage, displayEditorPage } from "./logIn.js";
import { validateFormContact } from "./formContact.js";
import { append } from "./utils.js";

// Fetches all projects and categories
export const allProjects = await callWorks();
const allCategory = await callCategory();

// Displays selected projects on the homepage
export function displayProjectsHomePage(projectsSelected) {
  const token = localStorage.getItem("authToken");
  if (token) {
    displayEditorPage();
  }
  document.querySelector(".gallery").innerHTML = "";
  projectsSelected.forEach((element) => {
    const figure = document.createElement("figure");
    figure.classList.add("imageApparition");
    const workImage = document.createElement("img");
    const workTitle = document.createElement("figcaption");
    workImage.src = element.imageUrl;
    workTitle.innerHTML = element.title;
    append(figure, [workImage, workTitle]);
    document.querySelector(".gallery").appendChild(figure);
  });
}

// Creates filter buttons for categories
export function createFiltersHomePage() {
  const filters = document.querySelector(".filter");
  filters.innerHTML = "";
  const filterAllWorks = document.createElement("button");
  filterAllWorks.innerHTML = "Tous"; // Filter for all works
  filterAllWorks.setAttribute("data-index", "all");
  filterAllWorks.classList.add("button_active");
  filters.appendChild(filterAllWorks);
  // Create a button for each category
  allCategory.forEach((category) => {
    const filter = document.createElement("button");
    filter.innerHTML = category.name;
    filter.setAttribute("data-index", category.id);
    document.querySelector(".filter").appendChild(filter);
  });
}

// Handles filter button click events
export async function clickFilterHomePage(projects) {
  const AllFilterBtn = document.querySelectorAll("nav button");
  AllFilterBtn.forEach((filter) => {
    filter.addEventListener("click", async (e) => {
      filterBtnClassStatus(AllFilterBtn, filter);
      const id = e.target.getAttribute("data-index");
      // Display projects based on the selected filter
      if (id === "all") {
        displayProjectsHomePage(projects);
      } else {
        const projectsSelected = projects.filter(
          (project) => project.categoryId === parseInt(id)
        );
        displayProjectsHomePage(projectsSelected);
      }
    });
  });
}

// Updates active filter button and disables it
export function filterBtnClassStatus(AllFilterBtn, filter) {
  AllFilterBtn.forEach((btn) => {
    btn.classList.remove("button_active");
    btn.disabled = false;
  });
  filter.classList.add("button_active");
  filter.disabled = true;
}

// Initializes the page with default view and behaviors
export async function init() {
  displayLoginPage();
  displayProjectsHomePage(allProjects);
  createFiltersHomePage();
  clickFilterHomePage(allProjects);
  manageModalDisplay();
  validateFormContact();
}
init();
