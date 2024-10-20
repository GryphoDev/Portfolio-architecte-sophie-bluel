export async function manageTransitionAnimation(
  elementDisparition,
  elementApparition
) {
  return new Promise((resolve) => {
    elementDisparition.classList.add("fastDisparition");
    setTimeout(() => {
      elementDisparition.classList.remove("fastDisparition");
      elementDisparition.classList.add("hidden");
      elementApparition.classList.remove("hidden");
      resolve();
    }, 300);
  });
}
export function switchClass(
  elements = [],
  removeClasses = [],
  addClasses = []
) {
  elements.forEach((element) => {
    element.classList.remove(...removeClasses);
    element.classList.add(...addClasses);
  });
}
export function removeClasses(elements = [], removeClasses = []) {
  elements.forEach((element) => {
    element.classList.remove(...removeClasses);
  });
}
export function addClasses(elements = [], addClasses = []) {
  elements.forEach((element) => {
    element.classList.add(...addClasses);
  });
}
export function append(parent, childrens = []) {
  childrens.forEach((child) => {
    parent.appendChild(child);
  });
}
