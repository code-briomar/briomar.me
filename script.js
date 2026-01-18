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
  "Productivity": { bg: "#dbeafe", text: "#1e40af" },
  "Agriculture": { bg: "#e0f2fe", text: "#0369a1" },
  "Portfolio": { bg: "#fef3c7", text: "#92400e" },
  "Events": { bg: "#ede9fe", text: "#5b21b6" },
  "Community": { bg: "#dcfce7", text: "#166534" },
  "Information": { bg: "#fff7ed", text: "#9a3412" },
  "Law": { bg: "#fce7f3", text: "#9d174d" },
  "Utilities": { bg: "#ecfeff", text: "#155e75" },
  "Health": { bg: "#fee2e2", text: "#991b1b" },
  "Social": { bg: "#e0e7ff", text: "#3730a3" },
  "Mobile": { bg: "#fef9c3", text: "#854d0e" }
};

// ============================================
// TIMELINE DATA
// ============================================
const timelineData = {
    "2026": [
        {
            "date": "Jan 4",
            "title": "Caregiver Web App",
            "link": "",
            "repo_link": "https://github.com/code-briomar/caregiver_web_app",
            "description": "A web application for caregivers to manage their clients and appointments.",
            "tags": ["Healthcare", "Business Tools"]
        },
        {
            "date": "Jan 13",
            "title": "Farmers Leaf Doctor",
            "link": "",
            "repo_link": "https://github.com/code-briomar/farmers-leaf-doctor",
            "description": "An application to diagnose plant diseases from leaf images.",
            "tags": ["AI Tools", "Agriculture"]
        }
    ],
    "2025": [
        {
            "date": "Feb 27",
            "title": "briomar.me",
            "link": "https://briomar.me",
            "repo_link": "https://github.com/code-briomar/briomar.me",
            "description": "My personal website and portfolio.",
            "tags": ["Portfolio"]
        },
        {
            "date": "Mar 18",
            "title": "C-Work API",
            "link": "",
            "repo_link": "https://github.com/code-briomar/c-work-api",
            "description": "An API for managing work-related tasks.",
            "tags": ["Business Tools"]
        },
        {
            "date": "Jun 4",
            "title": "Event Promotion and Dissemination in a Campus Environment",
            "link": "",
            "repo_link": "https://github.com/code-briomar/Event-Promotion-and-Dissemination-in-a-Campus-Environment",
            "description": "A system for promoting and disseminating event information on campus.",
            "tags": ["Events", "Education"]
        },
        {
            "date": "Jan 1",
            "title": "Local Insights KE",
            "link": "",
            "repo_link": "https://github.com/code-briomar/local_insights_ke",
            "description": "A platform for sharing local insights and knowledge in Kenya.",
            "tags": ["Community", "Information"]
        },
        {
            "date": "Mar 23",
            "title": "Lomogan Skuli",
            "link": "",
            "repo_link": "https://github.com/code-briomar/lomogan-skuli",
            "description": "An e-learning platform.",
            "tags": ["Education"]
        },
        {
            "date": "Mar 21",
            "title": "MG Advocates Website",
            "link": "",
            "repo_link": "https://github.com/code-briomar/mg-advocates-website",
            "description": "The official website for MG Advocates.",
            "tags": ["Law"]
        },
        {
            "date": "Feb 24",
            "title": "Scanned PDF to Word",
            "link": "./scanned-pdf-to-word/index.html",
            "repo_link": "https://github.com/code-briomar/scannedpdf_to_word",
            "description": "Turn scanned documents into editable Word files automatically using OCR technology.",
            "tags": ["Document Tools", "AI Tools"]
        }
    ],
    "2024": [
        {
            "date": "Mar 22",
            "title": "Briomar Utility TS PKG",
            "link": "",
            "repo_link": "https://github.com/code-briomar/briomar-utility-ts-pkg",
            "description": "A TypeScript package with utility functions.",
            "tags": ["Developer Tools"]
        },
        {
            "date": "Jun 22",
            "title": "Chat-Flow API",
            "link": "",
            "repo_link": "https://github.com/code-briomar/chat-flow-api",
            "description": "An API for creating chatbots.",
            "tags": ["AI Tools", "Developer Tools"]
        },
        {
            "date": "Aug 18",
            "title": "ChatFlow",
            "link": "",
            "repo_link": "https://github.com/code-briomar/chatFlow",
            "description": "A chatbot application.",
            "tags": ["AI Tools"]
        },
        {
            "date": "Apr 22",
            "title": "Daraja-Rust-API",
            "link": "",
            "repo_link": "https://github.com/code-briomar/daraja-rust-api",
            "description": "A Rust API for the M-Pesa Daraja API.",
            "tags": ["Payments", "Developer Tools"]
        },
        {
            "date": "Aug 8",
            "title": "Downloads Organiser",
            "link": "",
            "repo_link": "https://github.com/code-briomar/downloads-organiser",
            "description": "A tool for organizing downloaded files.",
            "tags": ["Utilities"]
        },
        {
            "date": "Jul 2",
            "title": "Google Gemini Proxy for ChatFlow",
            "link": "",
            "repo_link": "https://github.com/code-briomar/google-gemini-proxy-for-chatflow",
            "description": "A proxy for using Google Gemini with ChatFlow.",
            "tags": ["AI Tools", "Developer Tools"]
        },
        {
            "date": "Jan 21",
            "title": "Java Leetcode Scripts",
            "link": "",
            "repo_link": "https://github.com/code-briomar/java-leetcode-scripts",
            "description": "A collection of Java scripts for solving Leetcode problems.",
            "tags": ["Developer Tools", "Education"]
        },
        {
            "date": "Jun 20",
            "title": "KE Accountability",
            "link": "",
            "repo_link": "https://github.com/code-briomar/ke-accountability",
            "description": "A project to promote accountability in Kenya.",
            "tags": ["Community"]
        },
        {
            "date": "Aug 15",
            "title": "Learning Rust",
            "link": "",
            "repo_link": "https://github.com/code-briomar/learning-rust",
            "description": "A repository for my journey of learning Rust.",
            "tags": ["Developer Tools", "Education"]
        },
        {
            "date": "May 1",
            "title": "Mewing Counter",
            "link": "",
            "repo_link": "https://github.com/code-briomar/mewing-counter",
            "description": "An app to count mewing sessions.",
            "tags": ["Health"]
        },
        {
            "date": "Aug 31",
            "title": "Minigrep",
            "link": "",
            "repo_link": "https://github.com/code-briomar/minigrep",
            "description": "A mini version of the grep command-line tool.",
            "tags": ["Developer Tools"]
        },
        {
            "date": "Jul 23",
            "title": "MOH Code",
            "link": "",
            "repo_link": "https://github.com/code-briomar/moh-code",
            "description": "A collection of code related to the Ministry of Health.",
            "tags": ["Healthcare"]
        },
        {
            "date": "Aug 18",
            "title": "Ollama App",
            "link": "",
            "repo_link": "https://github.com/code-briomar/ollama-app",
            "description": "An application that uses the Ollama API.",
            "tags": ["AI Tools"]
        },
        {
            "date": "Jan 12",
            "title": "POS System using AL in D-365",
            "link": "",
            "repo_link": "https://github.com/code-briomar/POS-System-using-AL-in-D-365",
            "description": "A Point of Sale system using AL in Dynamics 365.",
            "tags": ["Business Tools", "Retail"]
        },
        {
            "date": "Jun 22",
            "title": "Real Estate App Web",
            "link": "",
            "repo_link": "https://github.com/code-briomar/real-estate-app-web",
            "description": "A web application for real estate.",
            "tags": ["Business Tools"]
        },
        {
            "date": "Aug 18",
            "title": "Rust Feed",
            "link": "",
            "repo_link": "https://github.com/code-briomar/rust-feed",
            "description": "A feed reader written in Rust.",
            "tags": ["Developer Tools"]
        },
        {
            "date": "Jun 18",
            "title": "San Code",
            "link": "",
            "repo_link": "https://github.com/code-briomar/san-code",
            "description": "An online code editor.",
            "tags": ["Developer Tools"]
        },
        {
            "date": "Mar 23",
            "title": "Spark V Spring",
            "link": "",
            "repo_link": "https://github.com/code-briomar/spark-v-spring",
            "description": "A comparison between Spark and Spring.",
            "tags": ["Developer Tools"]
        },
        {
            "date": "Jan 21",
            "title": "Switching from JS to TS",
            "link": "",
            "repo_link": "https://github.com/code-briomar/switching-from-js-to-ts",
            "description": "A project documenting the switch from JavaScript to TypeScript.",
            "tags": ["Developer Tools", "Education"]
        },
        {
            "date": "Jun 20",
            "title": "Twitter",
            "link": "",
            "repo_link": "https://github.com/code-briomar/twitter",
            "description": "A Twitter clone.",
            "tags": ["Social"]
        },
        {
            "date": "Sep 21",
            "title": "Who to Captain",
            "link": "",
            "repo_link": "https://github.com/code-briomar/who-to-captain",
            "description": "A tool to help you choose your fantasy football captain.",
            "tags": ["Sports", "AI Tools"]
        },
        {
            "date": "Sep 21",
            "title": "Who to Captain API",
            "link": "",
            "repo_link": "https://github.com/code-briomar/who-to-captain-api",
            "description": "An API for the Who to Captain tool.",
            "tags": ["Sports", "AI Tools"]
        }
    ],
    "2023": [
        {
            "date": "Mar 21",
            "title": "AirBNB React Native App",
            "link": "",
            "repo_link": "https://github.com/code-briomar/AirBNB-react-native-app",
            "description": "A React Native clone of the AirBNB app.",
            "tags": ["Mobile", "Business Tools"]
        },
        {
            "date": "Dec 17",
            "title": "Coding Rizz",
            "link": "",
            "repo_link": "https://github.com/code-briomar/coding-rizz",
            "description": "A project to improve coding skills.",
            "tags": ["Developer Tools", "Education"]
        },
        {
            "date": "Aug 24",
            "title": "Docker Mongo DB",
            "link": "",
            "repo_link": "https://github.com/code-briomar/docker-mongo-db",
            "description": "A project to run a MongoDB database in a Docker container.",
            "tags": ["Developer Tools"]
        },
        {
            "date": "Jul 15",
            "title": "Express CRUD App",
            "link": "",
            "repo_link": "https://github.com/code-briomar/express-crud-app",
            "description": "A simple CRUD application using Express.js.",
            "tags": ["Developer Tools"]
        },
        {
            "date": "Nov 22",
            "title": "Pharma",
            "link": "",
            "repo_link": "https://github.com/code-briomar/pharma",
            "description": "An application for managing a pharmacy.",
            "tags": ["Healthcare", "Business Tools"]
        },
        {
            "date": "Dec 17",
            "title": "TaskRoulette",
            "link": "",
            "repo_link": "https://github.com/code-briomar/TaskRoulette",
            "description": "A tool to randomly assign tasks.",
            "tags": ["Business Tools"]
        }
    ],
    "2022": [
        {
            "date": "Sep 19",
            "title": "Lomo-gan-san-code",
            "link": "",
            "repo_link": "https://github.com/code-briomar/Lomo-gan-san-code",
            "description": "A project for generating images using a GAN.",
            "tags": ["AI Tools"]
        },
        {
            "date": "Dec 29",
            "title": "PasswordManager",
            "link": "",
            "repo_link": "https://github.com/code-briomar/PasswordManager",
            "description": "A simple password manager.",
            "tags": ["Utilities"]
        },
        {
            "date": "Dec 29",
            "title": "Records and Tracking",
            "link": "records_and_tracking.html",
            "repo_link": "https://github.com/code-briomar/records_and_tracking",
            "description": "A system for recording and tracking data.",
            "tags": ["Business Tools"]
        },
        {
            "date": "Sep 29",
            "title": "StudyBuddy",
            "link": "",
            "repo_link": "https://github.com/code-briomar/StudyBuddy",
            "description": "A tool to help students study together.",
            "tags": ["Education"]
        },
        {
            "date": "Sep 19",
            "title": "Test Repo",
            "link": "",
            "repo_link": "https://github.com/code-briomar/test-repo",
            "description": "A repository for testing purposes.",
            "tags": ["Developer Tools"]
        }
    ],
    "2021": [
        {
            "date": "Jul 13",
            "title": "Chatbot",
            "link": "",
            "repo_link": "https://github.com/code-briomar/Chatbot",
            "description": "A chatbot application.",
            "tags": ["AI Tools"]
        },
        {
            "date": "Jun 6",
            "title": "Programs",
            "link": "",
            "repo_link": "https://github.com/code-briomar/Programs",
            "description": "A collection of programs.",
            "tags": ["Developer Tools"]
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
  let titleLink = `<a href="${entry?.link || "javascript:void(0)" }" rel="noopener noreferrer">${entry?.title}</a>`;

  
  return `
    <h4>${entry.date}</h4>
    <ul>
      <li class="timeline-item">
        ${titleLink}
        ${tagsHTML ? `<br/>${tagsHTML}` : ""}
        <p>${entry.description ? `<br/>${entry.description}` : ""}</p>
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