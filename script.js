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

const tagStyles = {
  "Document Tools": { bg: "#e0f2fe", text: "#0369a1" },
  "Retail": { bg: "#fef3c7", text: "#92400e" },
  "Developer Tools": { bg: "#ede9fe", text: "#5b21b6" },
  "Customer Service": { bg: "#dcfce7", text: "#166534" },
  "AI Tools": { bg: "#fff7ed", text: "#9a3412" },
  "Healthcare": { bg: "#fce7f3", text: "#9d174d" },
  "Payments": { bg: "#ecfeff", text: "#155e75" },
  "Sports": { bg: "#fee2e2", text: "#991b1b" },
  "Business Tools": { bg: "#e0e7ff", text: "#3730a3" }
};

const timelineData = {
  2025: [
    {
      date: "Feb 24",
      title: "PDF to Word Converter",
      link: "./scanned-pdf-to-word/index.html",
      repo_link: "",
      description: "Turn scanned documents into editable Word files automatically.",
      tags: ["Document Tools"]
    }
  ],

  2024: [
    {
      date: "Jan 12",
      title: "Shop Cash Register System",
      description: "Complete system for stores to process sales and accept payments.",
      tags: ["Retail"]
    },
    {
      date: "Jun 18",
      title: "San Code Online Editor",
      description: "Write and edit code directly in your web browser.",
      tags: ["Developer Tools"]
    },
    {
      date: "Jun 22",
      title: "Chatbot Builder",
      description: "Tool to create automated chat assistants for websites.",
      tags: ["Customer Service"]
    },
    {
      date: "Jul 2",
      title: "AI Chat Integration",
      description: "Connect Google's AI assistant to chat applications.",
      tags: ["AI Tools"]
    },
    {
      date: "Aug 1",
      title: "Hospital Finder Map",
      description: "Interactive map showing all major hospitals in Kenya.",
      tags: ["Healthcare"]
    },
    {
      date: "Aug 17",
      title: "M-Pesa Payment System",
      description: "Accept mobile money payments from customers.",
      tags: ["Payments"]
    },
    {
      date: "Sep 21",
      title: "Fantasy Football Helper",
      description: "Get recommendations for your fantasy sports team captain.",
      tags: ["Sports"]
    }
  ],

  2023: [
    {
      date: "Nov 22",
      title: "Online Pharmacy App",
      description: "Manage prescriptions, inventory, and medicine sales remotely.",
      tags: ["Healthcare"]
    }
  ],

  2022: [
    {
      date: "Sep 29",
      title: "Patient Records System",
      description: "Digital system for storing and managing patient medical records.",
      tags: ["Healthcare"]
    },
    {
      date: "Dec 29",
      title: "Document Filing System",
      description: "Organize and track company documents digitally.",
      tags: ["Business Tools"]
    }
  ]
};

const container = document.getElementById("timeline-content");

// Validate tags on load
Object.values(timelineData).flat().forEach(project => {
  project.tags?.forEach(tag => {
    if (!tagStyles[tag]) {
      console.warn(`⚠️ Missing style for tag: "${tag}"`);
    }
  });
});

Object.entries(timelineData)
  .sort((a, b) => b[0] - a[0]) // newest year first
  .forEach(([year, entries]) => {
    const yearSection = document.createElement("section");
    yearSection.className = "year";

    yearSection.innerHTML = `<h3>${year}</h3>`;

    entries.forEach(entry => {
      const section = document.createElement("section");

      // Generate tags with inline styles
      const tagsHTML = entry.tags
        ? entry.tags
          .map(tag => {
            const style = tagStyles[tag];
            if (!style) {
              return `<span class="tag">${tag}</span>`;
            }
            return `<span class="tag" style="background: ${style.bg}; color: ${style.text};">${tag}</span>`;
          })
          .join(" ")
        : "";

      section.innerHTML = `
        <h4>${entry.date}</h4>
        <ul>
          <li class="timeline-item">
            ${entry.link
          ? `<a href="${entry.link}">${entry.title}</a>`
          : `<a href="javascript:void(0)">${entry.title}</a>`
        }
            <br/>
            ${tagsHTML}
            <br/>
            ${entry.description}
          </li>
        </ul>
      `;

      yearSection.appendChild(section);
    });

    container.appendChild(yearSection);
  });