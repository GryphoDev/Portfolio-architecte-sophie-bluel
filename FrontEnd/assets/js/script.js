import { callWorks, callCategory } from "./api.js";
import { manageModalDisplay } from "./modalRemoveWork.js";
import { displayLoginPage, displayEditorPage } from "./logIn.js";

export const allProjects = await callWorks();
const allCategory = await callCategory();

// Function to display selected projects in the gallery
export function displayProjectsHomePage(projectsSelected) {
  const token = localStorage.getItem("authToken");
  if (token) {
    displayEditorPage();
  }
  document.querySelector(".gallery").innerHTML = ""; // Clear gallery
  projectsSelected.forEach((element) => {
    const figure = document.createElement("figure");
    figure.classList.add("imageApparition");
    const workImage = document.createElement("img");
    const workTitle = document.createElement("figcaption");

    workImage.src = element.imageUrl; // Set project image
    workTitle.innerHTML = element.title; // Set project title

    figure.appendChild(workImage);
    figure.appendChild(workTitle);

    document.querySelector(".gallery").appendChild(figure); // Append project to gallery
  });
}

// Function to create filter buttons for each category
export function createFiltersHomePage() {
  const filters = document.querySelector(".filter");
  filters.innerHTML = "";

  const filterAllWorks = document.createElement("button");
  filterAllWorks.innerHTML = "Tous"; // "All" filter button
  filterAllWorks.setAttribute("data-index", "all");
  filterAllWorks.classList.add("button_active"); // Default active button
  filters.appendChild(filterAllWorks);
  allCategory.forEach((category) => {
    const filter = document.createElement("button");
    filter.innerHTML = category.name; // Set category name on button
    filter.setAttribute("data-index", category.id); // Set category id on button
    document.querySelector(".filter").appendChild(filter); // Append button to filter container
  });
}

// Function to handle filter button click events
export async function clickFilterHomePage(projects) {
  const AllFilterBtn = document.querySelectorAll("nav button"); // Get all filter buttons

  AllFilterBtn.forEach((filter) => {
    filter.addEventListener("click", async (e) => {
      filterBtnClassStatus(AllFilterBtn, filter); // Manage button states (active/disabled)
      const id = e.target.getAttribute("data-index");
      if (id === "all") {
        displayProjectsHomePage(projects);
      } else {
        const projectsSelected = projects.filter(
          (project) => project.categoryId === parseInt(id) // Filter projects by category
        );
        displayProjectsHomePage(projectsSelected); // Show filtered projects
      }
    });
  });
}
// Function to manage button active state and disable the clicked button
export function filterBtnClassStatus(AllFilterBtn, filter) {
  AllFilterBtn.forEach((btn) => {
    btn.classList.remove("button_active"); // Remove active class from all buttons
    btn.disabled = false; // Enable all buttons
  });
  filter.classList.add("button_active"); // Add active class to clicked button
  filter.disabled = true; // Disable clicked button
}

// Initial display of all projects and setup of filters

export async function init() {
  displayLoginPage();
  displayProjectsHomePage(allProjects);
  createFiltersHomePage();
  clickFilterHomePage(allProjects);
  manageModalDisplay();
}
init();
