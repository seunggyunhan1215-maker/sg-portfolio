# SG Han — Portfolio

BFA Industrial Designer (RISD)의 포트폴리오 사이트. 순수 HTML/CSS/JS로 빌드 도구 없이 제작했습니다.

## 로컬에서 보기

빌드 과정이 없으므로 정적 서버로 열기만 하면 됩니다.

```bash
python3 -m http.server 8000
# http://localhost:8000 접속
```

## 폴더 구조

```
index.html                     홈 (Works 목록 + Other CTA)
about.html                     About 페이지
works/5th-armored-brigade.html 프로젝트 상세 케이스 스터디 페이지
css/style.css                  전역 스타일 (디자인 토큰 포함)
js/works-data.js               ★ 새 프로젝트 추가는 이 파일의 WORKS 배열에 객체만 추가하면 됩니다
js/main.js                     내비게이션 토글, 스크롤 리빌 애니메이션 등
assets/img/                    이미지 (현재 플레이스홀더 — 아래 TODO 참고)
assets/icons/                  아이콘 SVG
```

## TODO — 실제 이미지로 교체

`assets/img/` 안의 이미지들은 네트워크 제약으로 Figma에서 직접 내려받지 못해
자리표시용(placeholder) 이미지로 채워져 있습니다. Figma에서 아래 레이어를 내보내기(Export)한 뒤
같은 파일명으로 교체해주세요.

| 파일명 | Figma 레이어 |
|---|---|
| mascot-hero.png | ChatGPT Image ... (Content 섹션 큰 마스코트) |
| tank-iron.jpg | 2023071008... (鐵/Iron 탱크 사진) |
| wind-tornado.jpg | istockphoto-1350246866... (風/Wind 사진) |
| mascot-details-blue.png | Gemini_Generated_Image_y1sh79... (Details 섹션 파란 배경) |
| headwear-closeup.png | 제목 없음 1 |
| uniform-closeup.png | 제목 없음 (1) 1 |
| windlegs-closeup.png | Gemini_Generated_Image_y1sh79... (크롭) |
| mascot-lineup-2d.png | Group 1707485417 1 |
| additional-pose-salute.png | Gemini_Generated_Image_qgasa9... |
| works-hero-bg.jpg | hf_20260811_064955... (works/1 배경) |
| works2-hero.jpg | freepik__the-style-is-candid... (works/2 배경) |
| about-portrait.jpg | FullSizeRender 1 (About 페이지 인물사진) |

## 새 프로젝트(Work) 추가하는 법

1. `js/works-data.js`의 `WORKS` 배열에 객체 하나를 추가합니다.
2. 대표 이미지를 `assets/img/`에 넣고 `heroImage` 경로를 지정합니다.
3. 상세 케이스 스터디 페이지가 있다면 `works/`에 새 HTML을 만들고 (기존 `works/5th-armored-brigade.html`을 복사해서 내용만 바꾸는 걸 추천) `link`에 경로를 지정합니다. 없다면 `link: null`로 두면 "Coming soon" 상태로 표시됩니다.

홈 화면에는 별도 코드 수정 없이 자동으로 반영됩니다.
