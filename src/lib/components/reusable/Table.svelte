<script lang="ts">
  export type TableRow = {
    num?: number | string;
    label: string;
    note?: string;
    monthly?: string;
    annual?: string;
    units?: string;
    rowClass?: string;
    formula?: string;
  };

  type TableTheme = 'blue' | 'green' | 'purple' | 'orange';

  interface Props {
    headerClass: string;
    rows: TableRow[];
    mode?: 'cost' | 'units';
    footers?: TableRow[];
    compact?: boolean;
  }

  let {
    headerClass,
    rows,
    mode = 'cost',
    footers = [],
    compact = false,
  }: Props = $props();

  function themeFromHeaderClass(className: string): TableTheme {
    if (className.includes('green')) return 'green';
    if (className.includes('purple')) return 'purple';
    if (className.includes('orange')) return 'orange';
    return 'blue';
  }

  const theme = $derived(themeFromHeaderClass(headerClass));

  function footerRowClass(row: TableRow): string {
    const base = row.rowClass ?? 'row-building-total';
    return `${base} footer-theme-${theme}`;
  }
</script>

<div class="table-wrap" class:table-wrap--compact={compact}>
  <table class="striped highlight cost-table" class:cost-table--compact={compact}>
    {#if mode === 'cost'}
      <thead class={headerClass}>
        <tr>
          <th class="center-align col-num">#</th>
          <th>Particulars</th>
          <th class="right-align">Monthly</th>
          <th class="right-align">Annually</th>
        </tr>
      </thead>
      <tbody>
        {#each rows as row}
          <tr class={row.rowClass ?? ''}>
            <td class="center-align col-num">{row.num ?? ''}</td>
            <td>
              {row.label}
              {#if row.note}
                <span class="item-note">{row.note}</span>
              {/if}
            </td>
            <td class="right-align">{row.monthly ?? ''}</td>
            <td class="right-align">{row.annual ?? ''}</td>
          </tr>
          {#if row.formula}
            <tr class="row-formula">
              <td colspan="4" class="formula-note">{row.formula}</td>
            </tr>
          {/if}
        {/each}
      </tbody>
      {#if footers.length}
        <tfoot>
          {#each footers as footer}
            <tr class={footerRowClass(footer)}>
              <td class="col-num"></td>
              <td>{footer.label}</td>
              <td class="right-align">{footer.monthly ?? ''}</td>
              <td class="right-align">{footer.annual ?? ''}</td>
            </tr>
          {/each}
        </tfoot>
      {/if}
    {:else}
      <thead class={headerClass}>
        <tr>
          <th class="center-align col-num">#</th>
          <th>Apartment Type</th>
          <th class="right-align">Units</th>
        </tr>
      </thead>
      <tbody>
        {#each rows as row}
          <tr>
            <td class="center-align col-num">{row.num ?? ''}</td>
            <td>{row.label}</td>
            <td class="right-align">{row.units ?? ''}</td>
          </tr>
        {/each}
      </tbody>
      {#if footers.length}
        <tfoot>
          {#each footers as footer}
            <tr class="row-building-total footer-theme-{theme}">
              <td class="col-num"></td>
              <td>{footer.label}</td>
              <td class="right-align">{footer.units ?? ''}</td>
            </tr>
          {/each}
        </tfoot>
      {/if}
    {/if}
  </table>
</div>

<style>
  .table-wrap {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin: 0 0 8px;
    border-radius: 8px;
    background: #fff;
    box-shadow: var(--card-shadow);
  }

  .table-wrap--compact {
    margin-top: 8px;
  }

  table.cost-table {
    width: 100%;
    min-width: 18.75rem;
    border-collapse: collapse;
    font-size: 0.875rem;
    color: #263238;
    margin: 0;
  }

  table.cost-table th,
  table.cost-table td {
    border-bottom: 1px solid #b0bec5 !important;
  }

  table.cost-table th:not(:last-child),
  table.cost-table td:not(:last-child) {
    border-right: 1px solid #b0bec5 !important;
  }

  table.cost-table :global(thead th) {
    border-bottom: 2px solid #90a4ae !important;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 11px 10px;
    font-weight: bold !important;
  }

  table.cost-table:global(.striped) > tbody > tr:nth-child(odd) > td {
    background: #eceff1 !important;
  }

  table.cost-table:global(.highlight) > tbody > tr:hover > td {
    background: #e8eef3 !important;
  }

  table.cost-table td {
    padding: 10px 10px;
    vertical-align: middle;
  }

  table.cost-table tbody td {
    color: #263238;
    font-weight: 500;
  }

  table.cost-table td.right-align {
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    font-weight: 600;
    color: #1a237e;
  }

  table.cost-table :global(thead th.right-align) {
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  table.cost-table .col-num {
    width: 2.25rem;
    padding-left: 8px;
    padding-right: 8px;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  table.cost-table tbody td.col-num {
    color: #212121;
    font-weight: 500;
    font-size: inherit;
  }

  table.cost-table :global(thead th.col-num) {
    font-size: inherit;
  }

  table.cost-table tbody td:nth-child(2) {
    color: #212121;
    font-weight: 500;
    word-break: break-word;
    overflow-wrap: anywhere;
  }

  /* Themed header + footer — matched background, text color, bold */
  table.cost-table :global(thead.blue.lighten-5 th),
  table.cost-table tr.footer-theme-blue td {
    background: #e3f2fd !important;
    color: #1565c0 !important;
    font-weight: 700 !important;
  }

  table.cost-table tr.footer-theme-blue td {
    border-top: 2px solid #90caf9 !important;
  }

  table.cost-table :global(thead.green.lighten-5 th),
  table.cost-table tr.footer-theme-green td {
    background: #e8f5e9 !important;
    color: #2e7d32 !important;
    font-weight: 700 !important;
  }

  table.cost-table tr.footer-theme-green td {
    border-top: 2px solid #a5d6a7 !important;
  }

  table.cost-table :global(thead.purple.lighten-5 th),
  table.cost-table tr.footer-theme-purple td {
    background: #f3e5f5 !important;
    color: #6a1b9a !important;
    font-weight: 700 !important;
  }

  table.cost-table tr.footer-theme-purple td {
    border-top: 2px solid #ce93d8 !important;
  }

  table.cost-table :global(thead.orange.lighten-4 th),
  table.cost-table tr.footer-theme-orange td,
  table.cost-table tr.grand-row td {
    background: #ffe0b2 !important;
    color: #e65100 !important;
    font-weight: 700 !important;
  }

  table.cost-table tr.footer-theme-orange td,
  table.cost-table tr.grand-row td {
    border-top: 2px solid #ffb74d !important;
  }

  table.cost-table tr.row-building-total td,
  table.cost-table tr.grand-row td {
    font-size: 0.9rem;
    padding: 12px 10px !important;
  }

  table.cost-table tr.grand-row td {
    font-size: 0.95rem;
    padding: 13px 10px !important;
  }

  table.cost-table--compact th,
  table.cost-table--compact td {
    padding: 8px 10px;
    font-size: 0.825rem;
  }

  .item-note {
    display: block;
    font-size: 0.72rem;
    color: #9e9e9e;
    margin-top: 2px;
    font-weight: 400;
  }

  .formula-note {
    font-size: 0.8rem;
    color: #33691e;
    font-style: italic;
    line-height: 1.45;
    padding: 8px 12px 11px !important;
    background: #f1f8e9 !important;
    font-weight: 500;
  }

  table.cost-table tr.row-calc td {
    color: #455a64;
    font-size: 0.825rem;
    font-weight: 500;
    background: #fafafa !important;
  }

  table.cost-table tr.row-formula td {
    border-bottom: 1px solid #a5d6a7 !important;
  }

  @media only screen and (max-width: 600px) {
    .table-wrap {
      margin-left: -2px;
      margin-right: -2px;
    }

    table.cost-table {
      font-size: 0.8125rem;
    }

    table.cost-table :global(thead th) {
      font-size: 0.65rem;
      padding: 9px 6px;
      letter-spacing: 0.03em;
    }

    table.cost-table td {
      padding: 8px 6px;
    }

    table.cost-table .col-num {
      width: 1.75rem;
      padding-left: 4px;
      padding-right: 4px;
    }

    table.cost-table--compact th,
    table.cost-table--compact td {
      padding: 7px 6px;
      font-size: 0.78rem;
    }

    table.cost-table tr.row-building-total td,
    table.cost-table tr.grand-row td {
      font-size: 0.82rem;
      padding: 10px 6px !important;
    }

    table.cost-table tr.grand-row td {
      font-size: 0.88rem;
    }

    .formula-note {
      font-size: 0.75rem;
      padding: 7px 8px 9px !important;
      white-space: normal;
    }
  }
</style>
