<script lang="ts">
  import { onMount } from 'svelte';
  import MaintenanceCard from '$lib/components/reusable/MaintenanceCard.svelte';
  import ErrorCard from '$lib/components/reusable/ErrorCard.svelte';
  import FlatAreaCard from '$lib/components/cards/FlatAreaCard.svelte';
  import FixedExpenseCard from '$lib/components/cards/FixedExpenseCard.svelte';
  import VariableExpenseCard from '$lib/components/cards/VariableExpenseCard.svelte';
  import TemporaryChargesCard from '$lib/components/cards/TemporaryChargesCard.svelte';
  import TotalMaintenanceCard from '$lib/components/cards/TotalMaintenanceCard.svelte';
  import { loadMaintenanceConfig } from '$lib/services/config';
  import { calculateMaintenance } from '$lib/services/maintenance';
  import type { MaintenanceConfig } from '$lib/types/config';
  import { createFormatter, currentBillingMonth } from '$lib/utils/format';

  let config = $state<MaintenanceConfig | null>(null);
  let loadError = $state<string | null>(null);
  let carpet = $state(0);
  let balcony = $state(0);
  let billingMonth = $state(currentBillingMonth());

  const result = $derived(
    config
      ? calculateMaintenance(
          config,
          Number(carpet) || 0,
          Number(balcony) || 0,
          billingMonth
        )
      : null
  );

  onMount(async () => {
    try {
      config = await loadMaintenanceConfig();
      carpet = config.defaults.carpetArea;
      balcony = config.defaults.balconyArea;
    } catch (err) {
      loadError = err instanceof Error ? err.message : 'Unknown error';
    }
  });
</script>

{#if loadError}
  <ErrorCard message={loadError} />
{:else if !config}
  <p class="loading center-align grey-text" aria-busy="true">Loading maintenance config…</p>
{:else if result}
  {@const fmt = createFormatter(config)}
  <MaintenanceCard {result} {fmt} />
  <FlatAreaCard {config} {result} bind:carpet bind:balcony bind:billingMonth />
  <FixedExpenseCard {config} {result} {fmt} />
  <VariableExpenseCard {config} {result} {fmt} />
  <TemporaryChargesCard {config} {result} {fmt} />
  <TotalMaintenanceCard {config} {result} {fmt} />
{/if}

<style>
  .loading {
    margin: 2rem 0;
    font-size: 0.95rem;
  }
</style>
