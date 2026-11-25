// ===========================
// João Vitor · Portfólio — interações
// ===========================
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Ano no rodapé
$("#year").textContent = new Date().getFullYear();

// Nav: fundo ao rolar + link ativo
const nav = $("#nav");
const sections = $$("main section[id]");
const navAnchors = $$(".nav-links a:not(.btn)");
function onScroll() {
  nav.classList.toggle("scrolled", window.scrollY > 30);
  let current = "";
  sections.forEach((s) => {
    if (window.scrollY >= s.offsetTop - 140) current = s.id;
  });
  navAnchors.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${current}`));
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Menu mobile
const menuBtn = $("#menuBtn");
const navLinks = $("#navLinks");
menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", open);
  document.body.style.overflow = open ? "hidden" : "";
});
$$("a", navLinks).forEach((a) =>
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuBtn.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  })
);

// Efeito de digitação
const roles = [
  "Desenvolvedor de Sistemas",
  "Front-end & Mobile",
  "Game Dev com Unity",
  "HTML · CSS · JS · C# · SQL",
];
const typed = $("#typed");
if (reduceMotion) {
  typed.textContent = roles[0];
} else {
  let r = 0, i = 0, deleting = false;
  (function type() {
    const word = roles[r];
    typed.textContent = word.slice(0, i);
    if (!deleting && i < word.length) i++;
    else if (deleting && i > 0) i--;
    else if (!deleting) { deleting = true; return setTimeout(type, 1600); }
    else { deleting = false; r = (r + 1) % roles.length; }
    setTimeout(type, deleting ? 40 : 85);
  })();
}

// Revelar elementos ao rolar + contadores
const counted = new WeakSet();
function countUp(el) {
  if (counted.has(el)) return;
  counted.add(el);
  const target = +el.dataset.count;
  const start = performance.now();
  const dur = 1200;
  (function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("visible");
      $$("[data-count]", e.target).forEach(countUp);
      io.unobserve(e.target);
    });
  },
  { threshold: 0.15 }
);
$$(".reveal").forEach((el, idx) => {
  el.style.transitionDelay = `${(idx % 4) * 80}ms`;
  io.observe(el);
});

// Filtro de skills
$$(".chip").forEach((chip) =>
  chip.addEventListener("click", () => {
    $$(".chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    const f = chip.dataset.filter;
    $$(".skill").forEach((s) => {
      const cats = s.dataset.cat.split(" ");
      s.classList.toggle("dim", f !== "all" && !cats.includes(f));
    });
  })
);

// Brilho que segue o mouse nos cards de skill
$$(".skill").forEach((card) =>
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  })
);

// Copiar e-mail
const toast = $("#toast");
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(showToast.t);
  showToast.t = setTimeout(() => toast.classList.remove("show"), 2200);
}
$("#copyEmail").addEventListener("click", async (e) => {
  const email = e.currentTarget.dataset.email;
  try {
    await navigator.clipboard.writeText(email);
    showToast("E-mail copiado! ✨");
  } catch {
    showToast(email);
  }
});

// Céu estrelado no fundo
const canvas = $("#stars");
const ctx = canvas.getContext("2d");
let stars = [];
function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const n = Math.round((innerWidth * innerHeight) / 9000);
  stars = Array.from({ length: n }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: Math.random() * 1.2 + 0.2,
    a: Math.random(),
    s: Math.random() * 0.015 + 0.004,
    v: Math.random() * 0.15 + 0.02,
  }));
}
function draw() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (const st of stars) {
    st.a += st.s;
    st.y -= st.v;
    if (st.y < 0) st.y = innerHeight;
    ctx.globalAlpha = 0.35 + Math.abs(Math.sin(st.a)) * 0.65;
    ctx.fillStyle = "#e9e4ff";
    ctx.beginPath();
    ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
    ctx.fill();
  }
  if (!reduceMotion) requestAnimationFrame(draw);
}
window.addEventListener("resize", resize);
resize();
draw();
