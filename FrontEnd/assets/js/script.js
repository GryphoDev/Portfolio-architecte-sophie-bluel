import { callWorks, callCategory } from "./api.js";
import { modal } from "./modal.js";
import { login, editorPage } from "./logIn.js";

// Fetch all projects and categories from the API
export async function fetchProjects() {
  const allProjects = await callWorks();
  displayProjects(allProjects);
  console.log(allProjects);
  return allProjects;
}
const allCategory = await callCategory();

// Function to display selected projects in the gallery
export function displayProjects(projectsSelected) {
  const token = localStorage.getItem("authToken");
  if (token) {
    editorPage();
  }
  document.querySelector(".gallery").innerHTML = ""; // Clear gallery
  projectsSelected.forEach((element) => {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    const title = document.createElement("figcaption");

    image.src = element.imageUrl; // Set project image
    title.innerHTML = element.title; // Set project title

    figure.appendChild(image);
    figure.appendChild(title);

    document.querySelector(".gallery").appendChild(figure); // Append project to gallery
  });
}

// Function to create filter buttons for each category
export function createFilters() {
  const filters = document.querySelector(".filter");
  filters.innerHTML = "";

  const filterAll = document.createElement("button");
  filterAll.innerHTML = "Tous"; // "All" filter button
  filterAll.setAttribute("data-index", "all");
  filterAll.classList.add("button_active"); // Default active button
  filters.appendChild(filterAll);
  allCategory.forEach((category) => {
    const filter = document.createElement("button");
    filter.innerHTML = category.name; // Set category name on button
    filter.setAttribute("data-index", category.id); // Set category id on button
    document.querySelector(".filter").appendChild(filter); // Append button to filter container
  });
}

// Function to handle filter button click events
export async function clickFilter() {
  const allButtons = document.querySelectorAll("nav button"); // Get all filter buttons

  allButtons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      buttonStatus(allButtons, button); // Manage button states (active/disabled)
      const id = e.target.getAttribute("data-index");
      if (id === "all") {
        fetchProjects(); // Show all projects
      } else {
        const allProjects = await fetchProjects();
        const projectsSelected = allProjects.filter(
          (project) => project.categoryId === parseInt(id) // Filter projects by category
        );
        displayProjects(projectsSelected); // Show filtered projects
      }
    });
  });
}
// Function to manage button active state and disable the clicked button
export function buttonStatus(allButtons, button) {
  allButtons.forEach((btn) => {
    btn.classList.remove("button_active"); // Remove active class from all buttons
    btn.disabled = false; // Enable all buttons
  });
  button.classList.add("button_active"); // Add active class to clicked button
  button.disabled = true; // Disable clicked button
}
// function to check if user is login

// Initial display of all projects and setup of filters

export async function init() {
  login();
  fetchProjects();
  createFilters();
  clickFilter();
  modal();
}
init();
