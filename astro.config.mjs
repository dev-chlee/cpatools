import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://cpatools.vercel.app',
  integrations: [
    starlight({
      title: 'CPA Tools',
      description: '한국 공인회계사가 바이브코딩으로 실무 도구를 만들어 공유합니다.',
      defaultLocale: 'root',
      locales: {
        root: { label: '한국어', lang: 'ko' },
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/chlee-cpa' },
        { icon: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/chlee-cpa' },
        { icon: 'email', label: 'Email', href: 'mailto:chlee.core@gmail.com' },
      ],
      sidebar: [
        {
          label: '시작하기',
          items: [
            { label: '소개', slug: '' },
          ],
        },
        {
          label: '도구',
          autogenerate: { directory: 'tools' },
        },
        {
          label: 'AI Skills',
          autogenerate: { directory: 'skills' },
        },
        {
          label: '글',
          autogenerate: { directory: 'posts' },
        },
      ],
      customCss: ['./src/styles/custom.css'],
      components: {
        Footer: './src/components/Footer.astro',
      },
    }),
  ],
});
