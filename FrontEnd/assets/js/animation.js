export async function manageTransitionAnimation(
  elementDisparition,
  elementApparition
) {
  return new Promise((resolve) => {
    elementDisparition.classList.add("imageDisparition");
    setTimeout(() => {
      elementDisparition.classList.remove("imageDisparition");
      elementDisparition.classList.add("hidden");
      elementApparition.classList.remove("hidden");
      resolve();
    }, 300);
  });
}
