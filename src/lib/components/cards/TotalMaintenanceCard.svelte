<script lang="ts">
  import SectionCard from '$lib/components/reusable/SectionCard.svelte';
  import Table from '$lib/components/reusable/Table.svelte';
  import MiniHighlightBox from '$lib/components/reusable/MiniHighlightBox.svelte';
  import type { MaintenanceConfig } from '$lib/types/config';
  import type { MaintenanceResult } from '$lib/types/maintenance';
  import type { CurrencyFormatter } from '$lib/utils/format';

  interface Props {
    config: MaintenanceConfig;
    result: MaintenanceResult;
    fmt: CurrencyFormatter;
  }

  let { config: _config, result, fmt }: Props = $props();
</script>

<SectionCard
  variant="total"
  icon="receipt_long"
  title="Total Maintenance"
  meta="Fixed + Variable + Temporary"
  extraClass="total-card z-depth-3"
>
  <Table
    headerClass="orange lighten-4"
    rows={[
      {
        num: 1,
        label: 'Fixed (Round Off)',
        monthly: fmt(result.fixed.rounded),
        annual: fmt(result.fixed.rounded * 12),
      },
      {
        num: 2,
        label: 'Variable',
        monthly: fmt(result.variable.total),
        annual: fmt(result.variable.totalAnnual),
      },
      ...(result.temporary.total > 0
        ? [
            {
              num: 3,
              label: 'Temporary Charges',
              monthly: fmt(result.temporary.total),
              annual: fmt(result.annual.temporaryAnnual),
            },
          ]
        : []),
    ]}
    footers={[
      {
        label: 'Total Maintenance (Per Flat)',
        monthly: fmt(result.exactMonthly),
        annual: fmt(result.annual.grandAnnual),
        rowClass: 'grand-row',
      },
    ]}
  />

  <MiniHighlightBox
    mode="total"
    variant="summary"
    label="Total Maintenance — Per Flat (Round Off)"
    monthly={fmt(result.grandMonthly)}
    annual={fmt(result.grandAnnual)}
  />
</SectionCard>
