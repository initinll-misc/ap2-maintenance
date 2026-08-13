<script lang="ts">
  import type { MaintenanceResult } from '$lib/types/maintenance';
  import { formatMonthLabel, type CurrencyFormatter } from '$lib/utils/format';

  interface Props {
    result: MaintenanceResult;
    fmt: CurrencyFormatter;
  }

  let { result, fmt }: Props = $props();
</script>

<div class="card maintenance-card hoverable z-depth-2" aria-live="polite">
  <div class="card-content center-align white-text blue darken-2 maintenance-card__body">
    <p class="maintenance-card__label">Your monthly maintenance</p>
    <h2 class="maintenance-card__amount">{fmt(result.grandMonthly)}</h2>
    <p class="maintenance-card__sub">
      {formatMonthLabel(result.billingMonth)}
      &nbsp;·&nbsp; Annual {fmt(result.grandAnnual)}
    </p>
  </div>
</div>

<style>
  .maintenance-card {
    margin-top: 0;
    margin-bottom: 16px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: var(--card-shadow);
    transition: box-shadow 0.25s ease;
  }

  .maintenance-card.hoverable:hover {
    box-shadow: var(--card-shadow-hover);
  }

  .maintenance-card__body {
    padding: 20px 16px !important;
  }

  .maintenance-card__label {
    margin: 0;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    opacity: 0.9;
  }

  .maintenance-card__amount {
    margin: 6px 0;
    font-size: 2.25rem;
    font-weight: 400;
    font-variant-numeric: tabular-nums;
  }

  .maintenance-card__sub {
    margin: 0;
    font-size: 0.85rem;
    opacity: 0.9;
  }

  @media only screen and (min-width: 601px) {
    .maintenance-card__amount {
      font-size: 2.75rem;
    }
  }

  @media only screen and (max-width: 600px) {
    .maintenance-card__body {
      padding: 16px 12px !important;
    }

    .maintenance-card__amount {
      font-size: 1.85rem;
    }

    .maintenance-card__sub {
      font-size: 0.8rem;
      line-height: 1.4;
    }
  }

  @media only screen and (max-width: 380px) {
    .maintenance-card__amount {
      font-size: 1.65rem;
    }
  }
</style>
