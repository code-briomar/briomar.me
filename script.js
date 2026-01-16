// ============================================
// DARK MODE TOGGLE
// ============================================
const toggleBtn = document.getElementById("toggle-dark-mode");
const icon = toggleBtn.querySelector("i");

// Check for saved theme preference or default to dark mode
const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if (savedTheme === "light") {
  document.body.classList.remove("dark-mode");
  icon.classList.replace("fa-moon", "fa-sun");
} else if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
  document.body.classList.add("dark-mode");
  icon.classList.replace("fa-sun", "fa-moon");
}

// Toggle dark mode on button click
toggleBtn.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
    localStorage.setItem("theme", "dark");
  } else {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
    localStorage.setItem("theme", "light");
  }
});

// ============================================
// TAG STYLES CONFIGURATION
// ============================================
const tagStyles = {
  "Document Tools": { bg: "#e0f2fe", text: "#0369a1" },
  "Retail": { bg: "#fef3c7", text: "#92400e" },
  "Developer Tools": { bg: "#ede9fe", text: "#5b21b6" },
  "Customer Service": { bg: "#dcfce7", text: "#166534" },
  "AI Tools": { bg: "#fff7ed", text: "#9a3412" },
  "Healthcare": { bg: "#fce7f3", text: "#9d174d" },
  "Payments": { bg: "#ecfeff", text: "#155e75" },
  "Sports": { bg: "#fee2e2", text: "#991b1b" },
  "Business Tools": { bg: "#e0e7ff", text: "#3730a3" },
  "Education": { bg: "#fef9c3", text: "#854d0e" },
  "Entertainment": { bg: "#f3e8ff", text: "#6b21a8" },
  "Productivity": { bg: "#dbeafe", text: "#1e40af" }
};

// ============================================
// TIMELINE DATA
// ============================================
const timelineData = {
  2025: [
    {
      date: "Feb 24",
      title: "PDF to Word Converter",
      link: "./scanned-pdf-to-word/index.html",
      repo_link: "https://github.com/code-briomar/scannedpdf_to_word",
      description: "Turn scanned documents into editable Word files automatically using OCR technology.",
      tags: ["Document Tools", "AI Tools"]
    }
  ],

  2024: [
    {
      date: "Jan 12",
      title: "Shop Cash Register System",
      link: "",
      repo_link: "",
      description: "Complete system for stores to process sales and accept payments.",
      tags: ["Retail", "Business Tools"]
    },
    {
      date: "Jun 18",
      title: "San Code Online Editor",
      link: "",
      repo_link: "",
      description: "Write and edit code directly in your web browser.",
      tags: ["Developer Tools"]
    },
    {
      date: "Jun 22",
      title: "Chatbot Builder",
      link: "",
      repo_link: "",
      description: "Tool to create automated chat assistants for websites.",
      tags: ["Customer Service", "AI Tools"]
    },
    {
      date: "Jul 2",
      title: "AI Chat Integration",
      link: "",
      repo_link: "",
      description: "Connect Google's AI assistant to chat applications.",
      tags: ["AI Tools"]
    },
    {
      date: "Aug 1",
      title: "Hospital Finder Map",
      link: "",
      repo_link: "",
      description: "Interactive map showing all major hospitals in Kenya.",
      tags: ["Healthcare"]
    },
    {
      date: "Aug 17",
      title: "M-Pesa Payment System",
      link: "",
      repo_link: "",
      description: "Accept mobile money payments from customers.",
      tags: ["Payments"]
    },
    {
      date: "Sep 21",
      title: "Fantasy Football Helper",
      link: "",
      repo_link: "",
      description: "Get recommendations for your fantasy sports team captain.",
      tags: ["Sports"]
    }
  ],

  2023: [
    {
      date: "Nov 22",
      title: "Online Pharmacy App",
      link: "",
      repo_link: "",
      description: "Manage prescriptions, inventory, and medicine sales remotely.",
      tags: ["Healthcare", "Business Tools"]
    }
  ],

  2022: [
    {
      date: "Sep 29",
      title: "Patient Records System",
      link: "",
      repo_link: "",
      description: "Digital system for storing and managing patient medical records.",
      tags: ["Healthcare"]
    },
    {
      date: "Dec 29",
      title: "Document Filing System",
      link: "",
      repo_link: "",
      description: "Organize and track company documents digitally.",
      tags: ["Business Tools"]
    }
  ]
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Validates that all tags used in timeline data have corresponding styles
 */
function validateTags() {
  const missingTags = new Set();
  
  Object.values(timelineData).flat().forEach(project => {
    project.tags?.forEach(tag => {
      if (!tagStyles[tag]) {
        missingTags.add(tag);
      }
    });
  });
  
  if (missingTags.size > 0) {
    console.warn("⚠️ Missing styles for tags:", Array.from(missingTags));
  }
}

/**
 * Generates HTML for project tags with inline styles
 * @param {string[]} tags - Array of tag names
 * @returns {string} HTML string for tags
 */
function generateTagsHTML(tags) {
  if (!tags || tags.length === 0) return "";
  
  return tags
    .map(tag => {
      const style = tagStyles[tag];
      if (!style) {
        console.warn(`⚠️ No style found for tag: "${tag}"`);
        return `<span class="tag">${tag}</span>`;
      }
      return `<span class="tag" style="background: ${style.bg}; color: ${style.text};">${tag}</span>`;
    })
    .join(" ");
}

/**
 * Generates HTML for a single timeline entry
 * @param {Object} entry - Timeline entry data
 * @returns {string} HTML string for the entry
 */
function generateEntryHTML(entry) {
  const tagsHTML = generateTagsHTML(entry.tags);
  
  // Determine link behavior
  let titleLink;
  if (entry.link) {
    titleLink = `<a href="${entry.link}" target="_blank" rel="noopener noreferrer">${entry.title}</a>`;
  } else if (entry.repo_link) {
    titleLink = `<a href="${entry.repo_link}" target="_blank" rel="noopener noreferrer">${entry.title}</a>`;
  } else {
    titleLink = `<span class="timeline-title">${entry.title}</span>`;
  }
  
  return `
    <h4>${entry.date}</h4>
    <ul>
      <li class="timeline-item">
        ${titleLink}
        ${tagsHTML ? `<br/>${tagsHTML}` : ""}
        ${entry.description ? `<br/>${entry.description}` : ""}
      </li>
    </ul>
  `;
}

/**
 * Renders the complete timeline to the DOM
 */
function renderTimeline() {
  const container = document.getElementById("timeline-content");
  
  if (!container) {
    console.error("Timeline container not found!");
    return;
  }
  
  // Clear existing content
  container.innerHTML = "";
  
  // Sort years in descending order (newest first)
  const sortedYears = Object.entries(timelineData).sort((a, b) => b[0] - a[0]);
  
  sortedYears.forEach(([year, entries]) => {
    const yearSection = document.createElement("section");
    yearSection.className = "year";
    
    // Add year heading
    const yearHeading = document.createElement("h3");
    yearHeading.textContent = year;
    yearSection.appendChild(yearHeading);
    
    // Add each entry for this year
    entries.forEach(entry => {
      const entrySection = document.createElement("section");
      entrySection.innerHTML = generateEntryHTML(entry);
      yearSection.appendChild(entrySection);
    });
    
    container.appendChild(yearSection);
  });
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener("DOMContentLoaded", function() {
  // Validate tags on load
  validateTags();
  
  // Render the timeline
  renderTimeline();
  
  console.log("✅ Timeline loaded successfully!");
});