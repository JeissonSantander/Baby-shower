// ===============================
// CONFIGURACIÓN DE LA INVITACIÓN
// ===============================
// Cambia esta fecha por la fecha real del Baby Shower.
// Formato: AAAA-MM-DDTHH:MM:SS
const eventDate = new Date("2026-10-25T16:00:00");

const openButton = document.getElementById("openInvite");
const invitation = document.getElementById("invitation");

openButton.addEventListener("click", () => {
  invitation.classList.remove("hidden");
  setTimeout(() => {
    invitation.scrollIntoView({ behavior: "smooth" });
    observeSections();
  }, 80);
});

function updateCountdown() {
  const now = new Date();
  const difference = eventDate - now;

  const days = document.getElementById("days");
  const hours = document.getElementById("hours");
  const minutes = document.getElementById("minutes");
  const seconds = document.getElementById("seconds");

  if (difference <= 0) {
    days.textContent = "00";
    hours.textContent = "00";
    minutes.textContent = "00";
    seconds.textContent = "00";
    return;
  }

  days.textContent = String(Math.floor(difference / 86400000)).padStart(2, "0");
  hours.textContent = String(Math.floor((difference / 3600000) % 24)).padStart(2, "0");
  minutes.textContent = String(Math.floor((difference / 60000) % 60)).padStart(2, "0");
  seconds.textContent = String(Math.floor((difference / 1000) % 60)).padStart(2, "0");
}

setInterval(updateCountdown, 1000);
updateCountdown();

function observeSections() {
  const items = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.12 });

  items.forEach(item => observer.observe(item));
}