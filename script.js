// ──────────────────────────────────────────────
//  CONFIG & STATE
// ──────────────────────────────────────────────
const STORAGE_KEY = "choco_confession_2026";
let state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
  mood: null,
  chocolatesOpened: 0,
  lastVisit: new Date().toISOString(),
  shareCount: 0,
  confessionLevel: 0,
  nickname: ""
};

const elements = {
  moodSection: document.getElementById("mood-section"),
  mainContent: document.getElementById("main-content"),
  progressBar: document.getElementById("confession-progress"),
  progressFill: document.getElementById("progress-fill"),
  progressText: document.getElementById("progress-text"),
  futureBox: document.getElementById("future-box"),
  missYouBtn: document.getElementById("miss-you-btn"),
  voiceNote: document.getElementById("voice-note"),
  futureText: document.getElementById("future-text"),
  playNote: document.getElementById("play-note"),
  shareBtn: document.getElementById("share-love"),
  shareCountEl: document.getElementById("share-count"),
  themeToggle: document.getElementById("theme-toggle"),
  clickSound: document.getElementById("click-sound")
};

const messages = {
  morning: "Good morning… aaj toh din thoda zyada sweet lagega 🍫☀️",
  evening: "Good evening… raat ko yaad aana thoda zyada special hota hai 🌙❤️",
  night: "Itni raat ko yaad aa gayi? …dangerous feeling hai ye 🥰",
  future: [
    "Agar aaj thak gaye ho… bas ek baar bol dena, main sab sunungi 🤗",
    "Kal jo bhi ho… yaad rakhna main tumhare saath hoon 🫶",
    "Tumhari wajah se meri story playlist mein sirf slow love songs baj rahe hain 🎶💕",
    "Kabhi bura lage toh yaad rakhna… main hoon na ❤️",
    "Miss you itna ki phone uthake bas tumhara naam type kar leti hoon 🥺"
  ]
};

// ──────────────────────────────────────────────
//  HELPERS
// ──────────────────────────────────────────────
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function playSoftClick() {
}
  

function updateProgress(level, max = 5) {
  const percent = (level / max) * 100;
  elements.progressFill.style.width = percent + "%";
  elements.progressText.textContent = `Level ${level}/${max} – Dil khul raha hai...`;
}

function typeWriter(el, text, speed = 60) {
  el.textContent = "";
  let i = 0;
  const timer = setInterval(() => {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(timer);
    }
  }, speed);
}

// ──────────────────────────────────────────────
//  TIME & GREETING
// ──────────────────────────────────────────────
const hour = new Date().getHours();
let greet = "";
if (hour >= 5 && hour < 12) greet = messages.morning;
else if (hour >= 12 && hour < 17) greet = "Good afternoon… thodi si coffee aur thoda sa pyaar? ☕❤️";
else if (hour >= 17 && hour < 21) greet = messages.evening;
else greet = messages.night;

document.getElementById("time-greet").textContent = greet.split("…")[0];
typeWriter(document.querySelector(".subtitle"), greet, 70);

// ──────────────────────────────────────────────
//  MOOD SELECTION → Main Flow
// ──────────────────────────────────────────────
document.querySelectorAll(".mood").forEach(btn => {
  btn.addEventListener("click", () => {
    playSoftClick();
    state.mood = btn.dataset.mood;
    saveState();

    elements.moodSection.classList.add("hidden");
    elements.progressBar.classList.remove("hidden");

    let html = "";

    if (state.mood === "yes") {
      state.confessionLevel = 1;
      html = `
        <div class="card">
          <h2 style="color:var(--pink)">Sach mein? 🥹💖</h2>
          <p>Toh chalo… 5 special chocolates khol ke dekhte hain kitna pyaar bhara hai mere dil mein 🍫</p>
          <div id="choco-container" class="choco-grid"></div>
          <div id="proposal" class="hidden proposal-box">
            <h2 style="margin:20px 0">Toh suno…</h2>
            <p class="big-heart">Will you be my forever? 💍🍫❤️</p>
            <div class="reaction-btns">
              <button class="react yes">Haan! 😍</button>
              <button class="react maybe">Sochta hoon 🫣</button>
            </div>
          </div>
        </div>
      `;
    } else if (state.mood === "maybe") {
      state.confessionLevel = 1;
      html = `
        <div class="card">
          <h2>It's okay... take your time 🥺</h2>
          <p>Main wait karungi… jitna time lage, utna hi pyaar badhega 🌸</p>
          <p class="small-note">Par haan… chocolates toh ab bhi khol sakte ho na? 😉</p>
        </div>
      `;
    } else {
      html = `
        <div class="card">
          <h2>Dil se dil tak baat ho gayi 🫶</h2>
          <p>Bas khush rehna… yahi meri sabse badi khwahish hai 🌟</p>
        </div>
      `;
    }

    elements.mainContent.innerHTML = html;
    elements.mainContent.classList.remove("hidden");

    if (state.mood === "yes") initChocolates();
    updateProgress(state.confessionLevel);

    // Show future box after mood
    setTimeout(() => elements.futureBox.classList.remove("hidden"), 1200);
  });
});

// ──────────────────────────────────────────────
//  CHOCOLATE UNLOCK SYSTEM
// ──────────────────────────────────────────────
const chocoFeelings = [
  "Teri smile dekh ke din ban jaata hai 🥰",
  "Tum jab baat karte ho… dil sun leta hai ❤️",
  "Tumhare saath chup rehna bhi kitna sundar lagta hai 🤫💕",
  "Har din chocolate day lagta hai jab tum saath ho 🍫",
  "I guess… main sach mein bahut zyada like karti hoon tujhe 😳💖"
];

function initChocolates() {
  const container = document.getElementById("choco-container");
  container.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    const choco = document.createElement("div");
    choco.className = "choco";
    choco.innerHTML = `<span class="emoji">🍫</span><span class="num">${i+1}</span>`;
    
    choco.addEventListener("click", () => {
      if (!choco.classList.contains("opened")) {
        playSoftClick();
        choco.innerHTML = `<span>${chocoFeelings[i]}</span>`;
        choco.classList.add("opened");
        state.chocolatesOpened++;
        saveState();

        if (state.chocolatesOpened === 5) {
          state.confessionLevel = 5;
          updateProgress(5);
          document.getElementById("proposal").classList.remove("hidden");
          document.querySelector(".share-section")?.classList.remove("hidden");
        } else {
          state.confessionLevel = state.chocolatesOpened;
          updateProgress(state.chocolatesOpened);
        }
      }
    });
    container.appendChild(choco);
  }
}

// ──────────────────────────────────────────────
//  PROPOSAL REACTIONS
// ──────────────────────────────────────────────
document.addEventListener("click", e => {
  if (e.target.matches(".react.yes")) {
    alert("Bas yahi sunna tha… ab toh dil se dil tak party shuru! 🥳💍❤️");
    state.confessionLevel = 6;
    updateProgress(6, 6);
  }
  if (e.target.matches(".react.maybe")) {
    alert("It's okay… main wait karungi… jitna time lage utna pyaar badhega 🥰");
  }
});

// ──────────────────────────────────────────────
//  FUTURE MESSAGE (voice note style)
// ──────────────────────────────────────────────
elements.missYouBtn.addEventListener("click", () => {
  playSoftClick();
  const randomMsg = messages.future[Math.floor(Math.random() * messages.future.length)];
  elements.futureText.textContent = "";
  elements.voiceNote.classList.remove("hidden");
  typeWriter(elements.futureText, randomMsg, 55);
});

elements.playNote.addEventListener("click", () => {
  playSoftClick();
  alert("Imagine main yeh soft awaaz mein bol rahi hoon… 🥺🎤");
});

// ──────────────────────────────────────────────
//  SHARE + STATS
// ──────────────────────────────────────────────
elements.shareCountEl.textContent = state.shareCount;

elements.shareBtn.addEventListener("click", () => {
  playSoftClick();
  state.shareCount++;
  saveState();
  elements.shareCountEl.textContent = state.shareCount;

  const link = window.location.href;
  const text = `Main bol nahi paati… isliye yeh page bhej rahi hoon 🥺🍫\n${link}`;
  
  navigator.clipboard.writeText(text).then(() => {
    alert("Link copy ho gaya! Ab bhej do… nervousness badha do thodi si 😉");
  });
});

// ──────────────────────────────────────────────
//  THEME TOGGLE
// ──────────────────────────────────────────────
elements.themeToggle.addEventListener("click", () => {
  const current = document.body.dataset.theme;
  document.body.dataset.theme = current === "dark" ? "light" : "dark";
  elements.themeToggle.textContent = current === "dark" ? "🌙" : "☀️";
});

// ──────────────────────────────────────────────
//  COUNTDOWN TO VALENTINE FLOW (Feb 2026)
// ──────────────────────────────────────────────
function daysUntil(dateStr) {
  const target = new Date(dateStr);
  const diff = target - new Date();
  return diff > 0 ? Math.ceil(diff / (1000*60*60*24)) : "Hua!";
}

document.getElementById("promise-count").textContent = daysUntil("2026-02-11") + " days";
document.getElementById("hug-count").textContent    = daysUntil("2026-02-12") + " days";
document.getElementById("val-count").textContent    = daysUntil("2026-02-14") + " days";

document.querySelector(".countdown-days").classList.remove("hidden");

// ──────────────────────────────────────────────
//  SECRET EASTER EGGS
// ──────────────────────────────────────────────
let titleClicks = 0;
document.querySelector(".title").addEventListener("click", () => {
  titleClicks++;
  if (titleClicks === 5) {
    alert("Arre… itna dhyan se padh rahe ho? 🥹\nTumhe sach mein samajhne wali ladki mil jaaye… chahe wo main hi kyun na ho 💗");
    titleClicks = 0;
  }
});

// Bonus: triple tap on proposal box
document.addEventListener("click", e => {
  if (e.target.closest("#proposal") && e.detail === 3) {
    alert("Triple tap? 😳\nLagta hai dil se dil tak baat ho rahi hai… ❤️");
  }
});


console.log("Chocolate Day 2026 – Ready 💕");
