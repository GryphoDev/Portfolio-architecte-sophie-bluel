import { callWorks, callLoginUser } from "./api.js";
import {
  createFiltersHomePage,
  clickFilterHomePage,
  displayProjectsHomePage,
} from "./script.js";

const homePage = document.querySelector(".home-page");
const loginPage = document.querySelector(".login-container");
const logOutBtn = document.querySelector(".logInOut");

export function displayLoginPage() {
  document.querySelector(".logInOut").addEventListener("click", (e) => {
    if (e.currentTarget.innerHTML === "logout") {
      return;
    }
    homePage.classList.add("hidden");
    loginPage.classList.remove("hidden");
    formListenerLoginPage();
  });
  manageNavBtnWhenLog();
}

function manageNavBtnWhenLog() {
  const AllNavBarBtn = document.querySelectorAll(".anchor");
  AllNavBarBtn.forEach((btn) =>
    btn.addEventListener("click", () => {
      if (homePage.classList.contains("hidden")) {
        homePage.classList.remove("hidden");
        loginPage.classList.add("hidden");
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
    homePage.classList.remove("hidden");
    loginPage.classList.add("hidden");
    const works = await callWorks();
    displayProjectsHomePage(works);
    displayEditorPage();
  } else {
    alert("L'identifiant ou le mot de passe est incorrect");
  }
}

export function displayEditorPage() {
  document.querySelector(".filter").classList.add("hidden");
  document.querySelector(".loginHeader").classList.remove("hidden");
  document.querySelector(".editionBtn").classList.remove("hidden");
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
  document.querySelector(".filter").classList.remove("hidden");
  document.querySelector(".loginHeader").classList.add("hidden");
  document.querySelector(".editionBtn").classList.add("hidden");
  document.getElementById("projects").style.marginBottom = "0px";
  logOutBtn.innerHTML = "login";
  logOutBtn.removeAttribute("data-logout-attached");
}
