<script lang="ts">
  import SectionCard from '$lib/components/reusable/SectionCard.svelte';
  import Table from '$lib/components/reusable/Table.svelte';
  import BigHighlightBox from '$lib/components/reusable/BigHighlightBox.svelte';
  import MiniHighlightBox from '$lib/components/reusable/MiniHighlightBox.svelte';
  import type { MaintenanceConfig } from '$lib/types/config';
  import type { MaintenanceResult } from '$lib/types/maintenance';
  import type { CurrencyFormatter } from '$lib/utils/format';

  interface Props {
    config: MaintenanceConfig;
    result: MaintenanceResult;
    fmt: CurrencyFormatter;
  }

  let { config, result, fmt }: Props = $props();

  const variable = $derived(result.variable);

  const formulaNotes = $derived(
    Object.fromEntries(config.expenses.variable.funds.map((fund) => [fund.id, fund.formulaNote ?? '']))
  );

  const fundRows = $derived(
    variable.funds.map((fund, index) => ({
      num: index + 1,
      label: fund.label,
      monthly: fmt(fund.monthly),
      annual: fmt(fund.annual),
      formula: formulaNotes[fund.id],
    }))
  );
</script>

<SectionCard
  variant="variable"
  icon="trending_up"
  title="Variable Expenses — Per Sq. Ft."
  meta="Sinking fund & repair fund based on usable area"
>
  <BigHighlightBox
    variant="variable"
    icon="square_foot"
    label="Construction Cost Per Sq. Ft."
    value={fmt(variable.constructionCostPerSqFt)}
  />

  <Table
    headerClass="green lighten-5"
    rows={fundRows}
    footers={[
      {
        label: 'Total Variable (Per Flat)',
        monthly: fmt(variable.total),
        annual: fmt(variable.totalAnnual),
      },
    ]}
  />

  <MiniHighlightBox
    mode="total"
    variant="variable"
    label="Total Variable (Per Flat)"
    monthly={fmt(variable.total)}
    annual={fmt(variable.totalAnnual)}
  />
</SectionCard>
