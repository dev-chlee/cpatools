# CPA Tools 개인 브랜딩 사이트 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 한국 공인회계사의 개인 브랜딩 + 도구 공유 사이트를 Astro 5 기반으로 구축한다.

**Architecture:** Astro 5 Content Collections로 tools/skills/posts 3개 컬렉션을 관리하고, 공통 베이스 스키마를 extends하여 각 컬렉션의 메타데이터를 확장한다. 정적 빌드 후 Vercel에 배포. 댓글은 Giscus(GitHub Discussions)를 iframe으로 삽입.

**Tech Stack:** Astro 5.x, Tailwind CSS v4, MDX, Giscus, Pagefind, Vercel (adapter), TypeScript

**Design Doc:** `~/.gstack/projects/cpatools/chlee-main-design-20260416-103622.md`

---

## File Structure

```
cpatools/
├── public/
│   ├── favicon.svg
│   └── assets/                    # 다운로드 파일, 이미지 등
├── src/
│   ├── content.config.ts          # Content Collections 스키마 정의
│   ├── content/
│   │   ├── tools/                 # 도구 MDX 파일들
│   │   ├── skills/                # skills MDX 파일들
│   │   └── posts/                 # 블로그 MDX 파일들
│   ├── components/
│   │   ├── Header.astro           # 네비게이션 + 모바일 메뉴
│   │   ├── Footer.astro           # 푸터 링크, 저작권
│   │   ├── Hero.astro             # 홈페이지 히어로 섹션
│   │   ├── Card.astro             # 카탈로그용 카드 (공통)
│   │   ├── CatalogGrid.astro      # 카드 그리드 + 필터 UI
│   │   ├── TagFilter.astro        # 태그 필터 버튼들
│   │   ├── Giscus.astro           # Giscus 댓글 컴포넌트
│   │   └── Search.astro           # Pagefind 검색 UI
│   ├── layouts/
│   │   ├── BaseLayout.astro       # <html> 셸, 메타태그, Header/Footer
│   │   └── DetailLayout.astro     # 콘텐츠 상세 페이지 공통 레이아웃
│   ├── pages/
│   │   ├── index.astro            # 홈페이지
│   │   ├── about.astro            # About 페이지
│   │   ├── tools/
│   │   │   ├── index.astro        # 도구 카탈로그
│   │   │   └── [slug].astro       # 도구 상세
│   │   ├── skills/
│   │   │   ├── index.astro        # skills 카탈로그
│   │   │   └── [slug].astro       # skill 상세
│   │   ├── posts/
│   │   │   ├── index.astro        # 블로그 리스트
│   │   │   └── [slug].astro       # 아티클 상세 + Giscus
│   │   └── rss.xml.ts             # RSS 피드
│   └── styles/
│       └── global.css             # Tailwind v4 import + 커스텀 스타일
├── astro.config.mjs
├── tsconfig.json
├── package.json
└── .gitignore
```

---

### Task 1: 프로젝트 스캐폴딩 + Git 초기화

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `src/styles/global.css`

- [ ] **Step 1: Git 초기화**

```bash
cd "C:/_dev/_dev_core/10_개발/10_도메인별/홈페이지/cpatools"
git init
```

- [ ] **Step 2: Astro 프로젝트 생성**

```bash
npm create astro@latest . -- --template minimal --install --no-git --typescript strict
```

Expected: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro` 생성

- [ ] **Step 3: 의존성 설치**

```bash
npm install @astrojs/mdx @astrojs/sitemap @astrojs/vercel @astrojs/rss
npm install tailwindcss @tailwindcss/vite
npm install pagefind
```

- [ ] **Step 4: Astro 설정 파일 작성**

`astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://cpatools.dev',
  output: 'static',
  adapter: vercel(),
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 5: Tailwind CSS v4 글로벌 스타일 생성**

`src/styles/global.css`:
```css
@import "tailwindcss";

@theme {
  --font-sans: 'Pretendard', system-ui, -apple-system, sans-serif;
  --color-primary: #1e40af;
  --color-primary-light: #3b82f6;
  --color-surface: #ffffff;
  --color-surface-dim: #f8fafc;
  --color-text: #0f172a;
  --color-text-muted: #64748b;
  --color-border: #e2e8f0;
}
```

- [ ] **Step 6: .gitignore 작성**

`.gitignore`:
```
node_modules/
dist/
.astro/
.vercel/
.env
.env.*
```

- [ ] **Step 7: 빌드 확인**

```bash
npm run build
```

Expected: `dist/` 폴더에 정적 파일 생성, 에러 없음

- [ ] **Step 8: 커밋**

```bash
git add -A
git commit -m "chore: scaffold Astro 5 project with Tailwind v4, MDX, Vercel adapter"
```

---

### Task 2: Content Collections 스키마 정의

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/tools/.gitkeep`, `src/content/skills/.gitkeep`, `src/content/posts/.gitkeep`

- [ ] **Step 1: 콘텐츠 디렉토리 생성**

```bash
mkdir -p src/content/tools src/content/skills src/content/posts
touch src/content/tools/.gitkeep src/content/skills/.gitkeep src/content/posts/.gitkeep
```

- [ ] **Step 2: Content Collections 스키마 작성**

`src/content.config.ts`:
```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const baseSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  summary: z.string(),
  hero: z.string().optional(),
  draft: z.boolean().default(false),
});

const tools = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/tools' }),
  schema: baseSchema.extend({
    downloads: z.array(z.object({
      label: z.string(),
      url: z.string(),
    })).default([]),
    githubUrl: z.string().optional(),
    stack: z.array(z.string()).default([]),
    category: z.enum(['vba', 'python', 'webapp', 'excel', 'other']).default('other'),
  }),
});

const skills = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/skills' }),
  schema: baseSchema.extend({
    version: z.string().default('1.0.0'),
    install: z.string().optional(),
    requires: z.array(z.string()).default([]),
    platform: z.enum(['claude', 'chatgpt', 'universal']).default('claude'),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/posts' }),
  schema: baseSchema.extend({
    category: z.enum(['tutorial', 'essay', 'case-study', 'announcement']).default('essay'),
  }),
});

export const collections = { tools, skills, posts };
```

- [ ] **Step 3: 빌드 확인**

```bash
npm run build
```

Expected: Content Collections 스키마 인식, 에러 없음 (콘텐츠 0개라도 빌드 성공)

- [ ] **Step 4: 커밋**

```bash
git add src/content.config.ts src/content/
git commit -m "feat: define Content Collections schemas for tools, skills, posts"
```

---

### Task 3: Base Layout + Header + Footer

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Header 컴포넌트 작성**

`src/components/Header.astro`:
```astro
---
const navItems = [
  { label: '도구', href: '/tools' },
  { label: 'Skills', href: '/skills' },
  { label: '글', href: '/posts' },
  { label: '소개', href: '/about' },
];
const currentPath = Astro.url.pathname;
---

<header class="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
  <nav class="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
    <a href="/" class="text-lg font-bold text-text hover:text-primary transition-colors">
      CPA Tools
    </a>

    {/* Desktop nav */}
    <ul class="hidden md:flex gap-6">
      {navItems.map((item) => (
        <li>
          <a
            href={item.href}
            class:list={[
              'text-sm font-medium transition-colors',
              currentPath.startsWith(item.href)
                ? 'text-primary'
                : 'text-text-muted hover:text-text',
            ]}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>

    {/* Mobile menu button */}
    <button
      id="mobile-menu-btn"
      class="md:hidden p-2 text-text-muted hover:text-text"
      aria-label="메뉴 열기"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </nav>

  {/* Mobile menu */}
  <div id="mobile-menu" class="hidden md:hidden border-t border-border bg-surface">
    <ul class="px-4 py-3 space-y-2">
      {navItems.map((item) => (
        <li>
          <a
            href={item.href}
            class:list={[
              'block py-2 text-sm font-medium',
              currentPath.startsWith(item.href)
                ? 'text-primary'
                : 'text-text-muted hover:text-text',
            ]}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
</header>

<script>
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  btn?.addEventListener('click', () => {
    menu?.classList.toggle('hidden');
  });
</script>
```

- [ ] **Step 2: Footer 컴포넌트 작성**

`src/components/Footer.astro`:
```astro
---
const links = [
  { label: 'GitHub', href: 'https://github.com/chlee-cpa', icon: 'github' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/chlee-cpa', icon: 'linkedin' },
  { label: 'Email', href: 'mailto:chlee.core@gmail.com', icon: 'email' },
];
---

<footer class="border-t border-border bg-surface-dim mt-auto">
  <div class="max-w-5xl mx-auto px-4 py-8">
    <div class="flex flex-col md:flex-row justify-between items-center gap-4">
      <p class="text-sm text-text-muted">
        &copy; {new Date().getFullYear()} CPA Tools. 한국 공인회계사가 바이브코딩으로 만듭니다.
      </p>
      <div class="flex gap-4">
        {links.map((link) => (
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            class="text-text-muted hover:text-text transition-colors text-sm"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  </div>
</footer>
```

- [ ] **Step 3: BaseLayout 작성**

`src/layouts/BaseLayout.astro`:
```astro
---
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
  ogImage?: string;
}

const {
  title,
  description = '한국 공인회계사가 바이브코딩으로 실무 도구를 만들어 공유합니다.',
  ogImage,
} = Astro.props;

const canonicalUrl = new URL(Astro.url.pathname, Astro.site);
---

<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalUrl} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="alternate" type="application/rss+xml" title="CPA Tools RSS" href="/rss.xml" />

    {/* Open Graph */}
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonicalUrl} />
    {ogImage && <meta property="og:image" content={ogImage} />}

    <title>{title} | CPA Tools</title>
  </head>
  <body class="min-h-screen flex flex-col bg-surface text-text font-sans antialiased">
    <Header />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 4: 기존 index.astro를 BaseLayout으로 교체**

`src/pages/index.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="홈">
  <div class="max-w-5xl mx-auto px-4 py-16">
    <h1 class="text-3xl font-bold">준비 중...</h1>
  </div>
</BaseLayout>
```

- [ ] **Step 5: 개발 서버에서 확인**

```bash
npm run dev
```

Expected: `http://localhost:4321` 에서 Header(네비게이션) + 임시 본문 + Footer 렌더링

- [ ] **Step 6: 커밋**

```bash
git add src/layouts/ src/components/Header.astro src/components/Footer.astro src/pages/index.astro
git commit -m "feat: add BaseLayout with Header (mobile menu) and Footer"
```

---

### Task 4: 홈페이지 히어로 + 최근 업데이트

**Files:**
- Create: `src/components/Hero.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Hero 컴포넌트 작성**

`src/components/Hero.astro`:
```astro
---
interface EvidenceItem {
  label: string;
  href: string;
  description: string;
}

const evidence: EvidenceItem[] = [
  {
    label: '도구',
    href: '/tools',
    description: '바이브코딩으로 만든 감사·회계 실무 도구',
  },
  {
    label: 'Skills',
    href: '/skills',
    description: 'Claude·ChatGPT용 회계 업무 skills',
  },
  {
    label: '글',
    href: '/posts',
    description: '어떻게, 왜 만들었는가에 대한 기록',
  },
];
---

<section class="py-20 md:py-28">
  <div class="max-w-5xl mx-auto px-4">
    <h1 class="text-3xl md:text-5xl font-bold leading-tight text-text max-w-3xl">
      한국 공인회계사가<br />
      <span class="text-primary">바이브코딩</span>으로<br />
      실무 도구를 만들어 공유합니다.
    </h1>
    <p class="mt-6 text-lg text-text-muted max-w-2xl">
      회계사가 업무에 자주 사용할법한 도구를 직접 만들고,
      그 과정과 결과물을 이곳에 모아둡니다.
    </p>

    {/* Evidence cards */}
    <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      {evidence.map((item) => (
        <a
          href={item.href}
          class="group block p-6 rounded-lg border border-border bg-surface hover:border-primary-light hover:shadow-sm transition-all"
        >
          <h3 class="font-semibold text-text group-hover:text-primary transition-colors">
            {item.label}
          </h3>
          <p class="mt-2 text-sm text-text-muted">{item.description}</p>
        </a>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 2: index.astro에 Hero + 최근 업데이트 통합**

`src/pages/index.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import { getCollection } from 'astro:content';

const allTools = await getCollection('tools', ({ data }) => !data.draft);
const allSkills = await getCollection('skills', ({ data }) => !data.draft);
const allPosts = await getCollection('posts', ({ data }) => !data.draft);

const recentItems = [...allTools, ...allSkills, ...allPosts]
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  .slice(0, 6);

function getCollectionPath(id: string, collection: string): string {
  return `/${collection}/${id}`;
}

function getCollectionLabel(collection: string): string {
  const labels: Record<string, string> = { tools: '도구', skills: 'Skill', posts: '글' };
  return labels[collection] ?? collection;
}
---

<BaseLayout title="홈">
  <Hero />

  {recentItems.length > 0 && (
    <section class="pb-20">
      <div class="max-w-5xl mx-auto px-4">
        <h2 class="text-2xl font-bold mb-8">최근 업데이트</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentItems.map((item) => (
            <a
              href={getCollectionPath(item.id, item.collection)}
              class="group block p-5 rounded-lg border border-border hover:border-primary-light hover:shadow-sm transition-all"
            >
              <span class="text-xs font-medium text-primary-light uppercase tracking-wide">
                {getCollectionLabel(item.collection)}
              </span>
              <h3 class="mt-2 font-semibold text-text group-hover:text-primary transition-colors">
                {item.data.title}
              </h3>
              <p class="mt-1 text-sm text-text-muted line-clamp-2">{item.data.summary}</p>
              <time class="mt-3 block text-xs text-text-muted">
                {item.data.date.toLocaleDateString('ko-KR')}
              </time>
            </a>
          ))}
        </div>
      </div>
    </section>
  )}
</BaseLayout>
```

- [ ] **Step 3: 빌드 확인**

```bash
npm run build
```

Expected: 빌드 성공 (콘텐츠 0개일 때 최근 업데이트 섹션 스킵)

- [ ] **Step 4: 커밋**

```bash
git add src/components/Hero.astro src/pages/index.astro
git commit -m "feat: add homepage with hero section and recent updates grid"
```

---

### Task 5: 공통 카드 + 카탈로그 컴포넌트

**Files:**
- Create: `src/components/Card.astro`
- Create: `src/components/TagFilter.astro`

- [ ] **Step 1: Card 컴포넌트 작성**

`src/components/Card.astro`:
```astro
---
interface Props {
  title: string;
  summary: string;
  href: string;
  date: Date;
  tags?: string[];
  badge?: string;
}

const { title, summary, href, date, tags = [], badge } = Astro.props;
---

<a href={href} class="group block p-5 rounded-lg border border-border hover:border-primary-light hover:shadow-sm transition-all">
  {badge && (
    <span class="text-xs font-medium text-primary-light uppercase tracking-wide">
      {badge}
    </span>
  )}
  <h3 class="mt-1 font-semibold text-text group-hover:text-primary transition-colors">
    {title}
  </h3>
  <p class="mt-2 text-sm text-text-muted line-clamp-2">{summary}</p>
  {tags.length > 0 && (
    <div class="mt-3 flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span class="text-xs px-2 py-0.5 rounded-full bg-surface-dim text-text-muted">
          {tag}
        </span>
      ))}
    </div>
  )}
  <time class="mt-3 block text-xs text-text-muted">
    {date.toLocaleDateString('ko-KR')}
  </time>
</a>
```

- [ ] **Step 2: TagFilter 컴포넌트 작성**

`src/components/TagFilter.astro`:
```astro
---
interface Props {
  tags: string[];
  baseUrl: string;
}

const { tags, baseUrl } = Astro.props;
const currentTag = Astro.url.searchParams.get('tag');
---

<div class="flex flex-wrap gap-2 mb-8">
  <a
    href={baseUrl}
    class:list={[
      'text-sm px-3 py-1.5 rounded-full border transition-colors',
      !currentTag
        ? 'bg-primary text-white border-primary'
        : 'border-border text-text-muted hover:border-primary-light hover:text-text',
    ]}
  >
    전체
  </a>
  {tags.map((tag) => (
    <a
      href={`${baseUrl}?tag=${tag}`}
      class:list={[
        'text-sm px-3 py-1.5 rounded-full border transition-colors',
        currentTag === tag
          ? 'bg-primary text-white border-primary'
          : 'border-border text-text-muted hover:border-primary-light hover:text-text',
      ]}
    >
      {tag}
    </a>
  ))}
</div>
```

- [ ] **Step 3: 커밋**

```bash
git add src/components/Card.astro src/components/TagFilter.astro
git commit -m "feat: add shared Card and TagFilter components for catalogs"
```

---

### Task 6: 도구(Tools) 카탈로그 + 상세 페이지

**Files:**
- Create: `src/pages/tools/index.astro`
- Create: `src/pages/tools/[slug].astro`
- Create: `src/layouts/DetailLayout.astro`

- [ ] **Step 1: DetailLayout 작성 (공통 상세 페이지 레이아웃)**

`src/layouts/DetailLayout.astro`:
```astro
---
import BaseLayout from './BaseLayout.astro';

interface Props {
  title: string;
  summary: string;
  date: Date;
  updated?: Date;
  tags?: string[];
  backHref: string;
  backLabel: string;
}

const { title, summary, date, updated, tags = [], backHref, backLabel } = Astro.props;
---

<BaseLayout title={title} description={summary}>
  <article class="max-w-3xl mx-auto px-4 py-12">
    <a href={backHref} class="text-sm text-text-muted hover:text-primary transition-colors">
      &larr; {backLabel}
    </a>

    <header class="mt-6 mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-text">{title}</h1>
      <p class="mt-3 text-lg text-text-muted">{summary}</p>
      <div class="mt-4 flex flex-wrap items-center gap-3 text-sm text-text-muted">
        <time>{date.toLocaleDateString('ko-KR')}</time>
        {updated && (
          <span>· 수정: {updated.toLocaleDateString('ko-KR')}</span>
        )}
      </div>
      {tags.length > 0 && (
        <div class="mt-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span class="text-xs px-2 py-0.5 rounded-full bg-surface-dim text-text-muted">{tag}</span>
          ))}
        </div>
      )}
    </header>

    <div class="prose prose-slate max-w-none">
      <slot />
    </div>

    <slot name="after-content" />
  </article>
</BaseLayout>
```

- [ ] **Step 2: 도구 카탈로그 페이지 작성**

`src/pages/tools/index.astro`:
```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Card from '../../components/Card.astro';
import TagFilter from '../../components/TagFilter.astro';
import { getCollection } from 'astro:content';

const tools = await getCollection('tools', ({ data }) => !data.draft);
const sorted = tools.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

const allTags = [...new Set(sorted.flatMap((t) => t.data.tags))].sort();
const currentTag = Astro.url.searchParams.get('tag');
const filtered = currentTag
  ? sorted.filter((t) => t.data.tags.includes(currentTag))
  : sorted;
---

<BaseLayout title="도구" description="바이브코딩으로 만든 감사·회계 실무 도구 모음">
  <div class="max-w-5xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-2">도구</h1>
    <p class="text-text-muted mb-8">바이브코딩으로 만든 감사·회계 실무 도구 모음</p>

    {allTags.length > 0 && <TagFilter tags={allTags} baseUrl="/tools" />}

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filtered.map((tool) => (
        <Card
          title={tool.data.title}
          summary={tool.data.summary}
          href={`/tools/${tool.id}`}
          date={tool.data.date}
          tags={tool.data.tags}
          badge={tool.data.category}
        />
      ))}
    </div>

    {filtered.length === 0 && (
      <p class="text-text-muted text-center py-12">아직 도구가 없습니다.</p>
    )}
  </div>
</BaseLayout>
```

- [ ] **Step 3: 도구 상세 페이지 작성**

`src/pages/tools/[slug].astro`:
```astro
---
import DetailLayout from '../../layouts/DetailLayout.astro';
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const tools = await getCollection('tools', ({ data }) => !data.draft);
  return tools.map((tool) => ({ params: { slug: tool.id }, props: { tool } }));
}

const { tool } = Astro.props;
const { Content } = await render(tool);
---

<DetailLayout
  title={tool.data.title}
  summary={tool.data.summary}
  date={tool.data.date}
  updated={tool.data.updated}
  tags={tool.data.tags}
  backHref="/tools"
  backLabel="도구 목록"
>
  {/* Tool-specific meta */}
  {(tool.data.stack.length > 0 || tool.data.githubUrl) && (
    <div class="mb-8 p-4 rounded-lg bg-surface-dim border border-border">
      {tool.data.stack.length > 0 && (
        <div class="flex flex-wrap gap-2 mb-3">
          <span class="text-sm font-medium text-text">기술 스택:</span>
          {tool.data.stack.map((s) => (
            <span class="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">{s}</span>
          ))}
        </div>
      )}
      <div class="flex flex-wrap gap-3">
        {tool.data.githubUrl && (
          <a href={tool.data.githubUrl} target="_blank" rel="noopener noreferrer" class="text-sm text-primary hover:underline">
            GitHub &rarr;
          </a>
        )}
        {tool.data.downloads.map((dl) => (
          <a href={dl.url} class="text-sm text-primary hover:underline">
            {dl.label} &darr;
          </a>
        ))}
      </div>
    </div>
  )}

  <Content />
</DetailLayout>
```

- [ ] **Step 4: 빌드 확인**

```bash
npm run build
```

Expected: 빌드 성공 (콘텐츠 0개여도 카탈로그 빈 상태로 렌더)

- [ ] **Step 5: 커밋**

```bash
git add src/layouts/DetailLayout.astro src/pages/tools/
git commit -m "feat: add tools catalog and detail pages with tag filtering"
```

---

### Task 7: Skills 카탈로그 + 상세 페이지

**Files:**
- Create: `src/pages/skills/index.astro`
- Create: `src/pages/skills/[slug].astro`

- [ ] **Step 1: Skills 카탈로그 작성**

`src/pages/skills/index.astro`:
```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Card from '../../components/Card.astro';
import TagFilter from '../../components/TagFilter.astro';
import { getCollection } from 'astro:content';

const skills = await getCollection('skills', ({ data }) => !data.draft);
const sorted = skills.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

const allTags = [...new Set(sorted.flatMap((s) => s.data.tags))].sort();
const currentTag = Astro.url.searchParams.get('tag');
const filtered = currentTag
  ? sorted.filter((s) => s.data.tags.includes(currentTag))
  : sorted;
---

<BaseLayout title="Skills" description="Claude·ChatGPT용 회계 업무 skills 모음">
  <div class="max-w-5xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-2">Skills</h1>
    <p class="text-text-muted mb-8">Claude·ChatGPT용 회계 업무 skills 모음</p>

    {allTags.length > 0 && <TagFilter tags={allTags} baseUrl="/skills" />}

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filtered.map((skill) => (
        <Card
          title={skill.data.title}
          summary={skill.data.summary}
          href={`/skills/${skill.id}`}
          date={skill.data.date}
          tags={skill.data.tags}
          badge={`${skill.data.platform} · v${skill.data.version}`}
        />
      ))}
    </div>

    {filtered.length === 0 && (
      <p class="text-text-muted text-center py-12">아직 skill이 없습니다.</p>
    )}
  </div>
</BaseLayout>
```

- [ ] **Step 2: Skill 상세 페이지 작성**

`src/pages/skills/[slug].astro`:
```astro
---
import DetailLayout from '../../layouts/DetailLayout.astro';
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const skills = await getCollection('skills', ({ data }) => !data.draft);
  return skills.map((skill) => ({ params: { slug: skill.id }, props: { skill } }));
}

const { skill } = Astro.props;
const { Content } = await render(skill);
---

<DetailLayout
  title={skill.data.title}
  summary={skill.data.summary}
  date={skill.data.date}
  updated={skill.data.updated}
  tags={skill.data.tags}
  backHref="/skills"
  backLabel="Skills 목록"
>
  <div class="mb-8 p-4 rounded-lg bg-surface-dim border border-border">
    <div class="grid grid-cols-2 gap-3 text-sm">
      <div>
        <span class="font-medium text-text">플랫폼:</span>
        <span class="ml-1 text-text-muted">{skill.data.platform}</span>
      </div>
      <div>
        <span class="font-medium text-text">버전:</span>
        <span class="ml-1 text-text-muted">{skill.data.version}</span>
      </div>
      {skill.data.requires.length > 0 && (
        <div class="col-span-2">
          <span class="font-medium text-text">필요 조건:</span>
          <span class="ml-1 text-text-muted">{skill.data.requires.join(', ')}</span>
        </div>
      )}
    </div>
    {skill.data.install && (
      <div class="mt-3">
        <span class="text-sm font-medium text-text">설치:</span>
        <pre class="mt-1 p-2 rounded bg-text text-surface text-xs overflow-x-auto"><code>{skill.data.install}</code></pre>
      </div>
    )}
  </div>

  <Content />
</DetailLayout>
```

- [ ] **Step 3: 커밋**

```bash
git add src/pages/skills/
git commit -m "feat: add skills catalog and detail pages"
```

---

### Task 8: 블로그(Posts) 카탈로그 + 상세 + Giscus 댓글

**Files:**
- Create: `src/pages/posts/index.astro`
- Create: `src/pages/posts/[slug].astro`
- Create: `src/components/Giscus.astro`

- [ ] **Step 1: Giscus 컴포넌트 작성**

`src/components/Giscus.astro`:
```astro
---
interface Props {
  term?: string;
}

const { term } = Astro.props;
---

<section class="mt-12 pt-8 border-t border-border">
  <h2 class="text-lg font-semibold mb-4">댓글</h2>
  <div id="giscus-container">
    <script
      src="https://giscus.app/client.js"
      data-repo="OWNER/REPO"
      data-repo-id=""
      data-category="Comments"
      data-category-id=""
      data-mapping={term ? 'specific' : 'pathname'}
      data-term={term}
      data-strict="0"
      data-reactions-enabled="1"
      data-emit-metadata="0"
      data-input-position="top"
      data-theme="light"
      data-lang="ko"
      crossorigin="anonymous"
      async
    ></script>
  </div>
  <noscript>
    <p class="text-sm text-text-muted">댓글을 보려면 JavaScript를 활성화하세요.</p>
  </noscript>
</section>
```

> **NOTE:** `data-repo`, `data-repo-id`, `data-category-id`는 GitHub에 리포 생성 후 https://giscus.app 에서 값을 받아 교체해야 합니다.

- [ ] **Step 2: Posts 카탈로그 작성**

`src/pages/posts/index.astro`:
```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Card from '../../components/Card.astro';
import TagFilter from '../../components/TagFilter.astro';
import { getCollection } from 'astro:content';

const posts = await getCollection('posts', ({ data }) => !data.draft);
const sorted = posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

const allTags = [...new Set(sorted.flatMap((p) => p.data.tags))].sort();
const currentTag = Astro.url.searchParams.get('tag');
const filtered = currentTag
  ? sorted.filter((p) => p.data.tags.includes(currentTag))
  : sorted;
---

<BaseLayout title="글" description="회계·감사·AI·바이브코딩에 관한 글">
  <div class="max-w-5xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-2">글</h1>
    <p class="text-text-muted mb-8">어떻게, 왜 만들었는가에 대한 기록</p>

    {allTags.length > 0 && <TagFilter tags={allTags} baseUrl="/posts" />}

    <div class="space-y-4">
      {filtered.map((post) => (
        <Card
          title={post.data.title}
          summary={post.data.summary}
          href={`/posts/${post.id}`}
          date={post.data.date}
          tags={post.data.tags}
          badge={post.data.category}
        />
      ))}
    </div>

    {filtered.length === 0 && (
      <p class="text-text-muted text-center py-12">아직 글이 없습니다.</p>
    )}
  </div>
</BaseLayout>
```

- [ ] **Step 3: Post 상세 페이지 (Giscus 포함)**

`src/pages/posts/[slug].astro`:
```astro
---
import DetailLayout from '../../layouts/DetailLayout.astro';
import Giscus from '../../components/Giscus.astro';
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---

<DetailLayout
  title={post.data.title}
  summary={post.data.summary}
  date={post.data.date}
  updated={post.data.updated}
  tags={post.data.tags}
  backHref="/posts"
  backLabel="글 목록"
>
  <Content />

  <Giscus slot="after-content" />
</DetailLayout>
```

- [ ] **Step 4: 커밋**

```bash
git add src/components/Giscus.astro src/pages/posts/
git commit -m "feat: add posts catalog, detail pages, and Giscus comments"
```

---

### Task 9: About 페이지

**Files:**
- Create: `src/pages/about.astro`

- [ ] **Step 1: About 페이지 작성**

`src/pages/about.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';

const links = [
  { label: 'GitHub', href: 'https://github.com/chlee-cpa' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/chlee-cpa' },
  { label: 'Email', href: 'mailto:chlee.core@gmail.com' },
];
---

<BaseLayout title="소개" description="한국 공인회계사 + 바이브코더">
  <div class="max-w-3xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-8">소개</h1>

    <div class="prose prose-slate max-w-none">
      <p>
        한국 공인회계사(KICPA)입니다. 감사·회계 실무를 하면서,
        반복되는 업무를 자동화하는 데 개발과 AI를 적극적으로 활용하고 있습니다.
      </p>

      <p>
        VBA, Python, Claude Code, MCP 등으로 회계사가 실무에서 바로 쓸 수 있는
        도구와 skills를 만들고, 그 과정과 결과물을 이곳에 공유합니다.
      </p>

      <h2>연락</h2>
      <p>질문, 협업 제안, 피드백은 언제든 환영합니다.</p>
    </div>

    <div class="mt-8 flex flex-wrap gap-4">
      {links.map((link) => (
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-text hover:border-primary-light hover:text-primary transition-colors"
        >
          {link.label}
        </a>
      ))}
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 2: 커밋**

```bash
git add src/pages/about.astro
git commit -m "feat: add about page with bio and contact links"
```

---

### Task 10: RSS 피드

**Files:**
- Create: `src/pages/rss.xml.ts`

- [ ] **Step 1: RSS 엔드포인트 작성**

`src/pages/rss.xml.ts`:
```ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const tools = await getCollection('tools', ({ data }) => !data.draft);
  const skills = await getCollection('skills', ({ data }) => !data.draft);
  const posts = await getCollection('posts', ({ data }) => !data.draft);

  const allItems = [...tools, ...skills, ...posts]
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .slice(0, 20);

  return rss({
    title: 'CPA Tools',
    description: '한국 공인회계사가 바이브코딩으로 실무 도구를 만들어 공유합니다.',
    site: context.site!,
    items: allItems.map((item) => ({
      title: item.data.title,
      pubDate: item.data.date,
      description: item.data.summary,
      link: `/${item.collection}/${item.id}/`,
    })),
  });
}
```

- [ ] **Step 2: 빌드 후 RSS 출력 확인**

```bash
npm run build && cat dist/rss.xml | head -20
```

Expected: 유효한 RSS XML 출력

- [ ] **Step 3: 커밋**

```bash
git add src/pages/rss.xml.ts
git commit -m "feat: add RSS feed aggregating all collections"
```

---

### Task 11: 샘플 콘텐츠 추가 (컬렉션당 2개)

**Files:**
- Create: `src/content/tools/audit-sampling-tool.mdx`
- Create: `src/content/tools/workpaper-formatter.mdx`
- Create: `src/content/skills/audit-checklist-skill.mdx`
- Create: `src/content/skills/financial-analysis-skill.mdx`
- Create: `src/content/posts/why-vibe-coding.mdx`
- Create: `src/content/posts/first-post.mdx`

- [ ] **Step 1: 도구 샘플 2개**

`src/content/tools/audit-sampling-tool.mdx`:
```mdx
---
title: "감사 표본추출 자동화 도구"
date: 2026-04-10
tags: ["감사", "표본추출", "자동화"]
summary: "모집단에서 통계적 표본을 자동으로 추출하고, 추출 근거를 문서화하는 VBA 매크로"
category: vba
stack: ["VBA", "Excel"]
githubUrl: "https://github.com/chlee-cpa/audit-sampling"
downloads:
  - label: "Excel 파일 다운로드"
    url: "/assets/audit-sampling.xlsm"
---

## 개요

감사 현장에서 표본추출은 반복적이면서도 실수가 잦은 작업입니다.
이 도구는 모집단 데이터를 입력하면 통계적 표본을 자동으로 추출하고,
추출 근거를 감사조서 형식으로 출력합니다.

## 사용법

1. Excel 파일을 열고 모집단 시트에 데이터를 붙여넣기
2. "표본추출" 버튼 클릭
3. 신뢰수준, 중요성 금액 설정
4. 결과 시트에서 추출된 표본 확인

## 만든 이유

매번 수작업으로 난수를 돌리고 문서화하는 데 30분씩 걸렸습니다.
이 매크로를 만든 뒤 5분으로 줄었습니다.
```

`src/content/tools/workpaper-formatter.mdx`:
```mdx
---
title: "감사조서 서식 자동화"
date: 2026-04-08
tags: ["감사조서", "서식", "자동화"]
summary: "감사조서의 헤더·푸터·페이지 설정을 한 번에 통일하는 VBA 매크로"
category: vba
stack: ["VBA", "Excel"]
downloads: []
---

## 개요

감사조서 수십 개의 서식을 통일하는 단순 반복 작업을 자동화합니다.
헤더, 푸터, 페이지 여백, 인쇄 영역을 법인 기준에 맞춰 일괄 적용합니다.

## 사용법

1. 서식을 통일할 Excel 파일들을 하나의 폴더에 모으기
2. 매크로 실행 → 폴더 선택
3. 완료 후 결과 리포트 확인
```

- [ ] **Step 2: Skills 샘플 2개**

`src/content/skills/audit-checklist-skill.mdx`:
```mdx
---
title: "감사 체크리스트 생성 Skill"
date: 2026-04-12
tags: ["감사", "체크리스트", "Claude"]
summary: "감사 대상 회사의 산업과 규모에 맞는 감사 체크리스트를 자동 생성하는 Claude skill"
platform: claude
version: "1.0.0"
install: "Claude Code에서 /install-skill audit-checklist 실행"
requires: ["Claude Code", "회사 기본 정보"]
---

## 개요

감사 계획 단계에서 산업별·규모별 맞춤 체크리스트를 생성합니다.
한국채택국제회계기준(K-IFRS)과 감사기준서를 기반으로 합니다.

## 사용 예시

```
/audit-checklist --industry 제조업 --size 중견기업 --period 2025
```

위 명령 실행 시 해당 조건에 맞는 감사 체크리스트가 생성됩니다.
```

`src/content/skills/financial-analysis-skill.mdx`:
```mdx
---
title: "재무분석 리포트 Skill"
date: 2026-04-11
tags: ["재무분석", "리포트", "자동화"]
summary: "재무제표 데이터를 입력하면 주요 비율 분석과 추세 분석을 자동 생성"
platform: claude
version: "1.0.0"
requires: ["Claude Code", "재무제표 데이터 (CSV 또는 Excel)"]
---

## 개요

3개년 재무제표 데이터를 입력하면 유동성·수익성·안정성·활동성 비율을 계산하고,
전기 대비 변동 분석과 업종 평균 비교 리포트를 생성합니다.

## 출력 형식

마크다운 테이블 + 주요 이상치 하이라이트 + 감사 시 주의 포인트 요약
```

- [ ] **Step 3: Posts 샘플 2개**

`src/content/posts/why-vibe-coding.mdx`:
```mdx
---
title: "회계사가 바이브코딩을 하는 이유"
date: 2026-04-14
tags: ["바이브코딩", "회계사", "AI"]
summary: "왜 비개발자 회계사가 코딩을 하기 시작했고, 바이브코딩이 무엇을 바꾸는가"
category: essay
---

## 시작

저는 원래 코드를 한 줄도 몰랐습니다.
Excel 매크로 녹화 기능으로 VBA를 처음 접했고,
"이걸 자동화할 수 있다"는 사실에 빠져들었습니다.

## 바이브코딩이란

자연어로 의도를 설명하면 AI가 코드를 생성하는 방식입니다.
Claude Code, Cursor 같은 도구를 쓰면
비개발자도 실무에 바로 쓸 수 있는 도구를 만들 수 있습니다.

## 회계사에게 필요한 이유

감사·회계 업무는 반복 패턴이 많습니다.
그 패턴을 한 번 자동화하면,
팀 전체의 생산성이 올라갑니다.
```

`src/content/posts/first-post.mdx`:
```mdx
---
title: "CPA Tools 사이트를 시작합니다"
date: 2026-04-16
tags: ["공지"]
summary: "이 사이트의 목적과 앞으로 공유할 것들에 대한 안내"
category: announcement
---

## 소개

CPA Tools는 한국 공인회계사가 바이브코딩으로 만든
감사·회계 실무 도구와 skills를 공유하는 사이트입니다.

## 공유할 것들

- **도구**: VBA 매크로, Python 스크립트, 웹 앱 등 실무 자동화 도구
- **Skills**: Claude, ChatGPT 등에서 쓸 수 있는 회계 업무 전용 skills
- **글**: 어떻게, 왜 만들었는지에 대한 기록

피드백과 기여는 언제든 환영합니다.
```

- [ ] **Step 4: 빌드 확인**

```bash
npm run build
```

Expected: 스키마 검증 통과, 6개 콘텐츠 모두 렌더, 총 12+ HTML 페이지 생성

- [ ] **Step 5: 개발 서버에서 전체 흐름 확인**

```bash
npm run dev
```

확인 항목:
- `http://localhost:4321/` — 히어로 + 최근 업데이트 6개 카드
- `http://localhost:4321/tools` — 도구 2개 카드
- `http://localhost:4321/tools/audit-sampling-tool` — 상세 페이지, 기술스택·다운로드 링크
- `http://localhost:4321/skills` — skills 2개 카드
- `http://localhost:4321/posts` — 글 2개
- `http://localhost:4321/about` — 소개 + 링크

- [ ] **Step 6: 커밋**

```bash
git add src/content/
git commit -m "feat: add sample content (2 tools, 2 skills, 2 posts)"
```

---

### Task 12: Pagefind 검색 통합

**Files:**
- Create: `src/components/Search.astro`
- Modify: `src/components/Header.astro`
- Modify: `package.json` (postbuild script)

- [ ] **Step 1: package.json에 postbuild 추가**

`package.json`의 `scripts` 섹션에 추가:
```json
{
  "scripts": {
    "postbuild": "npx pagefind --site dist"
  }
}
```

- [ ] **Step 2: Search 컴포넌트 작성**

`src/components/Search.astro`:
```astro
<div id="search" class="hidden md:block"></div>

<script>
  async function initSearch() {
    const container = document.getElementById('search');
    if (!container) return;

    await import('/pagefind/pagefind-ui.js');
    // @ts-ignore
    new PagefindUI({
      element: '#search',
      showSubResults: false,
      showImages: false,
      translations: {
        placeholder: '검색...',
        zero_results: '결과 없음',
      },
    });
  }

  initSearch();
</script>

<link href="/pagefind/pagefind-ui.css" rel="stylesheet" />
```

- [ ] **Step 3: Header에 Search 삽입**

`src/components/Header.astro`에서 Desktop nav `<ul>` 뒤에 추가:
```astro
import Search from './Search.astro';
```
그리고 `</ul>` 다음 줄에:
```astro
<Search />
```

- [ ] **Step 4: 빌드 후 검색 인덱스 생성 확인**

```bash
npm run build
```

Expected: postbuild 단계에서 `pagefind` 실행, `dist/pagefind/` 디렉토리 생성

- [ ] **Step 5: 커밋**

```bash
git add src/components/Search.astro src/components/Header.astro package.json
git commit -m "feat: integrate Pagefind search in header"
```

---

### Task 13: favicon + public assets 정리

**Files:**
- Create: `public/favicon.svg`
- Create: `public/assets/.gitkeep`

- [ ] **Step 1: 기본 favicon 생성**

`public/favicon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#1e40af"/>
  <text x="16" y="23" font-size="18" font-weight="bold" fill="white" text-anchor="middle" font-family="system-ui">C</text>
</svg>
```

- [ ] **Step 2: assets 디렉토리 준비**

```bash
mkdir -p public/assets
touch public/assets/.gitkeep
```

- [ ] **Step 3: 커밋**

```bash
git add public/
git commit -m "chore: add favicon and public assets directory"
```

---

### Task 14: Vercel 배포 설정 + 최종 빌드 검증

**Files:**
- Create: `vercel.json` (선택)

- [ ] **Step 1: 최종 빌드**

```bash
npm run build
```

Expected: 에러 없이 `dist/` 에 전체 정적 파일 생성

- [ ] **Step 2: 로컬 프리뷰**

```bash
npx serve dist
```

Expected: `http://localhost:3000` 에서 프로덕션 빌드 확인. 모든 페이지·링크·검색 동작.

- [ ] **Step 3: 전체 커밋**

```bash
git add -A
git commit -m "chore: final build verification, ready for Vercel deploy"
```

- [ ] **Step 4: GitHub 리포 생성 + 푸시**

```bash
gh repo create cpatools --public --source=. --push
```

또는 수동:
```bash
git remote add origin https://github.com/YOUR_USERNAME/cpatools.git
git push -u origin main
```

- [ ] **Step 5: Vercel 연결**

1. https://vercel.com/new 접속
2. GitHub repo `cpatools` 선택
3. Framework preset: `Astro` 자동 감지
4. Deploy 클릭
5. 프로덕션 URL 확인

- [ ] **Step 6: Giscus 설정 완료**

1. https://giscus.app 접속
2. 리포 선택 → Discussions 활성화
3. `data-repo`, `data-repo-id`, `data-category-id` 값 복사
4. `src/components/Giscus.astro` 에 값 교체
5. 커밋 + 푸시

```bash
git add src/components/Giscus.astro
git commit -m "chore: configure Giscus with actual repo credentials"
git push
```

---

## 요약

| Task | 내용 | 예상 시간 |
|------|------|----------|
| 1 | 프로젝트 스캐폴딩 | 10분 |
| 2 | Content Collections 스키마 | 5분 |
| 3 | BaseLayout + Header + Footer | 15분 |
| 4 | 홈페이지 히어로 | 10분 |
| 5 | 공통 카드·필터 컴포넌트 | 10분 |
| 6 | Tools 카탈로그 + 상세 | 10분 |
| 7 | Skills 카탈로그 + 상세 | 10분 |
| 8 | Posts + Giscus 댓글 | 15분 |
| 9 | About 페이지 | 5분 |
| 10 | RSS 피드 | 5분 |
| 11 | 샘플 콘텐츠 6개 | 15분 |
| 12 | Pagefind 검색 | 10분 |
| 13 | favicon + assets | 3분 |
| 14 | 배포 + Giscus 설정 | 15분 |
| **합계** | | **~2시간 30분** |
