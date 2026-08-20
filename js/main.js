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
   * GNB 헤더 — 스크롤 시 살짝만 줄어드는(sticky) 애니메이션.
   * 처음부터 화면 맨 위에 딱 붙어있는 대신, 스크롤을 조금이라도 내리면
   * 세로 패딩이 부드럽게 살짝만 줄어들며 자리를 잡는 느낌을 줍니다.
   * ------------------------------------------------------------------- */
  function initStickyHeader() {
    const header = document.querySelector("[data-header]");
    if (!header) return;

    const THRESHOLD = 24; // px — 이만큼 스크롤되면 "scrolled" 상태로 전환

    function update() {
      header.classList.toggle("is-scrolled", window.scrollY > THRESHOLD);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* ---------------------------------------------------------------------
   * 하단 Scroll Down 바 — 화면(뷰포트) 기준으로 고정되어 있어야 하므로,
   * 지금 보고 있는 work-section에 속한 바만 보이도록 토글합니다.
   * ------------------------------------------------------------------- */
  function initScrollDownBar() {
    const sections = document.querySelectorAll(".work-section");
    if (!sections.length) return;

    if (!("IntersectionObserver" in window)) {
      // 폴백: 옵저버 미지원 시 항상 표시
      document
        .querySelectorAll(".scroll-down")
        .forEach((bar) => bar.classList.add("is-active"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const bar = entry.target.querySelector(".scroll-down");
          if (bar) bar.classList.toggle("is-active", entry.isIntersecting);
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => observer.observe(section));
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
      "[data-reveal], [data-reveal-stagger], [data-reveal-curtain], .char-anim"
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
   * Hover blob — plus-ex.com 스타일 참고
   * 썸네일/이미지 카드에 마우스를 올리면 부드럽게 마우스를 따라다니는
   * 블러 처리된 컬러 블롭이 나타나는 효과.
   *
   * - target 요소에 마우스를 올리면 .hover-blob div가 커서를 이징(lerp)으로
   *   부드럽게 따라감 (requestAnimationFrame 루프).
   * - 블롭 색상은 target(or 하위 요소)의 data-blob-color 속성으로 지정.
   * - 터치 기기(hover 미지원)에서는 아예 리스너를 붙이지 않음.
   * ------------------------------------------------------------------- */
  function initHoverBlob() {
    const supportsHover =
      !window.matchMedia || window.matchMedia("(hover: hover)").matches;
    if (!supportsHover) return;

    function attachBlob(target, options) {
      options = options || {};
      if (!target || target.dataset.blobInit) return;
      target.dataset.blobInit = "true";
      target.classList.add("hover-blob-target");

      const blob = document.createElement("div");
      blob.className = "hover-blob";
      blob.style.background =
        target.dataset.blobColor || options.defaultColor || "var(--color-accent)";

      // 배경 이미지 바로 뒤에 삽입해, 배경 이미지 위 / 텍스트·캡션 아래에
      // 오도록 DOM 쌓임 순서를 맞춘다 (자세한 설명은 style.css 주석 참고).
      if (options.insertAfter) {
        options.insertAfter.insertAdjacentElement("afterend", blob);
      } else {
        target.appendChild(blob);
      }

      let mouseX = 0;
      let mouseY = 0;
      let curX = 0;
      let curY = 0;
      let raf = null;
      let isActive = false;

      function step() {
        curX += (mouseX - curX) * 0.16;
        curY += (mouseY - curY) * 0.16;
        blob.style.transform = `translate3d(${curX}px, ${curY}px, 0) scale(${
          isActive ? 1 : 0.85
        })`;

        if (
          isActive ||
          Math.abs(mouseX - curX) > 0.5 ||
          Math.abs(mouseY - curY) > 0.5
        ) {
          raf = requestAnimationFrame(step);
        } else {
          raf = null;
        }
      }

      function ensureLoop() {
        if (!raf) raf = requestAnimationFrame(step);
      }

      target.addEventListener("pointerenter", (e) => {
        const rect = target.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        curX = mouseX;
        curY = mouseY;
        isActive = true;
        target.classList.add("is-hovering");
        ensureLoop();
      });

      target.addEventListener("pointermove", (e) => {
        const rect = target.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        ensureLoop();
      });

      target.addEventListener("pointerleave", () => {
        isActive = false;
        target.classList.remove("is-hovering");
        ensureLoop();
      });
    }

    // 홈 화면의 각 Work 섹션 — 스크롤로 넘기는 하나하나가 곧 "작업물 썸네일"
    document.querySelectorAll(".work-section").forEach((section) => {
      if (section.dataset.blobInit) return;
      const bg = section.querySelector(".work-section__bg");
      attachBlob(section, {
        insertAfter: bg || null,
        defaultColor: "var(--color-accent)",
      });
    });

    // 프로젝트 상세 페이지의 사진/미디어 카드
    document
      .querySelectorAll(".photo-card, .media-card, .detail-media-row .thumb")
      .forEach((card) => attachBlob(card, { defaultColor: "var(--color-accent)" }));
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
      section.dataset.revealCurtain = "true";
      if (work.blobColor) {
        section.dataset.blobColor = work.blobColor;
      }

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
        <div class="work-curtain" aria-hidden="true" style="background:${
          work.blobColor || "var(--color-accent)"
        }"></div>
      `;
      root.appendChild(section);
    });

    // re-run enhancement passes for the freshly injected DOM
    splitChars();
    initScrollReveal();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initNavToggle();
    initStickyHeader();
    renderWorks();
    splitChars();
    initScrollReveal();
    initHoverBlob();
    initScrollDownBar();
  });
})();
