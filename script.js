/* ============================================================
   For Maheen ♥
   ------------------------------------------------------------
   This list is auto-generated from whatever is in this folder —
   no need to rename files or edit this by hand.
   ============================================================ */

const captionPool = [
  "us",
  "this one",
  "my favorite",
  "that day",
  "you & me",
  "love this one",
  "made me smile",
  "the good stuff",
];

const photoFiles = [
  "1.jpg",
  "2.jpg",
  "3.jpg",
  "4.jpeg",
  "5.jpg",
  "6.jpg",
  "7.jpg",
  "8.jpeg",
  "9.jpg",
  "10.jpeg",
  "11.jpeg",
  "12.jpeg",
  "13.jpeg",
  "14.jpeg",
  "15.jpeg",
  "16.jpeg",
  "17.jpeg",
  "18.jpeg",
];

const photos = photoFiles.map((name, i) => ({
  src: name,
  caption: captionPool[i % captionPool.length],
}));

const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------
   Gallery
   ------------------------------------------------------------ */
const grid = document.getElementById("galleryGrid");

function buildGallery(list) {
  grid.innerHTML = "";

  list.forEach((photo, i) => {
    const card = document.createElement("button");
    card.className = "polaroid";
    card.type = "button";
    card.setAttribute("aria-label", `Open photo: ${photo.caption}`);

    const frame = document.createElement("div");
    frame.className = "frame";

    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.caption;
    img.loading = "lazy";

    // No file there yet? Fall back to a pretty pastel tile.
    img.addEventListener("error", () => {
      frame.classList.add("empty");
      frame.dataset.label = "add a photo";
      frame.textContent = "🌸";
      frame.append(img);
    });

    frame.append(img);
    card.append(frame);
    card.addEventListener("click", () => openLightbox(i));
    grid.append(card);

    reveal(card, i);
  });
}

/* Fade each card in as it scrolls into view. */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const delay = Number(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add("in"), delay);
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);

function reveal(card, index) {
  if (REDUCED) {
    card.classList.add("in");
    return;
  }
  card.dataset.delay = (index % 4) * 90;
  card.style.transition = "opacity .6s ease, transform .6s cubic-bezier(.2,1.4,.4,1), box-shadow .3s";
  observer.observe(card);
}

buildGallery(photos);

/* ------------------------------------------------------------
   Lightbox
   ------------------------------------------------------------ */
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
let current = 0;
let lastFocused = null;

function openLightbox(index) {
  current = index;
  lastFocused = document.activeElement;
  render();
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  document.getElementById("lbClose").focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = "";
  if (lastFocused) lastFocused.focus();
}

function step(direction) {
  current = (current + direction + photos.length) % photos.length;
  render();
}

function render() {
  const photo = photos[current];
  lbImg.src = photo.src;
  lbImg.alt = photo.caption;
  // restart the zoom animation on every change
  const fig = document.querySelector(".lb-figure");
  fig.style.animation = "none";
  void fig.offsetWidth;
  fig.style.animation = "";
}

document.getElementById("lbClose").addEventListener("click", closeLightbox);
document.getElementById("lbPrev").addEventListener("click", () => step(-1));
document.getElementById("lbNext").addEventListener("click", () => step(1));

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (lightbox.hidden) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
});

/* swipe on phones */
let touchX = null;
lightbox.addEventListener("touchstart", (e) => { touchX = e.changedTouches[0].clientX; }, { passive: true });
lightbox.addEventListener("touchend", (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  touchX = null;
}, { passive: true });

/* ------------------------------------------------------------
   Hearts: a burst wherever you click
   ------------------------------------------------------------ */
const HEARTS = ["💖", "💕", "💗", "💞", "🌸", "✨", "💘"];

function burst(x, y, count = 8) {
  if (REDUCED) return;

  for (let i = 0; i < count; i++) {
    const heart = document.createElement("span");
    heart.className = "pop";
    heart.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.fontSize = `${12 + Math.random() * 18}px`;
    document.body.append(heart);

    const angle = Math.random() * Math.PI * 2;
    const distance = 60 + Math.random() * 120;

    heart
      .animate(
        [
          { transform: "translate(-50%, -50%) scale(.4) rotate(0deg)", opacity: 1 },
          {
            transform: `translate(${Math.cos(angle) * distance - 50}%, ${Math.sin(angle) * distance - 90}%) scale(1.15) rotate(${Math.random() * 360 - 180}deg)`,
            opacity: 0,
          },
        ],
        { duration: 900 + Math.random() * 500, easing: "cubic-bezier(.2,.7,.3,1)" }
      )
      .addEventListener("finish", () => heart.remove());
  }
}

document.addEventListener("click", (e) => {
  if (e.target.closest(".lb-btn, .polaroid")) return;
  burst(e.clientX, e.clientY, 6);
});

/* ------------------------------------------------------------
   Hearts drifting up the background
   ------------------------------------------------------------ */
const sky = document.getElementById("sky");

function drift() {
  const heart = document.createElement("span");
  heart.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
  heart.style.left = `${Math.random() * 100}vw`;
  heart.style.fontSize = `${14 + Math.random() * 20}px`;
  heart.style.animationDuration = `${11 + Math.random() * 10}s`;
  heart.style.setProperty("--spin", `${Math.random() * 500 - 250}deg`);
  sky.append(heart);
  setTimeout(() => heart.remove(), 22000);
}

if (!REDUCED) {
  for (let i = 0; i < 6; i++) setTimeout(drift, i * 900);
  setInterval(drift, 2200);
}

/* ------------------------------------------------------------
   Bouncy name letters
   ------------------------------------------------------------ */
document.querySelectorAll("#name .letter").forEach((letter) => {
  letter.addEventListener("click", () => {
    letter.classList.remove("jump");
    void letter.offsetWidth;
    letter.classList.add("jump");
    const rect = letter.getBoundingClientRect();
    burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 8);
  });
});

/* ------------------------------------------------------------ */
document.getElementById("year").textContent = `· ${new Date().getFullYear()}`;
