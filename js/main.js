/**
 * main.js
 * 사이트 공통 동작: 모바일 내비게이션 토글, 스크롤 리빌 애니메이션,
 * 텍스트 등장(캐릭터 단위) 애니메이션.
 *
 * 프레임워크/빌드 도구 없이 순수 JS로 작성했습니다.
 * 새 애니메이션이 필요하면 이 파일에 함수를 추가하고
 * 해당 HTML 요소에 data-reveal / data-reveal-stagger / data-split-chars
 * 속성만 붙이면 됩니다.
 */

(function () {
  "use strict";

  /* ---------------------------------------------------------------------
   * 모바일 내비게이션 토글
   * ------------------------------------------------------------------- */
  function initNavToggle() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const nav = document.querySelector("[data-site-nav]");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------------------------------------------------------------------
   * 텍스트를 글자 단위 span으로 분해 (등장 애니메이션용)
   * ------------------------------------------------------------------- */
  function splitChars() {
    document.querySelectorAll("[data-split-chars]").forEach((el) => {
      if (el.dataset.splitDone) return;
      const text = el.textContent;
      el.textContent = "";
      el.classList.add("char-anim");

      let globalIndex = 0;
      const words = text.split(" ");
      words.forEach((word, wi) => {
        const wordSpan = document.createElement("span");
        wordSpan.style.display = "inline-block";
        wordSpan.style.overflow = "hidden";
        wordSpan.style.verticalAlign = "top";

        Array.from(word).forEach((ch) => {
          const charSpan = document.createElement("span");
          charSpan.className = "char";
          charSpan.style.transitionDelay = (globalIndex * 18) + "ms";
          charSpan.textContent = ch;
          wordSpan.appendChild(charSpan);
          globalIndex++;
        });

        el.appendChild(wordSpan);
        if (wi < words.length - 1) {
          el.appendChild(document.createTextNode(" "));
          globalIndex++;
        }
      });

      el.dataset.splitDone = "true";
    });
  }

  /* ---------------------------------------------------------------------
   * 스크롤 리빌: [data-reveal], [data-reveal-stagger], .char-anim
   * ------------------------------------------------------------------- */
  function initScrollReveal() {
    const targets = document.querySelectorAll(
      "[data-reveal], [data-reveal-stagger], .char-anim"
    );
    if (!targets.length) return;

    if (!("IntersectionObserver" in window)) {
      targets.forEach((t) => t.classList.add("in-view"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    );

    targets.forEach((t) => observer.observe(t));
  }

  /* ---------------------------------------------------------------------
   * Works 목록 렌더링 (works-data.js의 WORKS 배열 기반)
   * index.html 에서만 동작
   * ------------------------------------------------------------------- */
  function renderWorks() {
    const root = document.querySelector("[data-works-root]");
    if (!root || typeof WORKS === "undefined") return;

    WORKS.forEach((work) => {
      const section = document.createElement("section");
      section.className = "work-section";
      section.id = `work-${work.id}`;

      const linkHref = work.link || "#";
      const isDisabled = !work.link;

      section.innerHTML = `
        <div class="work-section__bg">
          <img src="${work.heroImage}" alt="" />
        </div>
        <div class="work-section__content">
          <p class="work-number" data-reveal>${work.number}<span>/0${TOTAL_WORKS_SLOTS}</span></p>
          <div>
            <h2 class="work-title" data-split-chars>${work.title}</h2>
            <p class="work-subtitle" data-reveal>${work.subtitle}</p>
          </div>
          <div class="work-tags" data-reveal>
            ${work.tags.map((t) => `<span class="tag-pill">${t}</span>`).join("")}
          </div>
          <div class="work-about" data-reveal>
            <h2>About Project</h2>
            <p>${work.summary}</p>
            <a class="btn-pill${isDisabled ? " is-disabled" : ""}" href="${linkHref}" ${
        isDisabled ? 'aria-disabled="true" tabindex="-1"' : ""
      }>
              <span>${isDisabled ? "Coming soon" : "View Project"}</span>
              <img class="icon" src="assets/icons/arrow-right.svg" alt="" />
            </a>
          </div>
        </div>
        <a class="scroll-down" href="#work-next-${work.number}">
          <span>Scroll Down</span>
          <img class="icon" src="assets/icons/arrow-up.svg" style="transform:rotate(180deg)" alt="" />
        </a>
      `;
      root.appendChild(section);
    });

    // re-run enhancement passes for the freshly injected DOM
    splitChars();
    initScrollReveal();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initNavToggle();
    renderWorks();
    splitChars();
    initScrollReveal();
  });
})();
