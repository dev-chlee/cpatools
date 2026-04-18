#!/usr/bin/env node
// Generate dummy MDX content for tools/skills/posts to test mobile UX with many entries.
// Files prefixed with `dummy-` for easy cleanup: rm src/content/docs/**/dummy-*.mdx

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const PER_SECTION = 15;

const categories = ['감사', '세무', '회계', '자문', '결산', '분개', '재고', '원가', '내부통제', '재무분석', '예산', '연결', '리스', '환산', '리포트'];
const verbs = ['자동화', '검증', '생성', '비교', '점검', '추출', '집계', '검색', '변환', '시각화', '템플릿', '체크리스트', '계산기', '도우미', '마법사'];

const bodyParas = [
  '회계감사 실무에서 자주 마주치는 반복 작업을 한 번에 끝내기 위해 만들었습니다.',
  '입력 데이터 형식은 K-IFRS 권장 양식을 따르며, 결과는 감사조서 표준 포맷으로 출력됩니다.',
  '실제 클라이언트 데이터로 30회 이상 검증한 뒤 공유합니다. 산업 특수성은 별도 옵션으로 적용 가능.',
  '사용 전 백업 권장. 결과물의 정확성은 사용자 책임이며, 본 도구는 보조 수단입니다.',
  '버그·개선 제안은 GitHub Issues로 알려주시면 다음 버전에 반영합니다.',
  '비슷한 워크플로를 가진 회계사 분들과 함께 발전시키고 싶습니다.',
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pickN(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function generateTool(i) {
  const cat = pick(categories);
  const verb = pick(verbs);
  const title = `${cat} ${verb} 도구 ${i + 1}`;
  const desc = `${cat} 업무의 ${verb} 단계를 효율화하는 더미 도구입니다.`;
  return `---
title: "${title}"
description: "${desc}"
---

<div class="meta-card">
  <dl>
    <dt>기술 스택</dt>
    <dd>VBA, Excel</dd>
    <dt>카테고리</dt>
    <dd>${cat} · ${verb}</dd>
  </dl>
  <a href="/downloads/dummy-tool-${(i % 5) + 1}.xlsm" class="download-btn">📥 Excel 파일 다운로드</a>
</div>

## 개요

${pickN(bodyParas, 3).join('\n\n')}

## 사용법

1. Excel 파일을 열고 입력 시트에 데이터 붙여넣기
2. "${verb} 실행" 버튼 클릭
3. 결과 시트 확인 후 감사조서에 첨부

## 주의사항

${pick(bodyParas)}
`;
}

function generateSkill(i) {
  const cat = pick(categories);
  const verb = pick(verbs);
  const title = `${cat} ${verb} Skill ${i + 1}`;
  const desc = `${cat} 업무 ${verb}를 위한 더미 Claude skill입니다.`;
  const platform = pick(['claude', 'chatgpt', 'universal']);
  return `---
title: "${title}"
description: "${desc}"
---

<div class="meta-card">
  <dl>
    <dt>플랫폼</dt>
    <dd>${platform}</dd>
    <dt>버전</dt>
    <dd>1.0.${i}</dd>
    <dt>필요 조건</dt>
    <dd>Claude Code, ${cat} 관련 데이터</dd>
  </dl>
</div>

## 개요

${pickN(bodyParas, 3).join('\n\n')}

## 사용 예시

\`\`\`bash
/${verb}-skill --category ${cat} --period 2026
\`\`\`
`;
}

function generatePost(i) {
  const cat = pick(categories);
  const verb = pick(verbs);
  const title = `${cat} 업무에서 ${verb}를 자동화한 이야기 ${i + 1}`;
  const desc = `${cat} 영역에서 반복 작업을 자동화하면서 배운 점을 정리합니다.`;
  return `---
title: "${title}"
description: "${desc}"
---

## 시작

${pick(bodyParas)}

## 본론

${pickN(bodyParas, 4).join('\n\n')}

## 결론

${pick(bodyParas)}
`;
}

const sections = [
  { dir: 'tools', generator: generateTool, prefix: 'dummy-tool' },
  { dir: 'skills', generator: generateSkill, prefix: 'dummy-skill' },
  { dir: 'posts', generator: generatePost, prefix: 'dummy-post' },
];

let total = 0;
for (const { dir, generator, prefix } of sections) {
  const outDir = join(ROOT, 'src', 'content', 'docs', dir);
  mkdirSync(outDir, { recursive: true });
  for (let i = 0; i < PER_SECTION; i++) {
    const filename = `${prefix}-${String(i + 1).padStart(2, '0')}.mdx`;
    writeFileSync(join(outDir, filename), generator(i), 'utf8');
    total++;
  }
  console.log(`Generated ${PER_SECTION} files in src/content/docs/${dir}/`);
}

console.log(`\nDone. ${total} dummy MDX files created.`);
console.log('Cleanup later: rm src/content/docs/{tools,skills,posts}/dummy-*.mdx');
