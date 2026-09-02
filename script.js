const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
const sections = [...document.querySelectorAll("main section[id]")];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const closeNavigation = () => {
  nav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("nav-open");
};

navToggle.addEventListener("click", () => {
  const shouldOpen = navToggle.getAttribute("aria-expanded") !== "true";
  nav.classList.toggle("is-open", shouldOpen);
  navToggle.setAttribute("aria-expanded", String(shouldOpen));
  document.body.classList.toggle("nav-open", shouldOpen);
});

navLinks.forEach((link) => link.addEventListener("click", closeNavigation));

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) closeNavigation();
});

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 20);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visibleSection = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visibleSection) return;

    navLinks.forEach((link) => {
      const isCurrent = link.getAttribute("href") === `#${visibleSection.target.id}`;
      link.classList.toggle("is-active", isCurrent);
      if (isCurrent) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  },
  { rootMargin: "-22% 0px -58%", threshold: [0, 0.25, 0.55] },
);

sections.forEach((section) => sectionObserver.observe(section));

const revealItems = document.querySelectorAll(".reveal");

if (reduceMotion) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

document.querySelector("[data-year]").textContent = new Date().getFullYear();
