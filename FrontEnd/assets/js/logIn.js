import { manageTransitionAnimation } from "./animation.js";
import { callWorks, callLoginUser } from "./api.js";
import {
  createFiltersHomePage,
  clickFilterHomePage,
  displayProjectsHomePage,
} from "./script.js";

const homePage = document.querySelector(".home-page");
const body = document.querySelector("body");
const portfolioTitle = document.querySelector(".portfolio-title h2");
const loginPage = document.querySelector(".login-container");
const logOutBtn = document.querySelector(".logInOut");
const loginHeader = document.querySelector(".loginHeader");
const editionBtn = document.querySelector(".editionBtn");
const filters = document.querySelector(".filter");

export function displayLoginPage() {
  document.querySelector(".logInOut").addEventListener("click", (e) => {
    if (e.currentTarget.innerHTML === "logout") {
      return;
    }
    manageTransitionAnimation(homePage, loginPage);
    loginHeader.classList.add("imageApparition");
    editionBtn.classList.add("imageApparition");
    homePage.classList.add("imageApparition");
    formListenerLoginPage();
  });
  manageNavBtnWhenLog();
}

function manageNavBtnWhenLog() {
  const AllNavBarBtn = document.querySelectorAll(".anchor");
  AllNavBarBtn.forEach((btn) =>
    btn.addEventListener("click", async (event) => {
      event.preventDefault();
      if (loginPage.classList.contains("hidden")) {
        window.location.href = btn.href;
      }
      if (homePage.classList.contains("hidden")) {
        await manageTransitionAnimation(loginPage, homePage);
        window.location.href = btn.href;
      }
    })
  );
}

function formListenerLoginPage() {
  const email = document.getElementById("email");
  const password = document.getElementById("passeword");
  const form = document.querySelector(".login");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    fetchToken(email, password);
  });
}

async function fetchToken(email, password) {
  const token = await callLoginUser(email.value, password.value);
  if (token) {
    localStorage.setItem("authToken", token);
    await manageTransitionAnimation(loginPage, homePage);
    const works = await callWorks();
    displayProjectsHomePage(works);
    displayEditorPage();
  } else {
    alert("L'identifiant ou le mot de passe est incorrect");
  }
}

export function displayEditorPage() {
  portfolioTitle.classList.remove("translateRight");
  editionBtn.classList.remove("imageDisparition");
  editionBtn.classList.remove("hidden");
  editionBtn.classList.remove("visibilityHidden");
  logOutBtn.removeAttribute("data-logout-attached");
  filters.classList.remove("scale");
  body.classList.remove("translateTop");
  body.classList.add("translateBottom");
  filters.classList.add("hidden");
  document.getElementById("projects").style.marginBottom = "92px";
  logOutBtn.innerHTML = "logout";
  if (!logOutBtn.hasAttribute("data-logout-attached")) {
    logOutBtn.addEventListener("click", async () => {
      const newProjects = await callWorks();
      displayProjectsHomePage(newProjects);
      createFiltersHomePage();
      clickFilterHomePage(newProjects);
      closeEditorPage();
    });
    logOutBtn.setAttribute("data-logout-attached", "true");
  }
}

async function closeEditorPage() {
  localStorage.removeItem("authToken");
  editionBtn.classList.remove("hidden");
  editionBtn.classList.add("visibilityHidden");
  editionBtn.classList.add("imageDisparition");
  body.classList.remove("translateBottom");
  body.classList.add("translateTop");
  filters.classList.remove("hidden");
  filters.classList.add("scale");
  portfolioTitle.classList.add("translateRight");
  logOutBtn.innerHTML = "login";
  document.getElementById("projects").style.marginBottom = "0px";
}
