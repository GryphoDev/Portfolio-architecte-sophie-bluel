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
