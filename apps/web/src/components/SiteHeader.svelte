<script lang="ts">
  import { _, locale } from 'svelte-i18n'
  import { page } from '$app/state';

  let lang = $derived($locale);
  

  const NAV = $derived([
    { to: '/', label: 'Home' },
    { to: '/projects', label: $_('nav.projects') },
    { to: '/blog', label:$_('nav.journal') },
    { to: '/about', label: $_('nav.about') },
  ]);

  let mobileOpen = $state(false);

  const pathname = $derived(page.url.pathname);
  const basePath = $derived(pathname.replace(/^\/id/, '') || '/');

  function isActive(itemTo: string): boolean {
    return itemTo === page.url.pathname
  }
</script>

<header class="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border">
  <div class="grid grid-cols-12 border-b border-border">
    <a
      href={lang === 'en' ? '/' : '/id'}
      class="col-span-6 md:col-span-3 px-5 md:px-8 py-5 border-r border-border flex items-center gap-3"
    >
      <span class="font-display font-bold uppercase leading-[0.85] text-lg md:text-xl tracking-tight">
        Ilham<br />Arbani
      </span>
    </a>

    <nav class="hidden md:flex col-span-8 divide-x divide-border">
      {#each NAV as item}
        <a
          href={item.to}
          class="flex-1 px-6 py-5 flex items-center label-mono transition-colors hover:text-accent {isActive(item.to) ? 'text-accent' : 'text-foreground/80'}"
        >
          {item.label}
        </a>
      {/each}
    </nav>

    <div class="col-span-3 md:col-span-1 flex items-center divide-x divide-border">
      <div class="hidden md:flex flex-1 items-center justify-center border-l border-border h-full">
        <div class="flex gap-2 label-mono text-xs">
          <button
            onclick={() => locale.set('en')}
            class="hover:text-accent transition-colors {lang === 'en' ? 'text-accent' : 'text-muted-foreground'}"
          >
            EN
          </button>
          <span class="text-border">/</span>
          <button
            onclick={() => locale.set('id')}
            class="hover:text-accent transition-colors {lang === 'id' ? 'text-accent' : 'text-muted-foreground'}"
          >
            ID
          </button>
        </div>
      </div>

      <button
        class="md:hidden flex-1 px-5 py-5 label-mono text-right"
        aria-label="Menu"
        onclick={() => mobileOpen = !mobileOpen}
      >
        {mobileOpen ? 'Close' : 'Menu'}
      </button>
    </div>
  </div>

  {#if mobileOpen}
    <div class="md:hidden border-b border-border bg-background">
      {#each NAV as item}
        <a href={item.to} class="block px-5 py-4 border-b border-border label-mono">
          {item.label}
        </a>
      {/each}
      <div class="flex gap-2 label-mono text-xs px-5 py-4">
        <a
          href={basePath}
          class="hover:text-accent transition-colors {lang === 'en' ? 'text-accent' : 'text-muted-foreground'}"
        >
          EN
        </a>
        <span class="text-border">/</span>
        <a
          href="/id{basePath === '/' ? '' : basePath}"
          class="hover:text-accent transition-colors {lang === 'id' ? 'text-accent' : 'text-muted-foreground'}"
        >
          ID
        </a>
      </div>
    </div>
  {/if}
</header>
