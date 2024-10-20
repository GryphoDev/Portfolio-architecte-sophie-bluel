import { callWorks, callLoginUser } from "./api.js";
import { displayAlert } from "./modalErrorMessage.js";
import { modalContainer } from "./modalRemoveWork.js";
import {
  manageTransitionAnimation,
  switchClass,
  removeClasses,
  addClasses,
} from "./utils.js";
import {
  createFiltersHomePage,
  clickFilterHomePage,
  displayProjectsHomePage,
} from "./script.js";

const homePage = document.querySelector(".home-page");
export const body = document.querySelector("body");
const portfolioTitle = document.querySelector(".portfolio-title h2");
const loginPage = document.querySelector(".login-container");
const logOutBtn = document.querySelector(".logInOut");
const loginHeader = document.querySelector(".loginHeader");
const editionBtn = document.querySelector(".editionBtn");
const filters = document.querySelector(".filter");
const form = document.querySelector(".login");

export function displayLoginPage() {
  document.querySelector(".logInOut").addEventListener("click", (e) => {
    if (e.currentTarget.innerHTML === "logout") return; // Prevent action if already logged out
    manageTransitionAnimation(homePage, loginPage); // Switch to login page
    addClasses([loginHeader, editionBtn, homePage], ["imageApparition"]);
    formListenerLoginPage(); // Add form listener
  });
  manageNavBtnWhenLog();
}

function manageNavBtnWhenLog() {
  const AllNavBarBtn = document.querySelectorAll(".anchor");
  AllNavBarBtn.forEach((btn) =>
    btn.addEventListener("click", async (event) => {
      event.preventDefault();
      if (loginPage.classList.contains("hidden"))
        window.location.href = btn.href;
      if (homePage.classList.contains("hidden")) {
        await manageTransitionAnimation(loginPage, homePage);
        window.location.href = btn.href;
      }
    })
  );
}

function formListenerLoginPage() {
  form.removeEventListener("submit", handleFormSubmit); // Ensure only one listener
  form.addEventListener("submit", handleFormSubmit);
  function handleFormSubmit(e) {
    const email = document.getElementById("email");
    const password = document.getElementById("passeword");
    e.preventDefault();
    fetchToken(email, password);
  }
}

async function fetchToken(email, password) {
  const token = await callLoginUser(email.value, password.value);
  if (token) {
    localStorage.setItem("authToken", token); // Save token
    await manageTransitionAnimation(loginPage, homePage);
    const works = await callWorks(); // Fetch projects
    displayProjectsHomePage(works);
    displayEditorPage();
  } else {
    displayAlert("L'identifiant ou le mot de passe est incorrect"); // Show error
  }
}

export function displayEditorPage() {
  removeClasses(
    [editionBtn],
    ["fastDisparition", "hidden", "visibilityHidden"]
  );
  portfolioTitle.classList.remove("translateRight");
  filters.classList.remove("scale");
  logOutBtn.removeAttribute("data-logout-attached");
  if (modalContainer.classList.contains("hidden")) {
    switchClass([body], ["translateTop"], ["translateBottom"]);
  }
  filters.classList.add("hidden");
  document.getElementById("projects").style.marginBottom = "92px";
  logOutBtn.innerHTML = "logout";
  if (!logOutBtn.hasAttribute("data-logout-attached")) {
    logOutBtn.addEventListener("click", async () => {
      const newProjects = await callWorks(); // Refresh projects
      displayProjectsHomePage(newProjects);
      createFiltersHomePage();
      clickFilterHomePage(newProjects);
      closeEditorPage(); // Logout
    });
    logOutBtn.setAttribute("data-logout-attached", "true");
  }
}

async function closeEditorPage() {
  body.style.marginTop = "-59px";
  localStorage.removeItem("authToken"); // Logout and remove token
  switchClass([editionBtn], ["hidden"], ["fastDisparition"]);
  switchClass([body], ["translateBottom"], ["translateTop"]);
  switchClass([filters], ["hidden"], ["scale"]);
  portfolioTitle.classList.add("translateRight");
  logOutBtn.innerHTML = "login";
  document.getElementById("projects").style.marginBottom = "0px";
  setTimeout(() => {
    editionBtn.classList.add("visibilityHidden");
  }, 200);
}
