const target = new Date("2026-10-11T14:00:00-05:00").getTime();
const envelope = document.getElementById("envelope");
const openBtn = document.getElementById("openBtn");
const invitation = document.getElementById("invitation");

openBtn.addEventListener("click", () => {
  envelope.classList.add("open");
  setTimeout(() => {
    invitation.classList.add("show");
    invitation.scrollIntoView({behavior:"smooth"});
  }, 650);
});

function updateCountdown(){
  const diff = target - Date.now();
  const values = {
    days: Math.max(0, Math.floor(diff / 86400000)),
    hours: Math.max(0, Math.floor(diff / 3600000) % 24),
    minutes: Math.max(0, Math.floor(diff / 60000) % 60),
    seconds: Math.max(0, Math.floor(diff / 1000) % 60)
  };
  for(const [id,value] of Object.entries(values)){
    document.getElementById(id).textContent = String(value).padStart(2,"0");
  }
}
updateCountdown();
setInterval(updateCountdown,1000);
