<script lang="ts">
  import { experience } from '$lib/content';
  import portrait from '$lib/assets/about.webp';
  // import type { PageData } from './$types';

  // let { data }: { data: PageData } = $props();
</script>

<div>
  <section class="grid grid-cols-12 border-b border-border">
    <div class="col-span-12 lg:col-span-5 border-r border-border">
      <img src={portrait} alt="Portrait of Arbani"
        width="1024" height="1024"
        class="w-full aspect-square object-cover" />
    </div>
    <div class="col-span-12 lg:col-span-7 px-5 md:px-10 py-12 md:py-20 flex flex-col justify-center">
      <p class="eyebrow mb-6">About · A short biography</p>
      <h1 class="display-xl">
        Ilham N Arbani<br />
        <span class="italic text-accent font-medium">Full Stack.</span>
      </h1>
      <p class="mt-8 max-w-xl text-xl text-foreground/80 leading-relaxed">
        Software Engineer & Full Stack JavaScript Specialist with over 5 years
        of experience in architecting and developing scalable applications.
      </p>
      <div class="mt-10 grid grid-cols-3 gap-px bg-border border border-border max-w-md">
        {#each [
          ['Based', 'Yogyakarta, ID'],
          ['Status', "Open Aut. '26"],
          ['Pronouns', 'he / him'],
        ] as [k, v]}
          <div class="bg-background px-4 py-3">
            <p class="eyebrow">{k}</p>
            <p class="label-mono mt-1">{v}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <section class="grid grid-cols-12 border-b border-border">
    <div class="col-span-12 md:col-span-3 px-5 md:px-10 py-12 border-r border-border">
      <p class="eyebrow">§ Biography</p>
    </div>
    <div class="col-span-12 md:col-span-9 px-5 md:px-12 py-12">
      <div class="max-w-2xl space-y-7 text-lg leading-relaxed text-foreground/85 font-display">
        <p class="first-letter:font-display first-letter:text-7xl first-letter:float-left first-letter:mr-3 first-letter:leading-[0.85] first-letter:text-accent">
          I am a Software Engineer with a deep passion for the modern JavaScript ecosystem.
          My journey began with a fascination for how data flows through complex systems,
          leading me to specialize in architecting scalable web and mobile applications.
        </p>
        <p>
          Over the past 5+ years, I've worked across various industries, from e-commerce to
          healthcare, helping startups and established companies solve business challenges
          through elegant code. I believe that good software is built on a foundation of
          clean architecture, maintainability, and performance.
        </p>
        <p>
          Currently, I'm working as a Front End Developer at Tonjoo, where I focus on
          building high-performance web applications using React and Next.js. I'm always
          exploring new ways to optimize development workflows and improve user experiences.
        </p>
        <p>
          Beyond coding, I'm interested in AI integration and how it can be used to
          drive business optimization. I enjoy mentoring fellow developers and
          contributing to the local tech community.
        </p>
      </div>
    </div>
  </section>

  <section class="grid grid-cols-12 border-b border-border">
    <div class="col-span-12 md:col-span-3 px-5 md:px-10 py-12 border-r border-border">
      <p class="eyebrow">§ Experience</p>
    </div>
    <div class="col-span-12 md:col-span-9">
      {#each experience as e, i}
        <div class="grid grid-cols-12 px-5 md:px-12 py-7 {i < experience.length - 1 ? 'border-b border-border' : ''}">
          <div class="col-span-12 md:col-span-3 label-mono text-muted-foreground">{e.period}</div>
          <div class="col-span-12 md:col-span-9 mt-2 md:mt-0">
            <p class="font-display text-2xl">{e.role}</p>
            <p class="text-accent label-mono mt-1">{e.company}</p>
            <p class="mt-2 text-foreground/70 max-w-xl">{e.description}</p>
          </div>
        </div>
      {/each}
    </div>
  </section>
</div>
