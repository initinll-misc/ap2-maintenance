<script lang="ts">
  type HighlightVariant = 'area' | 'fixed' | 'variable';

  interface Props {
    variant: HighlightVariant;
    icon: string;
    label: string;
    value: string;
    unit?: string;
    formula?: string;
    ariaLive?: boolean;
  }

  let {
    variant,
    icon,
    label,
    value,
    unit = '',
    formula = '',
    ariaLive = true,
  }: Props = $props();

  const isArea = $derived(variant === 'area');
</script>

{#if isArea}
  <div class="area-highlight" aria-live={ariaLive ? 'polite' : undefined}>
    <div class="area-highlight__icon-wrap">
      <i class="material-icons area-highlight__icon" aria-hidden="true">{icon}</i>
    </div>
    <div class="area-highlight__content center-align">
      <p class="area-highlight__label">{label}</p>
      <p class="area-highlight__value">
        <span>{value}</span>
        {#if unit}
          <span class="area-highlight__unit">{unit}</span>
        {/if}
      </p>
      {#if formula}
        <p class="area-highlight__formula grey-text text-darken-1">{formula}</p>
      {/if}
    </div>
  </div>
{:else}
  <div
    class="stat-highlight stat-highlight--{variant}"
    aria-live={ariaLive ? 'polite' : undefined}
  >
    <div class="stat-highlight__icon-wrap">
      <i class="material-icons stat-highlight__icon" aria-hidden="true">{icon}</i>
    </div>
    <div class="stat-highlight__content center-align">
      <p class="stat-highlight__label">{label}</p>
      <p class="stat-highlight__value"><span>{value}</span></p>
      {#if formula}
        <p class="stat-highlight__formula">{formula}</p>
      {/if}
    </div>
  </div>
{/if}

<style>
  .area-highlight {
    display: flex;
    align-items: center;
    gap: 16px;
    margin: 16px 0 20px;
    padding: 20px 18px;
    border-radius: 10px;
    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
    border: 2px solid #1976d2;
    box-shadow: var(--card-shadow);
  }

  .area-highlight__icon-wrap {
    flex-shrink: 0;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #1976d2;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(25, 118, 210, 0.35);
  }

  .area-highlight__icon {
    font-size: 32px;
    color: #fff;
  }

  .area-highlight__content {
    flex: 1;
    min-width: 0;
  }

  .area-highlight__label {
    margin: 0;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #1565c0;
  }

  .area-highlight__value {
    margin: 4px 0 2px;
    font-size: 2.5rem;
    font-weight: 500;
    line-height: 1.1;
    color: #0d47a1;
    font-variant-numeric: tabular-nums;
  }

  .area-highlight__unit {
    font-size: 1.1rem;
    font-weight: 400;
    color: #1976d2;
    margin-left: 4px;
  }

  .area-highlight__formula {
    margin: 0;
    font-size: 0.82rem;
  }

  .stat-highlight {
    display: flex;
    align-items: center;
    gap: 16px;
    margin: 16px 0;
    padding: 20px 18px;
    border-radius: 10px;
    box-shadow: var(--card-shadow);
  }

  .stat-highlight__icon-wrap {
    flex-shrink: 0;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .stat-highlight__icon {
    font-size: 32px;
    color: #fff;
  }

  .stat-highlight__content {
    flex: 1;
    min-width: 0;
  }

  .stat-highlight__label {
    margin: 0;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .stat-highlight__value {
    margin: 4px 0 2px;
    font-size: 2.5rem;
    font-weight: 500;
    line-height: 1.1;
    font-variant-numeric: tabular-nums;
  }

  .stat-highlight__formula {
    margin: 0;
    font-size: 0.82rem;
  }

  .stat-highlight--fixed {
    background: linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%);
    border: 2px solid #3949ab;
  }

  .stat-highlight--fixed .stat-highlight__icon-wrap {
    background: #3949ab;
  }

  .stat-highlight--fixed .stat-highlight__label,
  .stat-highlight--fixed .stat-highlight__value {
    color: #1a237e;
  }

  .stat-highlight--fixed .stat-highlight__formula {
    color: #3949ab;
  }

  .stat-highlight--variable {
    background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
    border: 2px solid #388e3c;
  }

  .stat-highlight--variable .stat-highlight__icon-wrap {
    background: #388e3c;
  }

  .stat-highlight--variable .stat-highlight__label,
  .stat-highlight--variable .stat-highlight__value {
    color: #1b5e20;
  }

  @media only screen and (min-width: 601px) {
    .area-highlight__value,
    .stat-highlight__value {
      font-size: 3rem;
    }

    .area-highlight__icon-wrap,
    .stat-highlight__icon-wrap {
      width: 64px;
      height: 64px;
    }

    .area-highlight__icon,
    .stat-highlight__icon {
      font-size: 36px;
    }
  }

  @media only screen and (max-width: 600px) {
    .area-highlight,
    .stat-highlight {
      padding: 14px 12px;
      gap: 12px;
      margin: 14px 0;
    }

    .area-highlight__icon-wrap,
    .stat-highlight__icon-wrap {
      width: 46px;
      height: 46px;
    }

    .area-highlight__icon,
    .stat-highlight__icon {
      font-size: 26px;
    }

    .area-highlight__value,
    .stat-highlight__value {
      font-size: 1.85rem;
    }

    .area-highlight__unit {
      font-size: 0.95rem;
    }
  }

  @media only screen and (max-width: 380px) {
    .area-highlight__value,
    .stat-highlight__value {
      font-size: 1.65rem;
    }
  }
</style>
