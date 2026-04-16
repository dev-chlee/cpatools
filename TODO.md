# CPA Tools 다음 할일

## 이번 세션 완료
- [x] 디자인 문서 작성 (브레인스토밍)
- [x] Starlight 기반 사이트 구축 (사이드바 + 검색 + 다크모드)
- [x] 샘플 콘텐츠 7개 (도구 2, skills 2, 글 2, 소개 1)
- [x] 프로젝트 정리 (Starlight로 통일)

## 다음 세션

### 1순위: 배포
- [ ] GitHub 리포 생성 (`gh repo create cpatools --public --source=. --push`)
- [ ] Vercel 연결 (GitHub 리포 → Vercel 자동 빌드)
- [ ] `astro.config.mjs`에 `site` 옵션 추가 (sitemap 경고 해결)
- [ ] 도메인 확보 + 연결 (선택)

### 2순위: Giscus 댓글
- [ ] GitHub Discussions 활성화
- [ ] https://giscus.app 에서 설정값 발급
- [ ] Starlight 컴포넌트 오버라이드로 Giscus 삽입
- [ ] 도구/skills/글 상세 페이지 하단에 댓글 영역 추가

### 3순위: 실제 콘텐츠 교체
- [ ] 샘플 MDX → 실제 도구/skills/글로 교체
- [ ] 다운로드 파일 `public/downloads/`에 배치
- [ ] 소개 페이지 실제 프로필로 업데이트
- [ ] 소셜 링크 (GitHub, LinkedIn) 실제 URL로 교체

### 4순위: 자동화
- [ ] 템플릿 스크립트 (`npm run new:tool`, `npm run new:post`, `npm run new:skill`)
- [ ] frontmatter + meta-card 자동 생성

### 5순위: 선택 개선
- [ ] 커스텀 홈페이지 (Starlight 기본 대신 히어로 랜딩)
- [ ] Keystatic CMS 연동 (필요 시)
- [ ] /registry.json 자동 생성 (Approach C)
- [ ] i18n 영어 지원

## 참고
- 디자인 문서: `docs/superpowers/plans/2026-04-16-cpatools-site.md`
- gstack 디자인 문서: `~/.gstack/projects/cpatools/chlee-main-design-20260416-103622.md`
- dev 서버: `npm run dev` (http://localhost:4321)
- 빌드: `npm run build`
- 글 추가: `src/content/docs/{tools,skills,posts}/파일명.mdx` 생성
- 섹션 추가: 폴더 생성 + `astro.config.mjs` sidebar에 등록
