export function validateFormContact() {
  document
    .getElementById("contactForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("email-contact").value;
      const message = document.getElementById("message").value;

      if (!name || !email || !message) {
        alert("Tous les champs sont requis !");
        return;
      }

      const mailtoLink = `mailto:sophie.bluel@test.tld?subject=Message de ${encodeURIComponent(
        name
      )}&body=${encodeURIComponent(
        `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      )}`;

      window.location.href = mailtoLink;
    });
}
