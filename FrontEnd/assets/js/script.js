import { callWorks, callCategory } from "./api.js";
import { manageModalDisplay } from "./modalRemoveWork.js";
import { displayLoginPage, displayEditorPage } from "./logIn.js";
import { validateFormContact } from "./formContact.js";
import { append } from "./utils.js";
const sectionGallery = document.querySelector(".gallery");
const sectionFilter = document.querySelector(".filter");
// Fetches all projects and categories
export const allProjects = await callWorks();
const allCategory = await callCategory();

// Displays selected projects on the homepage
export function displayProjectsHomePage(projectsSelected) {
  sectionGallery.innerHTML = "";
  const token = localStorage.getItem("authToken");
  if (token) displayEditorPage();
  projectsSelected.forEach((element) => {
    const figure = Object.assign(document.createElement("figure"), {
      className: "imageApparition",
    });
    const workImage = Object.assign(document.createElement("img"), {
      src: element.imageUrl,
    });
    const workTitle = Object.assign(document.createElement("figcaption"), {
      innerHTML: element.title,
    });
    append(figure, [workImage, workTitle]);
    append(sectionGallery, [figure]);
  });
}

// Creates filter buttons for categories
export function createFiltersHomePage() {
  sectionFilter.innerHTML = "";
  // Filter for all works
  const filterAllWorks = Object.assign(document.createElement("button"), {
    innerHTML: "Tous",
    className: "button_active",
  });
  filterAllWorks.dataset.index = "all";
  append(sectionFilter, [filterAllWorks]);
  // Create a button for each category
  allCategory.forEach((category) => {
    const filter = Object.assign(document.createElement("button"), {
      innerHTML: category.name,
    });
    filter.dataset.index = category.id;
    append(sectionFilter, [filter]);
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
        displayProjectsHomePage(
          projects.filter((project) => project.categoryId === parseInt(id))
        );
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
  displayProjectsHomePage(allProjects);
  createFiltersHomePage();
  clickFilterHomePage(allProjects);
  displayLoginPage();
  manageModalDisplay();
  validateFormContact();
}
init();
