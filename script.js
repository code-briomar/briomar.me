const toggleBtn = document.getElementById("toggle-dark-mode");
const icon = toggleBtn.querySelector("i");

// Initialize dark mode on page load
document.body.classList.add("dark-mode");
toggleBtn.classList.add("dark");
icon.classList.remove("fa-sun");
icon.classList.add("fa-moon");

// Add click event listener
toggleBtn.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
  this.classList.toggle("dark");

  if (document.body.classList.contains("dark-mode")) {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
  } else {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  }
});