# CPA Tools 인수인계서

## 현재 상태 (2026-04-17 기준)

**프로젝트 위치:** `C:/_dev/_dev_core/10_개발/10_도메인별/홈페이지/cpatools`
**기술 스택:** Astro 6 + Starlight 0.33+ (정적 사이트)
**GitHub 리포:** https://github.com/dev-chlee/cpatools (public, master 브랜치)
**로컬 dev:** `npm run dev` → http://localhost:4321

## 지금까지 완료된 것

### 세션 1 (2026-04-16)
- [x] 디자인 문서 작성 (브레인스토밍)
- [x] Astro v1 사이트 빌드 (결국 폐기 — 스타일 불만족)
- [x] **Starlight로 전환** (사이드바 + 검색 + 다크모드)
- [x] 샘플 콘텐츠 7개 (도구 2, skills 2, 글 2, 소개 1)

### 세션 2 (2026-04-17)
- [x] GitHub 리포 생성 + 푸시 (`dev-chlee/cpatools`)
- [x] GitHub Discussions 활성화
- [x] Giscus 설정값 확보 (repo-id, category-id)
- [x] Giscus 컴포넌트 작성 + ContentFooter 오버라이드
- [x] 코드 리뷰 + 3개 이슈 수정
  - 리스너 누적 (window flag 가드)
  - 로딩 중 테마 경쟁 (retry + load 이벤트)
  - 불필요 slot 제거

## 다음 세션 즉시 할 일

### 1. Giscus App 설치 확인 (가장 중요)
**상태:** 미확인. 세션 2에서 설치 페이지만 열었고 실제 설치 완료 여부 모름.

**확인 방법:**
```
https://giscus.app 접속 → repo 필드에 "dev-chlee/cpatools" 입력
→ 녹색 체크 뜨면 설치 완료, 빨간 X면 미설치
```

**미설치 시:**
```
https://github.com/apps/giscus → Configure → dev-chlee 선택
→ Only select repositories → cpatools 체크 → Save
```

**설치 확인 후 테스트:**
```bash
npm run dev
# http://localhost:4321/tools/audit-sampling/ 열고 페이지 맨 아래 댓글 영역 확인
```

### 2. Vercel 배포
```bash
# 방법 A: Vercel 웹에서 GitHub 리포 연결 (추천)
# vercel.com/new → Import Git Repository → cpatools 선택 → Deploy

# 방법 B: CLI
npm i -g vercel
vercel --prod
```

**배포 후 해야 할 일:**
- [ ] `astro.config.mjs`에 `site: 'https://[vercel-url]'` 추가 (sitemap 경고 해결)
- [ ] 도메인 구매 + 연결 (선택)

### 3. 실제 콘텐츠 교체
현재 모든 샘플 콘텐츠는 가상. 교체 대상:
- [ ] `src/content/docs/index.mdx` — 실제 자기소개
- [ ] `src/content/docs/tools/*.mdx` — 실제 VBA/도구로
- [ ] `src/content/docs/skills/*.mdx` — 실제 Claude skills로
- [ ] `src/content/docs/posts/*.mdx` — 실제 블로그 글로
- [ ] `public/downloads/` — 실제 다운로드 파일 배치
- [ ] `astro.config.mjs` social 링크 — 실제 GitHub/LinkedIn URL

### 4. 템플릿 스크립트 (자동화)
```bash
npm run new:tool "도구 이름"
npm run new:post "글 제목"
npm run new:skill "스킬 이름"
```
→ frontmatter + meta-card 자동 생성. `scripts/new.mjs` 작성 필요.

## 선택 개선 (여유 있을 때)

- [ ] 커스텀 홈페이지 (Starlight 기본 docs 레이아웃 대신 랜딩 페이지)
- [ ] Keystatic CMS 연동 (브라우저에서 글 작성)
- [ ] `/registry.json` 자동 생성 (에이전트가 skills 설치 가능)
- [ ] i18n 영어 지원
- [ ] GitHub Actions CI (타입체크, 링크체크)

## 참고 자료

### 프로젝트 문서
- **디자인 문서:** `docs/superpowers/plans/2026-04-16-cpatools-site.md`
- **원본 스펙 (gstack):** `~/.gstack/projects/cpatools/chlee-main-design-20260416-103622.md`

### 주요 파일
- `astro.config.mjs` — Starlight 설정 (사이드바, 소셜, 컴포넌트 오버라이드)
- `src/content.config.ts` — Content Collections 스키마
- `src/styles/custom.css` — 커스텀 스타일 (download-btn, meta-card 등)
- `src/components/Giscus.astro` — 댓글 컴포넌트
- `src/components/ContentFooter.astro` — Giscus를 문서 하단에 주입

### 글 작성 방법
```
1. src/content/docs/{tools|skills|posts}/파일명.mdx 생성
2. frontmatter에 title, description 필수
3. 자동으로 사이드바에 등장, Pagefind 검색 인덱싱됨
```

### 섹션 추가 방법
```
1. src/content/docs/ 아래에 새 폴더 생성
2. astro.config.mjs의 sidebar 배열에 추가:
   { label: '새 섹션', autogenerate: { directory: '새폴더명' } }
```

### 개발 명령어
```bash
npm run dev        # 개발 서버 (포트 4321)
npm run build      # 프로덕션 빌드 → dist/
npm run preview    # 빌드 결과 미리보기
```

## Giscus 설정값 참고

```js
data-repo: dev-chlee/cpatools
data-repo-id: R_kgDOSE0Btw
data-category: General
data-category-id: DIC_kwDOSE0Bt84C7BTg
data-mapping: pathname
```

## 최근 커밋 히스토리
```
212eef0 fix(giscus): prevent listener leak and theme race on load
ea48fd0 feat: add Giscus comments via ContentFooter override
294503d docs: add TODO for next session
e332809 chore: init Starlight-based CPA Tools site
```
