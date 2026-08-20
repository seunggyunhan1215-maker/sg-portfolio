/**
 * Works data
 * ----------
 * 새 프로젝트를 추가하려면 아래 배열에 객체 하나만 더 넣으면 됩니다.
 * (레이아웃 코드는 건드릴 필요 없습니다.)
 *
 * fields:
 *   id        고유 id (URL, DOM id 등에 사용)
 *   title     프로젝트 제목
 *   subtitle  한 줄 설명
 *   tags      태그 배열 (예: ["UIUX", "Graphic Design"])
 *   heroImage 카드 배경/대표 이미지 경로
 *   heroPosition 'left' | 'right'  대표 이미지가 카드에서 어느 쪽에 배치될지
 *   summary   About Project 본문
 *   link      상세 페이지 경로. 아직 상세 페이지가 없으면 null
 *   blobColor (선택) 마우스를 올렸을 때 나타나는 블러 블롭의 색상 (hex/css color).
 *             생략하면 기본 accent 색상(--color-accent)이 사용됩니다.
 */
const WORKS = [
  {
    id: "5th-armored-brigade",
    number: "01",
    title: "Screen Notes",
    subtitle: "memo on a lock screen",
    tags: ["UIUX", "Graphic Design"],
    heroImage: "assets/img/works-hero-bg.jpg",
    heroPosition: "right",
    summary:
      "Drayp is an innovative SaaS solution designed to empower businesses with smarter workflows — all within the convenience of a few clicks.",
    link: "works/5th-armored-brigade.html",
    blobColor: "#0079be",
  },
  {
    id: "screen-notes-2",
    number: "02",
    title: "Screen Notes",
    subtitle: "memo on a lock screen",
    tags: ["UIUX", "BX"],
    heroImage: "assets/img/works2-hero.jpg",
    heroPosition: "right",
    summary:
      "Drayp is an innovative SaaS solution designed to empower businesses with smarter workflows — all within the convenience of a few clicks.",
    link: null,
    blobColor: "#2560fd",
  },
  // 03~07 추가 예정 — 아래처럼 객체를 추가하면 홈 화면에 자동으로 반영됩니다.
  // {
  //   id: "my-new-project",
  //   number: "03",
  //   title: "New Project",
  //   subtitle: "one line description",
  //   tags: ["Tag1", "Tag2"],
  //   heroImage: "assets/img/new-project-hero.jpg",
  //   heroPosition: "right",
  //   summary: "About project text...",
  //   link: "works/new-project.html",
  //   blobColor: "#2560fd",
  // },
];

const TOTAL_WORKS_SLOTS = 7; // Works 인덱스 우측 네비게이션에 표시할 총 슬롯 수 (01~07)
