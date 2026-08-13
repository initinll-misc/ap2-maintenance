<script lang="ts">
  import SectionCard from '$lib/components/reusable/SectionCard.svelte';
  import Table from '$lib/components/reusable/Table.svelte';
  import MiniHighlightBox from '$lib/components/reusable/MiniHighlightBox.svelte';
  import type { MaintenanceConfig } from '$lib/types/config';
  import type { MaintenanceResult } from '$lib/types/maintenance';
  import { formatMonthLabel, type CurrencyFormatter } from '$lib/utils/format';

  interface Props {
    config: MaintenanceConfig;
    result: MaintenanceResult;
    fmt: CurrencyFormatter;
  }

  let { config: _config, result, fmt }: Props = $props();

  const temporary = $derived(result.temporary);

  const chargeRows = $derived(
    temporary.charges.map((charge, index) => {
      const periodNote = `${formatMonthLabel(charge.startMonth)} – ${formatMonthLabel(charge.endMonth)}`;
      const note = charge.note ? `${periodNote} · ${charge.note}` : periodNote;
      return {
        num: index + 1,
        label: charge.label,
        note,
        monthly: fmt(charge.monthlyAmount),
        annual: fmt(charge.annualAmount),
      };
    })
  );
</script>

<SectionCard
  variant="temporary"
  icon="schedule"
  title="Temporary Charges"
  meta="Time-bound levies for selected month"
  hidden={temporary.charges.length === 0}
>
  <Table headerClass="purple lighten-5" rows={chargeRows} />

  <MiniHighlightBox
    mode="total"
    variant="temporary"
    label="Total Temporary"
    monthly={fmt(temporary.total)}
    annual={fmt(result.annual.temporaryAnnual)}
  />
</SectionCard>
