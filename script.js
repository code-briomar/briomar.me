document
  .getElementById("toggle-dark-mode")
  .addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    this.classList.toggle("dark");

    const icon = this.querySelector("i");
    if (document.body.classList.contains("dark-mode")) {
      icon.classList.remove("fa-sun");
      icon.classList.add("fa-moon");
    } else {
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
    }
  });

document.body.classList.add("dark-mode");
toggleBtn.classList.add("dark");
icon.classList.remove("fa-sun");
icon.classList.add("fa-moon");
