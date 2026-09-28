<script lang="ts">
  import {_} from 'svelte-i18n';
  const NAV = $derived([
    { to: '/', label: 'Home' },
    { to: '/projects', label: $_('nav.projects') },
    { to: '/blog', label: $_('nav.journal') },
    { to: '/about', label: $_('nav.about') },
  ]);
</script>

<footer class="border-t border-border">
  <div class="grid grid-cols-12">
    <div class="col-span-12 md:col-span-5 px-5 md:px-8 py-10 border-r border-border">
      <p class="font-display text-3xl md:text-5xl uppercase leading-[0.95]">
        {$_('footer.project_in_mind').split(' ').slice(0, 2).join(' ')}<br />
        <span class="text-accent">{$_('footer.project_in_mind').split(' ').slice(2).join(' ')}</span>
      </p>
      <a
        href="mailto:ilham.na.ar@gmail.com"
        class="inline-block mt-6 label-mono underline decoration-dotted underline-offset-4 hover:text-accent"
      >
        ilham.na.ar@gmail.com →
      </a>
    </div>
    <div class="col-span-6 md:col-span-4 px-5 md:px-8 py-10 border-r border-border">
      <p class="eyebrow mb-4">{$_('footer.elsewhere')}</p>
      <ul class="space-y-2 label-mono">
        <li><a href="https://github.com/IlhamArbani" class="hover:text-accent">GitHub</a></li>
        <li><a href="https://www.linkedin.com/in/ilham-naufal-arbani" class="hover:text-accent">Linkedin</a></li>
        <li><a href="https://www.instagram.com/arbani.codeserve" class="hover:text-accent">Instagram</a></li>
      </ul>
    </div>
    <div class="col-span-6 md:col-span-3 px-5 md:px-8 py-10">
      <p class="eyebrow mb-4">{$_('footer.index')}</p>
      <ul class="space-y-2 label-mono">
        {#each NAV as n}
          <li>
            <a href={n.to} class="hover:text-accent">{n.label}</a>
          </li>
        {/each}
      </ul>
    </div>
  </div>
  <div class="grid grid-cols-12 border-t border-border">
    <p class="col-span-6 px-5 md:px-8 py-5 label-mono border-r border-border text-muted-foreground">
      Arbani — MMXXVI
    </p>
    <p class="col-span-6 px-5 md:px-8 py-5 label-mono text-right text-muted-foreground">
      {$_('footer.rights')}
    </p>
  </div>
</footer>
