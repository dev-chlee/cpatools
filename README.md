# CPA Tools

한국 공인회계사가 바이브코딩으로 실무 도구를 만들어 공유합니다.

**Live:** https://cpatools.vercel.app

## 콘텐츠

- **도구** — VBA 매크로, Python 스크립트, 웹 앱 등 감사·회계 실무 자동화 도구
- **AI Skills** — Claude·ChatGPT 등에서 쓸 수 있는 회계 업무 전용 skills
- **글** — 어떻게, 왜 만들었는지에 대한 기록

## 기술 스택

- [Astro 6](https://astro.build) + [Starlight](https://starlight.astro.build)
- Tailwind 기반 커스텀 스타일
- [Giscus](https://giscus.app) (GitHub Discussions 댓글)
- [Pagefind](https://pagefind.app) 검색
- [Vercel](https://vercel.com) 배포

## 로컬 실행

```bash
npm install
npm run dev     # http://localhost:4321
npm run build   # dist/
npm run preview # 빌드 프리뷰
```

## 글 추가

`src/content/docs/{tools,skills,posts}/` 아래에 `.mdx` 파일 추가. 사이드바 자동 생성.

```mdx
---
title: "제목"
description: "한 줄 요약"
---

본문 마크다운.
```

## 라이선스

MIT © dev-chlee
