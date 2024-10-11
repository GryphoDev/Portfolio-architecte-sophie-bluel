import { loginUser } from "./api.js";
import { displayProjects, allProjects } from "./script.js";
// email: sophie.bluel@test.tld
// password: S0phie
const homePage = document.querySelector(".home-page");
const loginPage = document.querySelector(".login-container");

export function login() {
  document.querySelector(".logInOut").addEventListener("click", () => {
    if (localStorage.getItem("authToken")) {
      return;
    }
    homePage.classList.add("hidden");
    loginPage.classList.remove("hidden");
    formListener();
  });
  manageNavBtn();
}

function manageNavBtn() {
  const navBarBtn = document.querySelectorAll(".anchor");
  navBarBtn.forEach((btn) =>
    btn.addEventListener("click", () => {
      if (homePage.classList.contains("hidden")) {
        homePage.classList.remove("hidden");
        loginPage.classList.add("hidden");
      }
    })
  );
}

function formListener() {
  const email = document.getElementById("email");
  const password = document.getElementById("passeword");
  const form = document.querySelector(".login");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    fetchToken(email, password);
  });
}
async function fetchToken(email, password) {
  const token = await loginUser(email.value, password.value);
  if (token) {
    localStorage.setItem("authToken", token);
    homePage.classList.remove("hidden");
    loginPage.classList.add("hidden");
    editorPage();
  } else {
    alert("L'identifiant ou le mot de passe est incorrect");
  }
}

export function editorPage() {
  document.querySelector(".filter").classList.add("hidden");
  document.querySelector(".loginHeader").classList.remove("hidden");
  document.querySelector(".editionBtn").classList.remove("hidden");
  document.getElementById("projects").style.marginBottom = "92px";
  const logOut = document.querySelector(".logInOut");
  logOut.innerHTML = "logout";
  logOut.addEventListener("click", () => {
    closeEditorPage();
  });
}

function closeEditorPage() {
  displayProjects(allProjects);
  localStorage.removeItem("authToken");
  document.querySelector(".filter").classList.remove("hidden");
  document.querySelector(".loginHeader").classList.add("hidden");
  document.querySelector(".editionBtn").classList.add("hidden");
  document.getElementById("projects").style.marginBottom = "0px";
  const logOut = document.querySelector(".logInOut");
  logOut.innerHTML = "login";
}
