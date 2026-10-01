<script lang="ts">
  import { _, locale } from 'svelte-i18n'
  import { faqs } from '$lib/content';
  import heroImg from '$lib/assets/hero.webp';
  import type { PageProps } from './$types';
	import ExperienceCard from '$lib/components/ExperienceCard.svelte';

  let { data }: PageProps = $props();

  console.log('data', data);
  

  const lang = $derived($locale);
  const projects = [] as any;
  const articles = [] as any;
  const experience = $derived(data.experiences)
  
</script>

<div>
  <!-- HERO -->
  <section class="grid grid-cols-12 border-b border-border">
    <div class="col-span-12 lg:col-span-7 px-5 md:px-10 py-14 md:py-24 border-r border-border relative">
      <p class="eyebrow mb-8">{$_('hero.eyebrow')}</p>
      <h1 class="display-xl">
        {$_('hero.title.1')}<br />
        {$_('hero.title.2')}<br />
        <span class="text-accent italic font-medium">{$_('hero.title.elegant')}</span>
      </h1>
      <p class="mt-10 max-w-md text-foreground/80 leading-relaxed">
        {$_('hero.description')}
      </p>
      <div class="mt-10 flex flex-wrap gap-4">
        <a
          href='/projects'
          class="px-6 py-3 border border-border label-mono hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          {$_('hero.view_projects')}
        </a>
        <a
          href="/about"
          class="px-6 py-3 label-mono underline decoration-dotted underline-offset-4 hover:text-accent"
        >
          {$_('hero.about_me')}
        </a>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-5 relative min-h-[320px] lg:min-h-[600px]">
      <img
        src={heroImg}
        alt="Engraved illustration of a scholar at the sea"
        width="1280"
        height="1280"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute bottom-4 right-4 label-mono text-parchment/80 mix-blend-difference">
        Pl. I — Vigil
      </div>
    </div>
  </section>

  <!-- INTRO STATS -->
  <section class="grid grid-cols-2 md:grid-cols-4 border-b border-border">
    {#each [
      ['7+', $_('stats.years')],
      ['21+', $_('stats.projects')],
      ['2', $_('stats.countries')],
      ['120+', $_('stats.repos')],
    ] as [n, l], i}
      <div
        class="px-5 md:px-8 py-10 {i < 3 ? 'border-r border-border' : ''} {i < 2 ? 'border-b md:border-b-0 border-border' : ''}"
      >
        <div class="font-display text-4xl md:text-6xl">{n}</div>
        <div class="eyebrow mt-3">{l}</div>
      </div>
    {/each}
  </section>

  <!-- ABOUT TEASER -->
  <section class="grid grid-cols-12 border-b border-border">
    <div class="col-span-12 md:col-span-4 px-5 md:px-10 py-14 border-r border-border">
      <p class="eyebrow">{$_('about.eyebrow')}</p>
      <h2 class="display-lg mt-6">{$_('about.title').split('.')[0]}<br />{$_('about.title').split('.')[1] || ''}</h2>
    </div>
    <div class="col-span-12 md:col-span-8 px-5 md:px-10 py-14">
      {#if lang === 'en'}
        <p class="text-lg md:text-xl leading-relaxed text-foreground/90 max-w-2xl">
          I am a Software Engineer &amp; Full Stack JavaScript Specialist with over 5 years of
          experience in architecting, developing, and deploying scalable web and mobile
          applications. My approach combines deep technical expertise with a strong Software
          Engineering mindset to solve complex business challenges through elegant, high-performance
          solutions.
        </p>
        <p class="mt-6 text-foreground/70 leading-relaxed max-w-2xl">
          I believe that good code isn't just code that "works," but code that is clean,
          maintainable, and efficient. My philosophy is rooted in a deep understanding of data
          structures and application performance
        </p>
      {:else}
        <p class="text-lg md:text-xl leading-relaxed text-foreground/90 max-w-2xl">
          Saya adalah Software Engineer &amp; Full Stack JavaScript Specialist dengan lebih dari 5 tahun
          pengalaman dalam merancang, membangun, dan meluncurkan aplikasi web dan mobile yang skalabel.
          Pendekatan saya menggabungkan keahlian teknis yang mendalam dengan pola pikir Software Engineering
          yang kuat untuk menyelesaikan tantangan bisnis yang kompleks melalui solusi yang elegan dan berperforma tinggi.
        </p>
        <p class="mt-6 text-foreground/70 leading-relaxed max-w-2xl">
          Saya percaya bahwa kode yang baik bukan hanya kode yang "berjalan", tetapi kode yang bersih,
          mudah dirawat, dan efisien. Filosofi saya berakar pada pemahaman mendalam tentang struktur data
          dan performa aplikasi.
        </p>
      {/if}
      <a
        href="/about"
        class="inline-block mt-8 label-mono underline decoration-dotted underline-offset-4 hover:text-accent"
      >
        {$_('about.read_more')}
      </a>
    </div>
  </section>

  <!-- EXPERIENCE -->
  <section class="grid grid-cols-12 border-b border-border">
    <div class="col-span-12 md:col-span-4 px-5 md:px-10 py-14 border-r border-border">
      <p class="eyebrow">{$_('career.eyebrow')}</p>
      <h2 class="display-lg mt-6">{$_('career.title').split(' ')[0]}<br />{$_('career.title').split(' ')[1] || ''}</h2>
    </div>
    <div class="col-span-12 md:col-span-8 max-h-[650px] overflow-y-auto">
      {#each experience as e, i}
        <ExperienceCard
          startMonth={e.startMonth}
          startYear={e.startYear}
          endMonth={e.endMonth}
          endYear={e.endYear}
          role={e.position}
          company={e.organization}
          description={e.description}
          isLast={i === experience.length - 1}
        />
      {/each}
    </div>
  </section>

  <!-- LATEST PROJECTS -->
  <section class="border-b border-border">
    <div class="grid grid-cols-12 border-b border-border">
      <div class="col-span-8 px-5 md:px-10 py-8 border-r border-border">
        <p class="eyebrow">{$_('projects.eyebrow')}</p>
        <h2 class="display-lg mt-3">{$_('projects.title')}</h2>
      </div>
      <a
        href="/projects"
        class="col-span-4 px-5 md:px-10 py-8 flex items-center justify-end label-mono hover:text-accent"
      >
        {$_('projects.view_all')}
      </a>
    </div>
    <div>
      {#each projects as p, i}
        {@const pTitle = (lang === 'id' && p.titleId) ? p.titleId : p.title}
        {@const pExcerpt = (lang === 'id' && p.excerptId) ? p.excerptId : p.excerpt}
        <a
          href={`/projects/${p.slug}`}
          class="grid grid-cols-12 group {i < articles.length - 1 ? 'border-b border-border' : ''} hover:bg-secondary/40 transition-colors"
        >
          <div class="col-span-12 md:col-span-2 px-5 md:px-8 py-6 label-mono text-muted-foreground border-b md:border-b-0 md:border-r border-border">
            {new Date(p.createdAt).toLocaleDateString(lang === 'en' ? 'en-US' : 'id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div class="col-span-12 md:col-span-7 px-5 md:px-8 py-6 md:border-r border-border">
            <p class="font-display text-2xl md:text-3xl group-hover:text-accent transition-colors">
              {pTitle}
            </p>
            <p class="mt-2 text-foreground/70">{pExcerpt}</p>
          </div>
          <div class="col-span-12 md:col-span-3 px-5 md:px-8 py-6 flex items-center justify-between md:justify-end label-mono text-muted-foreground gap-4">
            <span>Detail</span>
            <span>→</span>
          </div>
        </a>
      {/each}
    </div>
  </section>

  <!-- LATEST ARTICLES -->
  <section class="border-b border-border">
    <div class="grid grid-cols-12 border-b border-border">
      <div class="col-span-8 px-5 md:px-10 py-8 border-r border-border">
        <p class="eyebrow">{$_('journal.eyebrow')}</p>
        <h2 class="display-lg mt-3">{$_('journal.title')}</h2>
      </div>
      <a
        href="/blog"
        class="col-span-4 px-5 md:px-10 py-8 flex items-center justify-end label-mono hover:text-accent"
      >
        {$_('journal.view_all')}
      </a>
    </div>
    <div>
      {#each articles as a, i}
        {@const aTitle = (lang === 'id' && a.titleId) ? a.titleId : a.title}
        {@const aExcerpt = (lang === 'id' && a.excerptId) ? a.excerptId : a.excerpt}
        <a
          href={`/blog/${a.slug}`}
          class="grid grid-cols-12 group {i < articles.length - 1 ? 'border-b border-border' : ''} hover:bg-secondary/40 transition-colors"
        >
          <div class="col-span-12 md:col-span-2 px-5 md:px-8 py-6 label-mono text-muted-foreground border-b md:border-b-0 md:border-r border-border">
            {new Date(a.createdAt).toLocaleDateString(lang === 'en' ? 'en-US' : 'id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div class="col-span-12 md:col-span-7 px-5 md:px-8 py-6 md:border-r border-border">
            <p class="font-display text-2xl md:text-3xl group-hover:text-accent transition-colors">
              {aTitle}
            </p>
            <p class="mt-2 text-foreground/70">{aExcerpt}</p>
          </div>
          <div class="col-span-12 md:col-span-3 px-5 md:px-8 py-6 flex items-center justify-between md:justify-end label-mono text-muted-foreground gap-4">
            <span>Detail</span>
            <span>→</span>
          </div>
        </a>
      {/each}
    </div>
  </section>

  <!-- FAQ -->
  <section class="grid grid-cols-12 border-b border-border">
    <div class="col-span-12 md:col-span-5 px-5 md:px-10 py-14 border-r border-border">
      <p class="eyebrow">{$_('faq.eyebrow')}</p>
      <h2 class="display-lg mt-6">{$_('faq.title').split(' ')[0]}<br />{$_('faq.title').split(' ')[1] || ''}</h2>
    </div>
    <div class="col-span-12 md:col-span-7">
      {#each faqs as f, i}
        <details
          class="group px-5 md:px-10 py-6 {i < faqs.length - 1 ? 'border-b border-border' : ''}"
        >
          <summary class="flex justify-between items-start gap-6 cursor-pointer list-none">
            <span class="font-display text-xl md:text-2xl">{f.q}</span>
            <span class="label-mono mt-1 group-open:rotate-45 transition-transform">+</span>
          </summary>
          <p class="mt-4 text-foreground/70 max-w-2xl leading-relaxed">{f.a}</p>
        </details>
      {/each}
    </div>
  </section>

  <!-- CONTACT -->
  <section class="grid grid-cols-12">
    <div class="col-span-12 md:col-span-5 px-5 md:px-10 py-16 border-r border-border">
      <p class="eyebrow">{$_('contact.eyebrow')}</p>
      <h2 class="display-lg mt-6">{$_('contact.title').split(' ')[0]}<br />{$_('contact.title').split(' ').slice(1).join(' ')}</h2>
    </div>
    <div class="col-span-12 md:col-span-7 px-5 md:px-10 py-16">
      <p class="text-lg leading-relaxed text-foreground/80 max-w-xl">
        {$_('contact.description')}
      </p>
      <div class="mt-10 flex flex-wrap gap-4">
        <a
          href="mailto:ilham.na.ar@gmail.com"
          class="px-8 py-4 bg-accent text-accent-foreground label-mono hover:bg-accent/90 transition-colors"
        >
          {$_('contact.email')}
        </a>
        <a
          href="https://wa.me/6285176913030"
          target="_blank"
          class="px-8 py-4 border border-border label-mono hover:bg-secondary transition-colors"
        >
          {$_('contact.whatsapp')}
        </a>
      </div>
    </div>
  </section>
</div>
