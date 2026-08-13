<script lang="ts">
  import SectionCard from '$lib/components/reusable/SectionCard.svelte';
  import Table from '$lib/components/reusable/Table.svelte';
  import BigHighlightBox from '$lib/components/reusable/BigHighlightBox.svelte';
  import MiniHighlightBox from '$lib/components/reusable/MiniHighlightBox.svelte';
  import type { UnitType, MaintenanceConfig } from '$lib/types/config';
  import type { MaintenanceResult } from '$lib/types/maintenance';
  import type { CurrencyFormatter } from '$lib/utils/format';

  interface Props {
    config: MaintenanceConfig;
    result: MaintenanceResult;
    fmt: CurrencyFormatter;
  }

  let { config, result, fmt }: Props = $props();

  const fixed = $derived(result.fixed);
  const flatCount = $derived(result.flatCount);

  const itemRows = $derived(
    fixed.items.map((item, index) => ({
      num: index + 1,
      label: item.label,
      monthly: fmt(item.societyMonthly),
      annual: fmt(item.societyAnnual),
    }))
  );

  const unitTypeRows = $derived(
    config.expenses.fixed.unitTypes.map((type: UnitType, index: number) => ({
      num: index + 1,
      label: type.label,
      units: String(type.units),
    }))
  );
</script>

<SectionCard
  variant="fixed"
  icon="business"
  title="Fixed Expenses — Shared Equally"
  meta="Building common expense · shared equally across all flats"
>
  <Table
    headerClass="blue lighten-5"
    rows={itemRows}
    footers={[
      {
        label: 'Total Fixed Cost (Per Building)',
        monthly: fmt(fixed.totalMonthly),
        annual: fmt(fixed.totalAnnual),
      },
    ]}
  />

  <div class="unit-types-block">
    <MiniHighlightBox
      mode="details"
      icon="apartment"
      title="Apartment Type Bifurcation"
      meta="Unit count by apartment type"
    />
    <Table
      headerClass="blue lighten-5"
      mode="units"
      rows={unitTypeRows}
      footers={[{ label: 'Total', units: String(flatCount) }]}
    />
  </div>

  <BigHighlightBox
    variant="fixed"
    icon="apartment"
    label="No. of Flats"
    value={String(flatCount)}
  />

  <div class="calc-details">
    <MiniHighlightBox
      mode="details"
      icon="calculate"
      title="Per-flat calculation details"
      meta="Building common expense ÷ No. of Flats * {fixed.bufferPercent}% buffer applied"
    />
    <Table
      headerClass="blue lighten-5"
      rows={[
        {
          num: 1,
          label: 'Per Flat Fixed Cost (before buffer)',
          monthly: fmt(fixed.perFlat),
          annual: fmt(fixed.perFlat * 12),
          rowClass: 'row-calc',
        },
        {
          num: 2,
          label: `Buffer (${fixed.bufferPercent}%)`,
          monthly: fmt(fixed.bufferAmount),
          annual: fmt(fixed.bufferAmount * 12),
          rowClass: 'row-calc',
        },
      ]}
      footers={[
        {
          label: 'Total Fixed Cost (Per Flat)',
          monthly: fmt(fixed.withBuffer),
          annual: fmt(fixed.withBuffer * 12),
        },
      ]}
    />
  </div>

  <MiniHighlightBox
    mode="total"
    variant="fixed"
    label="Total Fixed — Per Flat (Round Off)"
    monthly={fmt(fixed.rounded)}
    annual={fmt(fixed.rounded * 12)}
  />
</SectionCard>

<style>
  .unit-types-block {
    margin-top: 14px;
    margin-bottom: 14px;
  }

  .calc-details {
    margin-top: 14px;
  }
</style>
