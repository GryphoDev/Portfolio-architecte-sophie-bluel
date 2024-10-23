export function validateFormContact() {
  document
    .getElementById("contactForm")
    .addEventListener("submit", function (e) {
      e.preventDefault(); // Prevents default form submission
      const name = document.getElementById("name").value;
      const email = document.getElementById("email-contact").value;
      const message = document.getElementById("message").value;
      // Checks if all fields are filled
      if (!name || !email || !message) {
        console.log("Tous les champs sont requis");
        return; // Stops execution if any field is empty
      }
      // Creates a mailto link to send an email with form data
      const mailtoLink = `mailto:sophie.bluel@test.tld?subject=Message from ${encodeURIComponent(
        name
      )}&body=${encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      )}`;
      // Redirects to the mail app with the mailto link
      window.location.href = mailtoLink;
    });
}
