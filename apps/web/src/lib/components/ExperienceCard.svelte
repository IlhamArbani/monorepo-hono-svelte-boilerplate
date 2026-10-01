<script lang="ts">
  import { _ } from 'svelte-i18n';

  let {
    startMonth,
    startYear,
    endMonth,
    endYear,
    role,
    company,
    description,
    isLast = false
  }: {
    startMonth: number;
    startYear: number;
    endMonth: number;
    endYear: number;
    role: string;
    company: string;
    description: string;
    isLast?: boolean;
  } = $props();

  const period = $derived.by(() => {
    const start = `${$_(`month.${startMonth}`)} ${startYear}`;

    if (endMonth && endYear) {
      return `${start} — ${$_(`month.${endMonth}`)} ${endYear}`;
    }

    return `${start} — ${$_('career.present')}`;
  })
</script>

<div
  class="grid grid-cols-12 px-5 md:px-10 py-7 {!isLast ? 'border-b border-border' : ''}"
>
  <div class="col-span-12 md:col-span-3 label-mono text-muted-foreground">
    {period}
  </div>
  <div class="col-span-12 md:col-span-9 mt-2 md:mt-0">
    <p class="font-display text-2xl">{role}</p>
    <p class="text-accent label-mono mt-1">{company}</p>
    <p class="mt-3 text-foreground/70 max-w-xl">{description}</p>
  </div>
</div>
